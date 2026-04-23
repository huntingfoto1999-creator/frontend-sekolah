let semuaData = [];
let dataTampil = [];

let currentPage = 1;
const perPage = 3;

const BASE_URL = "https://backend-sekolah-production-e347.up.railway.app";

async function load() {
    try {
        const res = await fetch(`${BASE_URL}/berita`);
        semuaData = await res.json();
        dataTampil = semuaData;
        tampilkan();
    } catch (err) {
        console.error("Gagal load berita:", err);
    }
}

function getImageUrl(gambar) {
    if (!gambar) {
        return "https://via.placeholder.com/400x250?text=No+Image";
    }

    if (gambar.startsWith("http://") || gambar.startsWith("https://")) {
        return gambar;
    }

    return `${BASE_URL}/uploads/${gambar}`;
}

function tampilkan() {
    const headline = document.getElementById("headline");
    const list = document.getElementById("news-list");
    const populer = document.getElementById("news-populer");
    const pagination = document.getElementById("pagination");

    if (!headline || !list || !populer || !pagination) return;

    if (dataTampil.length === 0) {
        list.innerHTML = "<p>Tidak ada berita</p>";
        headline.innerHTML = "";
        populer.innerHTML = "";
        pagination.innerHTML = "";
        return;
    }

    const start = (currentPage - 1) * perPage;
    const data = dataTampil.slice(start, start + perPage);

    const utama = data[0];

    headline.innerHTML = `
        <div class="headline" onclick="detail(${utama.id})">
            <img src="${getImageUrl(utama.gambar)}" alt="${utama.judul}">
            <div class="headline-text">
                <h2>${utama.judul}</h2>
            </div>
        </div>
    `;

    list.innerHTML = "";
    data.slice(1).forEach(item => {
        list.innerHTML += `
            <div class="news-item" onclick="detail(${item.id})">
                <img src="${getImageUrl(item.gambar)}" alt="${item.judul}">
                <div>
                    <h4>${item.judul}</h4>
                    <small>${item.tanggal}</small>
                </div>
            </div>
        `;
    });

    populer.innerHTML = "";
    semuaData.slice(0, 5).forEach(item => {
        populer.innerHTML += `
            <div class="populer-item" onclick="detail(${item.id})">
                <p>${item.judul}</p>
            </div>
        `;
    });

    const totalPage = Math.ceil(dataTampil.length / perPage);
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPage; i++) {
        pagination.innerHTML += `
            <button onclick="gantiHalaman(${i})" class="${i === currentPage ? "active" : ""}">
                ${i}
            </button>
        `;
    }
}

function gantiHalaman(page) {
    currentPage = page;
    tampilkan();
}

function cariBerita() {
    const input = document.getElementById("searchNews");
    const keyword = input ? input.value.toLowerCase() : "";

    dataTampil = semuaData.filter(item =>
        String(item.judul || "").toLowerCase().includes(keyword)
    );

    currentPage = 1;
    tampilkan();
}

function filterKategori() {
    const select = document.getElementById("kategoriNews");
    const kategori = select ? select.value : "";

    if (kategori === "") {
        dataTampil = semuaData;
    } else {
        dataTampil = semuaData.filter(item => item.kategori === kategori);
    }

    currentPage = 1;
    tampilkan();
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

function detail(id) {
    location.href = `detail.html?id=${id}`;
}

load();