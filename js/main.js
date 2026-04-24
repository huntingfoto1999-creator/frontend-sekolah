// ================= MENU MOBILE =================
const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("nav ul");
const megaDropdownLink = document.querySelector(".mega-dropdown > a");

if (toggle && menu) {
    toggle.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
}

// ================= DROPDOWN MOBILE =================
if (megaDropdownLink) {
    megaDropdownLink.addEventListener("click", function (e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            this.parentElement.classList.toggle("active");
        }
    });
}

// ================= NAVBAR SCROLL =================
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (nav) {
        nav.classList.toggle("scrolled", window.scrollY > 50);
    }
});

// ================= ACTIVE MENU =================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const offset = section.offsetTop - 120;
        const height = section.offsetHeight;

        if (window.scrollY >= offset && window.scrollY < offset + height) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

// ================= ANIMASI SCROLL =================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll("section").forEach(sec => {
    sec.classList.add("hidden");
    observer.observe(sec);
});

// ================= HELPER =================
function formatTanggalIndonesia(tanggal) {
    if (!tanggal) return "-";

    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return tanggal;

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function potongTeks(teks, panjang = 100) {
    const value = String(teks || "").trim();
    if (!value) return "-";
    if (value.length <= panjang) return value;
    return value.substring(0, panjang) + "...";
}

// ================= BERITA =================
let beritaData = [];
const container = document.getElementById("berita-list");

function getBeritaImage(gambar) {
    if (!gambar) {
        return "https://via.placeholder.com/400x250?text=No+Image";
    }

    if (gambar.startsWith("http://") || gambar.startsWith("https://")) {
        return gambar;
    }

   return `https://backend-sekolah-production-e347.up.railway.app/uploads/${gambar}`;
}

async function loadBerita() {
    try {
        const res = await fetch("https://backend-sekolah-production-e347.up.railway.app/berita")
        const data = await res.json();

        beritaData = Array.isArray(data) ? data : [];
        tampilkanBerita(beritaData.slice(0, 3));
    } catch (err) {
        console.log("Gagal load berita:", err);
    }
}

function tampilkanBerita(data) {
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(data) || !data.length) {
        container.innerHTML = "<p style='text-align:center;'>Belum ada berita.</p>";
        return;
    }

    data.forEach(item => {
        container.innerHTML += `
            <div class="berita-card" onclick="detail(${item.id})">
                <div class="berita-thumb">
                    <img src="${getBeritaImage(item.gambar)}" alt="${item.judul}">
                </div>
                <div class="berita-content">
                    <p class="berita-kategori">${item.kategori || "-"}</p>
                    <h3>${item.judul}</h3>
                    <small>${formatTanggalIndonesia(item.tanggal)}</small>
                    <p class="berita-ringkas">${potongTeks(item.isi, 90)}</p>
                </div>
            </div>
        `;
    });
}

function cariBerita() {
    const searchInput = document.getElementById("search");
    const keyword = searchInput ? searchInput.value.toLowerCase() : "";

    const hasil = beritaData.filter(item =>
        String(item.judul || "").toLowerCase().includes(keyword)
    );

    tampilkanBerita(hasil);
}

function detail(id) {
    location.href = `detail.html?id=${id}`;
}

function filterKategori() {
    const kategoriSelect = document.getElementById("filterKategori");
    const kategori = kategoriSelect ? kategoriSelect.value : "";

    if (kategori === "") {
        tampilkanBerita(beritaData.slice(0, 3));
    } else {
        const hasil = beritaData.filter(item => item.kategori === kategori);
        tampilkanBerita(hasil.slice(0, 3));
    }
}

// ================= PENGUMUMAN PUBLIK =================
async function loadPengumumanPublik() {
    try {
        const res = await fetch("https://backend-sekolah-production-e347.up.railway.app/pengumuman");
        const data = await res.json();

        const containerPengumuman = document.getElementById("pengumuman-list");
        if (!containerPengumuman) return;

        containerPengumuman.innerHTML = "";

        if (!Array.isArray(data) || !data.length) {
            containerPengumuman.innerHTML = "<p style='text-align:center;'>Belum ada pengumuman.</p>";
            return;
        }

        data.slice(0, 3).forEach(item => {
            containerPengumuman.innerHTML += `
                <div class="berita-card">
                    <div class="berita-content">
                        <p class="berita-kategori">${item.prioritas === "penting" ? "Penting" : "Informasi"}</p>
                        <h3>${item.judul}</h3>
                        <small>${formatTanggalIndonesia(item.tanggal)}</small>
                        <p class="berita-ringkas">${potongTeks(item.isi, 120)}</p>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.log("Gagal load pengumuman:", err);
    }
}

// ================= AGENDA PUBLIK =================
async function loadAgendaPublik() {
    try {
        const res = await fetch("https://backend-sekolah-production-e347.up.railway.app/agenda");
        const data = await res.json();

        const containerAgenda = document.getElementById("agenda-list");
        if (!containerAgenda) return;

        containerAgenda.innerHTML = "";

        if (!Array.isArray(data) || !data.length) {
            containerAgenda.innerHTML = "<p style='text-align:center;'>Belum ada agenda.</p>";
            return;
        }

        data.slice(0, 3).forEach(item => {
            containerAgenda.innerHTML += `
                <div class="berita-card">
                    <div class="berita-content">
                        <p class="berita-kategori">Agenda</p>
                        <h3>${item.judul}</h3>
                        <small>${formatTanggalIndonesia(item.tanggal)}${item.waktu ? " • " + item.waktu : ""}</small>
                        <p class="berita-ringkas">${item.lokasi ? "Lokasi: " + item.lokasi : "Lokasi belum diisi"}</p>
                        <p class="berita-ringkas">${potongTeks(item.deskripsi, 100)}</p>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.log("Gagal load agenda:", err);
    }
}

// ================= PROFIL WEBSITE =================
function renderMisi(misiText) {
    const misiList = document.getElementById("misiList");
    if (!misiList) return;

    misiList.innerHTML = "";

    if (!misiText) {
        misiList.innerHTML = "<li>Misi sekolah belum diisi.</li>";
        return;
    }

    const items = String(misiText)
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean);

    if (!items.length) {
        misiList.innerHTML = "<li>Misi sekolah belum diisi.</li>";
        return;
    }

    items.forEach(item => {
        misiList.innerHTML += `<li>${item}</li>`;
    });
}

async function loadWebsiteProfile() {
    try {
        const res = await fetch("https://backend-sekolah-production-e347.up.railway.app/website-profile");
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Gagal ambil profil website");
        }

        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value || "";
        };

        setText("heroJudul", data.hero_judul);
        setText("heroDeskripsi", data.hero_deskripsi);
        setText("miniAkreditasi", data.akreditasi);
        setText("miniPembelajaran", data.pembelajaran);
        setText("miniLingkungan", data.lingkungan);

        setText("tentangJudul", data.tentang_judul || data.nama_sekolah);
        setText("tentangDeskripsi", data.tentang_deskripsi);

        setText("visiText", data.visi);
        renderMisi(data.misi);

        setText("kontakAlamat", data.alamat);
        setText("kontakTelepon", data.telepon);
        setText("kontakEmail", data.email);

        setText("footerAlamat", data.alamat || "Sungailiat, Bangka");
        setText("footerTelepon", data.telepon || "(0717) 123-456");
        setText("footerEmail", data.email || "info@sdharapan.sch.id");

        if (data.nama_sekolah) {
            document.title = data.nama_sekolah;

            const logoTitle = document.querySelector(".logo h1");
            if (logoTitle) {
                logoTitle.textContent = data.nama_sekolah;
            }
        }
    } catch (err) {
        console.log("Gagal load profil website:", err);
    }
}

// ================= GURU =================
let dataGuru = [];

function tampilGuru() {
    const guruContainer = document.getElementById("guru-list");
    if (!guruContainer) return;

    guruContainer.innerHTML = "";

    if (!Array.isArray(dataGuru) || dataGuru.length === 0) {
        guruContainer.innerHTML = "<p style='text-align:center;'>Belum ada data guru.</p>";
        return;
    }

    dataGuru.forEach(g => {
        const foto = g.foto
            ? "https://backend-sekolah-production-e347.up.railway.app/uploads/" + g.foto
            : "https://via.placeholder.com/300x300?text=No+Photo";

        guruContainer.innerHTML += `
            <div class="guru-card premium-guru-card">
                <div class="guru-image">
                    <img src="${foto}" alt="${g.nama}">
                    <div class="guru-overlay"></div>
                </div>

                <div class="guru-info premium-guru-info">
                    <h3>${g.nama}</h3>
                    <p>${g.mapel}</p>

                    <div class="guru-meta">
                        <span><i class="fa fa-user-tie"></i> Guru</span>
                        <span><i class="fa fa-school"></i> SD Harapan</span>
                    </div>
                </div>
            </div>
        `;
    });
}

async function loadGuru() {
    try {
        const res = await fetch("https://backend-sekolah-production-e347.up.railway.app/guru");
        dataGuru = await res.json();
        tampilGuru();
    } catch (err) {
        console.log("Gagal load guru:", err);
    }
}

// ================= GALERI =================
let dataGaleri = [];

function tampilGaleri() {
    const galeriContainer = document.getElementById("galeri-list");
    if (!galeriContainer) return;

    galeriContainer.innerHTML = "";

    if (!Array.isArray(dataGaleri) || dataGaleri.length === 0) {
        galeriContainer.innerHTML = "<p style='text-align:center;'>Belum ada galeri.</p>";
        return;
    }

    dataGaleri.forEach(item => {
        const gambarUrl = item.gambar
            ? `https://backend-sekolah-production-e347.up.railway.app/uploads/${item.gambar}`
            : "https://via.placeholder.com/300x200?text=No+Image";

        galeriContainer.innerHTML += `
            <div class="galeri-card">
                <img src="${gambarUrl}" alt="${item.judul}" class="galeri-img" data-src="${gambarUrl}">
                <div class="galeri-info">
                    <h3>${item.judul}</h3>
                </div>
            </div>
        `;
    });

    document.querySelectorAll(".galeri-img").forEach(img => {
        img.addEventListener("click", function () {
            bukaGambar(this.dataset.src);
        });
    });
}

async function loadGaleri() {
    try {
        const res = await fetch("https://backend-sekolah-production-e347.up.railway.app/galeri");
        dataGaleri = await res.json();
        tampilGaleri();
    } catch (err) {
        console.log("Gagal load galeri:", err);
    }
}

function bukaGambar(src) {
    const overlay = document.createElement("div");
    overlay.className = "lightbox";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Preview Galeri";

    overlay.appendChild(img);

    overlay.addEventListener("click", function () {
        overlay.remove();
    });

    document.body.appendChild(overlay);
}

// ================= KONTAK =================
function showFormAlert(message, type = "success") {
    const alertBox = document.getElementById("formAlert");
    if (!alertBox) return;

    alertBox.className = "form-alert " + type;
    alertBox.style.display = "block";
    alertBox.innerHTML = message;

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 4000);
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nama = document.getElementById("namaKontak").value.trim();
        const email = document.getElementById("emailKontak").value.trim();
        const subjek = document.getElementById("subjekKontak").value.trim();
        const pesan = document.getElementById("pesanKontak").value.trim();
        const btn = document.getElementById("btnKirim");

        if (!nama || !email || !subjek || !pesan) {
            showFormAlert("Semua field wajib diisi.", "error");
            return;
        }

        try {
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Mengirim...';
            }

            const res = await fetch("https://backend-sekolah-production-e347.up.railway.app/pesan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nama,
                    email,
                    subjek,
                    pesan
                })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Gagal mengirim pesan");
            }

            showFormAlert("Pesan berhasil dikirim. Terima kasih sudah menghubungi kami.", "success");
            contactForm.reset();
        } catch (err) {
            console.log("Gagal kirim pesan:", err);
            showFormAlert(err.message || "Terjadi kesalahan saat mengirim pesan.", "error");
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa fa-paper-plane"></i> Kirim Pesan';
            }
        }
    });
}

// ================= LOAD SEMUA =================
loadBerita();
loadPengumumanPublik();
loadAgendaPublik();
loadWebsiteProfile();
loadGuru();
loadGaleri();