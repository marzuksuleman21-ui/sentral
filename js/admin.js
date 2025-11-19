// ========================================
// CONFIG
// ========================================
const GITHUB_TOKEN = "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"; // ganti token lo
const REPO_OWNER = "marzuksuleman21-ui";
const REPO_NAME = "sentral";
const BRANCH = "main";

// File paths
const MENUS_JSON_PATH = "sentral/menus.json";
const IMAGE_FOLDER = "sentral/images/menu/";


// ========================================
// HELPER: GitHub API Request
// ========================================
async function githubRequest(path, method, body) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}`;

    const options = {
        method,
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github+json",
        }
    };

    if (body) options.body = JSON.stringify(body);
    let res = await fetch(url, options);
    return res.json();
}

// ========================================
// LOAD menus.json (latest)
// ========================================
async function loadMenus() {
    const res = await githubRequest(`contents/${MENUS_JSON_PATH}`, "GET");
    const json = JSON.parse(atob(res.content));
    return { data: json, sha: res.sha };
}

// ========================================
// SAVE image to repo
// ========================================
async function uploadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result.split(",")[1];

            const fileName = Date.now() + "-" + file.name;
            const uploadPath = IMAGE_FOLDER + fileName;

            await githubRequest(`contents/${uploadPath}`, "PUT", {
                message: "Add product image",
                content: base64,
                branch: BRANCH
            });

            resolve("images/menu/" + fileName);
        };
        reader.readAsDataURL(file);
    });
}

// ========================================
// SAVE menus.json (commit update)
// ========================================
async function saveMenus(newData, sha) {
    await githubRequest(`contents/${MENUS_JSON_PATH}`, "PUT", {
        message: "Update menus.json",
        content: btoa(JSON.stringify(newData, null, 2)),
        sha,
        branch: BRANCH
    });
}

// ========================================
// HANDLE SAVE PRODUCT
// ========================================
document.getElementById("btnSave").onclick = async () => {
    const nama = document.getElementById("name").value;
    const kategori = document.getElementById("category").value;
    const harga = document.getElementById("price").value;
    const file = document.getElementById("photo").files[0];

    if (!nama || !kategori || !harga || !file) {
        alert("Lengkapi semua data.");
        return;
    }

    document.getElementById("btnSave").innerText = "Menyimpan...";
    document.getElementById("btnSave").disabled = true;

    // Upload image
    const imgPath = await uploadImage(file);

    // Load menus.json
    const { data, sha } = await loadMenus();

    // Tambahkan data baru
    data.push({
        name: nama,
        category: kategori,
        price: harga,
        photo: imgPath
    });

    // Save kembali menus.json
    await saveMenus(data, sha);

    alert("Produk berhasil ditambahkan!");
    location.reload();
};
