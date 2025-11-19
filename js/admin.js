const repoOwner = "marzuksuleman21-ui";
const repoName = "sentral";
const branch = "main";
const token = "GITHUB_TOKEN_KAMU"; // nanti gue kasih cara buat bikin token

async function uploadImage(file) {
    const fileName = Date.now() + "-" + file.name;
    const path = `images/menu/${fileName}`;

    const content = await fileToBase64(file);

    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`, {
        method: "PUT",
        headers: {
            "Authorization": `token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Tambah foto menu",
            content: content.split(",")[1]
        })
    });

    const data = await res.json();

    if (data.content && data.content.download_url) {
        return data.content.download_url;
    } else {
        throw new Error("Upload gagal");
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function saveMenu(name, category, price, photoURL) {
    const fileUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/menus.json`;

    let menus = await fetch(fileUrl).then(r => r.json());

    menus.push({
        name,
        category,
        price,
        photo: photoURL
    });

    const updated = btoa(JSON.stringify(menus, null, 2));

    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/menus.json`, {
        method: "PUT",
        headers: {
            "Authorization": `token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update menus.json",
            content: updated,
            sha: await getCurrentSHA()
        })
    });
}

async function getCurrentSHA() {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/menus.json`;
    const res = await fetch(url);
    const json = await res.json();
    return json.sha;
}

// Tombol SIMPAN
document.getElementById("btnSave").onclick = async () => {
    let name = document.getElementById("name").value;
    let category = document.getElementById("category").value;
    let price = document.getElementById("price").value;
    let file = document.getElementById("photo").files[0];

    if (!name || !price || !file) {
        alert("Lengkapi semua field");
        return;
    }

    try {
        let photoURL = await uploadImage(file);
        await saveMenu(name, category, price, photoURL);
        alert("Menu berhasil disimpan!");
    } catch (err) {
        alert("Gagal: " + err.message);
    }
};
