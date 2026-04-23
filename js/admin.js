const BASE_URL = "http://localhost:3000";

function apiUrl(path = "") {
    return `${BASE_URL}${path}`;
}

function getAuthHeaders(isJson = false) {
    const token = localStorage.getItem("token");
    const headers = {};

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    if (isJson) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

function showToast(message, type = "success") {
    let toast = document.getElementById("appToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "appToast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.remove("show", "toast-success", "toast-error");
    toast.classList.add(type === "error" ? "toast-error" : "toast-success");

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function playNotifSound() {
    const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    audio.play().catch(() => {});
}

function formatTanggalIndonesia(tanggal) {
    if (!tanggal) return "-";

    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return tanggal;

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ================= LOGIN CHECK =================
if (localStorage.getItem("login") !== "true") {
    location.href = "login.html";
}

if (localStorage.getItem("role") === "guru") {
    location.href = "guru.html";
}

// ================= TAB =================
window.showTab = function(tab, e) {
    const allTabs = [
    "dashboard",
    "beritaTab",
    "pengumumanTab",
    "guruTab",
    "kelasTab",
    "siswaTab",
    "absensiSiswaAdminTab",
    "absensiGuruAdminTab",
    "galeriTab",
    "pesanTab",
    "usersTab",
    "agendaTab",
    "profilTab",
    "ppdbTab"
];

    allTabs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    if (tab === "dashboard") {
        const dashboard = document.getElementById("dashboard");
        if (dashboard) dashboard.style.display = "block";
    } else {
        const activeTab = document.getElementById(tab + "Tab");
        if (activeTab) activeTab.style.display = "block";
    }

    localStorage.setItem("adminTab", tab);

    document.querySelectorAll(".school-menu li").forEach(li => {
        li.classList.remove("active");
    });

    const tabMap = {
    dashboard: `.single-menu[onclick*="showTab('dashboard'"]`,
    berita: `.menu-submenu li[onclick*="showTab('berita'"]`,
    pengumuman: `.menu-submenu li[onclick*="showTab('pengumuman'"]`,
    agenda: `.menu-submenu li[onclick*="showTab('agenda'"]`,
    galeri: `.menu-submenu li[onclick*="showTab('galeri'"]`,
    profil: `.menu-submenu li[onclick*="showTab('profil'"]`,
    guru: `.menu-submenu li[onclick*="showTab('guru'"]`,
    siswa: `.menu-submenu li[onclick*="showTab('siswa'"]`,
    kelas: `.menu-submenu li[onclick*="showTab('kelas'"]`,
    absensiSiswaAdmin: `.menu-submenu li[onclick*="showTab('absensiSiswaAdmin'"]`,
    absensiGuruAdmin: `.menu-submenu li[onclick*="showTab('absensiGuruAdmin'"]`,
    pesan: `.menu-submenu li[onclick*="showTab('pesan'"]`,
    users: `.menu-submenu li[onclick*="showTab('users'"]`,
    ppdb: `.single-menu[onclick*="showTab('ppdb'"], li[onclick*="showTab('ppdb'"]`
};

    const activeItem = document.querySelector(tabMap[tab]);
    if (activeItem) {
        activeItem.classList.add("active");

        const group = activeItem.closest(".menu-group");
        if (group) {
            group.classList.add("active");
            const submenu = group.querySelector(".menu-submenu");
            if (submenu) submenu.classList.add("open");
        }
    }
}; // <- ini penting

function restoreTab() {
    const tab = localStorage.getItem("adminTab") || "dashboard";
    showTab(tab);
}

// ================= PREVIEW GAMBAR =================
window.addEventListener("DOMContentLoaded", () => {
    const gambar = document.getElementById("gambar");

    if (gambar) {
        gambar.addEventListener("change", function() {
            const file = this.files[0];
            const preview = document.getElementById("preview");

            if (file && preview) {
                preview.src = URL.createObjectURL(file);
                preview.style.display = "block";
            }
        });
    }

const tanggalAbsensiAdmin = document.getElementById("tanggalAbsensiAdmin");
if (tanggalAbsensiAdmin) {
    tanggalAbsensiAdmin.value = getTodayISO();
}

const tahunRekapAdmin = document.getElementById("tahunRekapAdmin");
if (tahunRekapAdmin) {
    tahunRekapAdmin.value = String(new Date().getFullYear());
}

const bulanRekapAdmin = document.getElementById("bulanRekapAdmin");
if (bulanRekapAdmin) {
    bulanRekapAdmin.value = String(new Date().getMonth() + 1);
}

    const gambarGaleri = document.getElementById("gambarGaleri");
    if (gambarGaleri) {
        gambarGaleri.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                const oldPreview = document.getElementById("previewGaleriBaru");
                if (oldPreview) oldPreview.remove();

                const preview = document.createElement("img");
                preview.id = "previewGaleriBaru";
                preview.src = URL.createObjectURL(file);
                preview.style.width = "120px";
                preview.style.marginTop = "10px";
                preview.style.borderRadius = "10px";

                this.parentElement.appendChild(preview);
            }
        });
    }

const tanggalAbsensiGuruAdmin = document.getElementById("tanggalAbsensiGuruAdmin");
if (tanggalAbsensiGuruAdmin) {
    tanggalAbsensiGuruAdmin.value = getTodayISO();
}

const tahunRekapGuruAdmin = document.getElementById("tahunRekapGuruAdmin");
if (tahunRekapGuruAdmin) {
    tahunRekapGuruAdmin.value = String(new Date().getFullYear());
}

const bulanRekapGuruAdmin = document.getElementById("bulanRekapGuruAdmin");
if (bulanRekapGuruAdmin) {
    bulanRekapGuruAdmin.value = String(new Date().getMonth() + 1);
}
    
});

// ================= BERITA =================
let data = [];

async function loadBerita() {
    try {
        const res = await fetch(apiUrl("/berita"));
        data = await res.json();
        tampilkanBeritaAdmin();
        updateStats();
    } catch (err) {
        console.error(err);
        showToast("Gagal ambil data berita", "error");
    }
}

function tampilkanBeritaAdmin() {
    const list = document.getElementById("list-berita");
    if (!list) return;

    list.innerHTML = "";

    if (!Array.isArray(data) || !data.length) {
        list.innerHTML = "<p>Belum ada berita.</p>";
        return;
    }

    data.forEach(item => {
        list.innerHTML += `
            <div class="item-berita">
                <h3>${escapeHtml(item.judul)}</h3>
                <small>${formatTanggalIndonesia(item.tanggal)}</small><br>
                <button onclick="edit(${item.id})">Edit</button>
                <button onclick="hapus(${item.id})">Hapus</button>
            </div>
        `;
    });
}

window.simpanBerita = function () {
    const id = document.getElementById("id").value;
    const kategori = document.getElementById("kategori").value;
    const judul = document.getElementById("judul").value.trim();
    const tanggal = document.getElementById("tanggal").value;
    const isi = document.getElementById("isi").value.trim();
    const file = document.getElementById("gambar").files[0];

    if (!judul || !tanggal || !kategori || !isi) {
        showToast("Isi semua data berita!", "error");
        return;
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("tanggal", tanggal);
    formData.append("kategori", kategori);
    formData.append("isi", isi);

    if (file) {
        formData.append("gambar", file);
    }

    const url = id
        ? apiUrl(`/berita/${id}`)
        : apiUrl("/berita");

    const method = id ? "PUT" : "POST";

    const btn = document.getElementById("btnSimpanBerita");
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Menyimpan...";
    }

    fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal simpan berita");
            return result;
        })
        .then(result => {
            showToast(result.message || (id ? "Berita berhasil diupdate" : "Berita berhasil ditambah"));
            resetFormBerita();
            loadBerita();
            localStorage.setItem("adminTab", "berita");
            showTab("berita");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal simpan berita", "error");
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerText = "Simpan Berita";
            }
        });
};

function resetFormBerita() {
    document.getElementById("id").value = "";
    document.getElementById("judul").value = "";
    document.getElementById("tanggal").value = "";
    document.getElementById("isi").value = "";
    document.getElementById("kategori").value = "";
    document.getElementById("gambar").value = "";
    const preview = document.getElementById("preview");
    if (preview) preview.style.display = "none";
}

window.hapus = function(id) {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    fetch(apiUrl(`/berita/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal hapus berita");
            return result;
        })
        .then(result => {
            showToast(result.message || "Berita berhasil dihapus");
            loadBerita();
            localStorage.setItem("adminTab", "berita");
            showTab("berita");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal hapus berita", "error");
        });
};

window.edit = function(id) {
    const item = data.find(i => i.id === id);
    if (!item) return;

    document.getElementById("id").value = item.id;
    document.getElementById("judul").value = item.judul;
    document.getElementById("tanggal").value = String(item.tanggal).split("T")[0];
    document.getElementById("isi").value = item.isi;
    document.getElementById("kategori").value = item.kategori;

    const preview = document.getElementById("preview");
    if (item.gambar && preview) {
        preview.src = apiUrl("/uploads/" + item.gambar);
        preview.style.display = "block";
    }

    localStorage.setItem("adminTab", "berita");
    showTab("berita");
};

// ================= PENGUMUMAN =================
let dataPengumuman = [];

async function loadPengumuman() {
    try {
        const res = await fetch(apiUrl("/pengumuman"), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Gagal ambil data pengumuman");
        }

        dataPengumuman = Array.isArray(result) ? result : [];
        tampilPengumuman();
        renderDashboardPengumumanTerbaru();
        updateStats();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal ambil data pengumuman", "error");
    }
}

function tampilPengumuman() {
    const list = document.getElementById("list-pengumuman");
    if (!list) return;

    list.innerHTML = "";

    if (!dataPengumuman.length) {
        list.innerHTML = "<p>Belum ada pengumuman.</p>";
        return;
    }

    dataPengumuman.forEach(item => {
        list.innerHTML += `
            <div class="item-berita">
                <h3>${escapeHtml(item.judul)}</h3>
                <small>${formatTanggalIndonesia(item.tanggal)} • ${escapeHtml(item.prioritas)}</small>
                <p style="margin-top:8px;">${escapeHtml(item.isi)}</p>
                <div class="guru-actions" style="margin-top:12px;">
                    <button class="btn-edit" onclick="editPengumuman(${item.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="hapusPengumuman(${item.id})">🗑️ Hapus</button>
                </div>
            </div>
        `;
    });
}

window.simpanPengumuman = function () {
    const id = document.getElementById("idPengumuman").value;
    const judul = document.getElementById("judulPengumuman").value.trim();
    const tanggal = document.getElementById("tanggalPengumuman").value;
    const prioritas = document.getElementById("prioritasPengumuman").value;
    const isi = document.getElementById("isiPengumuman").value.trim();

    if (!judul || !tanggal || !isi) {
        showToast("Judul, tanggal, dan isi wajib diisi", "error");
        return;
    }

    const payload = { judul, tanggal, prioritas, isi };

    const url = id
        ? apiUrl(`/pengumuman/${id}`)
        : apiUrl("/pengumuman");

    const method = id ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal simpan pengumuman");
            return result;
        })
        .then(result => {
            showToast(result.message || "Pengumuman berhasil disimpan");
            resetFormPengumuman();
            loadPengumuman();
            localStorage.setItem("adminTab", "pengumuman");
            showTab("pengumuman");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal simpan pengumuman", "error");
        });
};

window.editPengumuman = function(id) {
    const item = dataPengumuman.find(x => x.id === id);
    if (!item) return;

    document.getElementById("idPengumuman").value = item.id;
    document.getElementById("judulPengumuman").value = item.judul;
    document.getElementById("tanggalPengumuman").value = String(item.tanggal).split("T")[0];
    document.getElementById("prioritasPengumuman").value = item.prioritas || "biasa";
    document.getElementById("isiPengumuman").value = item.isi || "";

    localStorage.setItem("adminTab", "pengumuman");
    showTab("pengumuman");
};

window.hapusPengumuman = function(id) {
    if (!confirm("Yakin ingin menghapus pengumuman ini?")) return;

    fetch(apiUrl(`/pengumuman/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal hapus pengumuman");
            return result;
        })
        .then(result => {
            showToast(result.message || "Pengumuman berhasil dihapus");
            loadPengumuman();
            localStorage.setItem("adminTab", "pengumuman");
            showTab("pengumuman");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal hapus pengumuman", "error");
        });
};

function resetFormPengumuman() {
    document.getElementById("idPengumuman").value = "";
    document.getElementById("judulPengumuman").value = "";
    document.getElementById("tanggalPengumuman").value = "";
    document.getElementById("prioritasPengumuman").value = "biasa";
    document.getElementById("isiPengumuman").value = "";
}

function renderDashboardPengumumanTerbaru() {
    const box = document.getElementById("dashboard-pengumuman-terbaru");
    if (!box) return;

    box.innerHTML = "";

    if (!dataPengumuman.length) {
        box.innerHTML = "<p>Belum ada pengumuman.</p>";
        return;
    }

    dataPengumuman.slice(0, 5).forEach(item => {
        box.innerHTML += `
            <div class="item-berita">
                <h3>${escapeHtml(item.judul)}</h3>
                <small>${formatTanggalIndonesia(item.tanggal)} • ${escapeHtml(item.prioritas)}</small>
            </div>
        `;
    });
}

// ================= GURU =================
let dataGuru = [];

async function loadGuru() {
    try {
        const res = await fetch(apiUrl("/guru"), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Gagal ambil data guru");
        }

        dataGuru = Array.isArray(result) ? result : [];
        tampilGuru();
        updateStats();
    } catch (err) {
        console.error("LOAD GURU ERROR:", err);
        dataGuru = [];
        tampilGuru();
        updateStats();
        showToast(err.message || "Gagal ambil data guru", "error");
    }
}

function tampilGuru() {
    const container = document.getElementById("admin-guru");
    if (!container) return;

    if (!dataGuru.length) {
        container.innerHTML = `<div class="premium-empty-state">Belum ada data guru.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="premium-table-card">
            <div class="premium-table-toolbar">
                <div>
                    <h3>Daftar Guru</h3>
                    <p>Data tenaga pendidik sekolah</p>
                </div>
                <span class="premium-badge blue">Total: ${dataGuru.length} Guru</span>
            </div>

            <div class="premium-table-wrap">
                <table class="premium-table-admin">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Guru</th>
                            <th>Mata Pelajaran</th>
                            <th>Foto</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataGuru.map((g, index) => {
                            const fotoUrl = g.foto ? apiUrl("/uploads/" + g.foto) : "";
                            const inisial = String(g.nama || "G").trim().charAt(0).toUpperCase();

                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>
                                        <div class="premium-table-name">
                                            <div class="premium-table-avatar">
                                                ${fotoUrl
                                                    ? `<img src="${fotoUrl}" alt="${escapeHtml(g.nama)}">`
                                                    : inisial}
                                            </div>
                                            <div class="premium-table-main">
                                                <strong>${escapeHtml(g.nama)}</strong>
                                                <small>ID: ${g.id}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="premium-badge blue">${escapeHtml(g.mapel || "-")}</span>
                                    </td>
                                    <td>${g.foto ? "Ada Foto" : "Tidak Ada"}</td>
                                    <td>
                                        <div class="premium-table-actions">
                                            <button class="premium-btn-edit" onclick="editGuru(${g.id})">✏️ Edit</button>
                                            <button class="premium-btn-delete" onclick="hapusGuru(${g.id})">🗑️ Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.tambahGuru = function () {
    const id = document.getElementById("idGuru").value;
    const nama = document.getElementById("namaGuru").value.trim();
    const mapel = document.getElementById("mapelGuru").value.trim();
    const file = document.getElementById("fotoGuru").files[0];

    if (!nama || !mapel) {
        showToast("Isi semua data guru!", "error");
        localStorage.setItem("adminTab", "guru");
        showTab("guru");
        return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("mapel", mapel);

    if (file) {
        formData.append("foto", file);
    }

    const url = id
        ? apiUrl(`/guru/${id}`)
        : apiUrl("/guru");

    const method = id ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal simpan guru");
            return result;
        })
        .then(result => {
            showToast(result.message || "Guru berhasil disimpan");
            resetFormGuru();
            localStorage.setItem("adminTab", "guru");
            loadGuru();
            showTab("guru");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal tambah / update guru", "error");
            localStorage.setItem("adminTab", "guru");
            showTab("guru");
        });
};

window.editGuru = function(id) {
    const guru = dataGuru.find(g => g.id === id);
    if (!guru) return;

    document.getElementById("idGuru").value = guru.id;
    document.getElementById("namaGuru").value = guru.nama;
    document.getElementById("mapelGuru").value = guru.mapel;

    localStorage.setItem("adminTab", "guru");
    showTab("guru");
};

window.hapusGuru = function (id) {
    if (!confirm("Yakin ingin menghapus guru ini?")) return;

    fetch(apiUrl(`/guru/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal hapus guru");
            return result;
        })
        .then(result => {
            showToast(result.message || "Guru berhasil dihapus");
            localStorage.setItem("adminTab", "guru");
            loadGuru();
            showTab("guru");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal hapus guru", "error");
            localStorage.setItem("adminTab", "guru");
            showTab("guru");
        });
};

function resetFormGuru() {
    document.getElementById("idGuru").value = "";
    document.getElementById("namaGuru").value = "";
    document.getElementById("mapelGuru").value = "";
    document.getElementById("fotoGuru").value = "";
}

// ================= KELAS =================
let dataKelas = [];
let dataUsers = [];

async function loadKelas() {
    try {
        const res = await fetch(apiUrl("/kelas"), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil data kelas");

        dataKelas = Array.isArray(result) ? result : [];
        tampilKelas();
        renderKelasOptionsAdmin();
        renderKelasAbsensiAdminOptions();
        renderWaliKelasOptions();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal ambil data kelas", "error");
    }
}

function tampilKelas() {
    const list = document.getElementById("list-kelas");
    if (!list) return;

    list.innerHTML = "";

    if (!dataKelas.length) {
        list.innerHTML = `<div class="premium-empty-state">Belum ada data kelas.</div>`;
        return;
    }

    list.innerHTML = `
        <div class="premium-table-card">
            <div class="premium-table-toolbar">
                <div>
                    <h3>Daftar Kelas</h3>
                    <p>Data kelas dan wali kelas sekolah</p>
                </div>
                <span class="premium-badge orange">Total: ${dataKelas.length} Kelas</span>
            </div>

            <div class="premium-table-wrap">
                <table class="premium-table-admin">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Kelas</th>
                            <th>Wali Kelas</th>
                            <th>User Guru</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataKelas.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    <div class="premium-table-main">
                                        <strong>${escapeHtml(item.nama_kelas)}</strong>
                                        <small>ID: ${item.id}</small>
                                    </div>
                                </td>
                                <td>
                                    <span class="premium-badge ${item.wali_kelas ? "green" : "gray"}">
                                        ${escapeHtml(item.wali_kelas || "-")}
                                    </span>
                                </td>
                                <td>${escapeHtml(item.wali_username || "-")}</td>
                                <td>
                                    <div class="premium-table-actions">
                                        <button class="premium-btn-edit" onclick="editKelas(${item.id})">✏️ Edit</button>
                                        <button class="premium-btn-delete" onclick="hapusKelas(${item.id})">🗑️ Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderKelasOptionsAdmin() {
    const select = document.getElementById("kelasSiswa");
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = `<option value="">Pilih Kelas</option>`;

    dataKelas.forEach(item => {
        select.innerHTML += `<option value="${item.id}">${escapeHtml(item.nama_kelas)}</option>`;
    });

    if (currentValue) {
        select.value = currentValue;
    }
}

function renderWaliKelasOptions() {
    const select = document.getElementById("waliUserKelas");
    if (!select) return;

    const currentValue = select.value;
    const semuaGuru = dataUsers.filter(item => item.role === "guru");

    select.innerHTML = `<option value="">Pilih User Wali Kelas</option>`;

    semuaGuru.forEach(item => {
        const labelStatus = Number(item.is_active) === 1 ? "Aktif" : "Nonaktif";
        select.innerHTML += `
            <option value="${item.id}">
                ${escapeHtml(item.nama)} (${escapeHtml(item.username)}) - ${labelStatus}
            </option>
        `;
    });

    if (currentValue) {
        select.value = currentValue;
    }
}

window.simpanKelas = function() {
    const id = document.getElementById("idKelas").value;
    const nama_kelas = document.getElementById("namaKelas").value.trim();
    const waliUserEl = document.getElementById("waliUserKelas");
    const wali_user_id = waliUserEl ? waliUserEl.value : "";

    if (!nama_kelas) {
        showToast("Nama kelas wajib diisi", "error");
        return;
    }

    const payload = {
        nama_kelas,
        wali_user_id: wali_user_id || null
    };

    const url = id ? apiUrl(`/kelas/${id}`) : apiUrl("/kelas");
    const method = id ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal simpan kelas");
            return result;
        })
        .then(result => {
            showToast(result.message || "Kelas berhasil disimpan");
            resetFormKelas();
            loadKelas();
            localStorage.setItem("adminTab", "kelas");
            showTab("kelas");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal simpan kelas", "error");
        });
};

window.editKelas = function(id) {
    const item = dataKelas.find(k => k.id === id);
    if (!item) return;

    document.getElementById("idKelas").value = item.id;
    document.getElementById("namaKelas").value = item.nama_kelas;
    const waliUserEl = document.getElementById("waliUserKelas");
    if (waliUserEl) {
        waliUserEl.value = item.wali_user_id || "";
    }

    localStorage.setItem("adminTab", "kelas");
    showTab("kelas");
};

window.hapusKelas = function(id) {
    if (!confirm("Yakin ingin menghapus kelas ini?")) return;

    fetch(apiUrl(`/kelas/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal hapus kelas");
            return result;
        })
        .then(result => {
            showToast(result.message || "Kelas berhasil dihapus");
            loadKelas();
            localStorage.setItem("adminTab", "kelas");
            showTab("kelas");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal hapus kelas", "error");
        });
};

function resetFormKelas() {
    document.getElementById("idKelas").value = "";
    document.getElementById("namaKelas").value = "";
    const waliUserEl = document.getElementById("waliUserKelas");
    if (waliUserEl) waliUserEl.value = "";
}

window.toggleMenuGroup = function (el) {
    const group = el.closest(".menu-group");
    if (!group) return;

    const submenu = group.querySelector(".menu-submenu");
    if (!submenu) return;

    const isOpen = submenu.classList.contains("open");

    document.querySelectorAll(".menu-group").forEach(item => {
        item.classList.remove("active");
        const sub = item.querySelector(".menu-submenu");
        if (sub) sub.classList.remove("open");
    });

    if (!isOpen) {
        group.classList.add("active");
        submenu.classList.add("open");
    }
};

// ================= SISWA =================
let dataSiswa = [];

async function loadSiswa() {
    try {
        const res = await fetch(apiUrl("/siswa"), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil data siswa");

        dataSiswa = Array.isArray(result) ? result : [];
        tampilSiswa();
        updateStats();
    } catch (err) {
        console.error(err);
        dataSiswa = [];
        tampilSiswa();
        updateStats();
        showToast(err.message || "Gagal ambil data siswa", "error");
    }
}

function tampilSiswa() {
    const container = document.getElementById("list-siswa");
    if (!container) return;

    if (!dataSiswa.length) {
        container.innerHTML = `<div class="premium-empty-state">Belum ada data siswa.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="premium-table-card">
            <div class="premium-table-toolbar">
                <div>
                    <h3>Daftar Siswa</h3>
                    <p>Data siswa aktif sekolah</p>
                </div>
                <span class="premium-badge green">Total: ${dataSiswa.length} Siswa</span>
            </div>

            <div class="premium-table-wrap">
                <table class="premium-table-admin">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Siswa</th>
                            <th>Kelas</th>
                            <th>NIS</th>
                            <th>Alamat</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataSiswa.map((item, index) => {
                            const inisial = String(item.nama || "S").trim().charAt(0).toUpperCase();

                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>
                                        <div class="premium-table-name">
                                            <div class="premium-table-avatar">${inisial}</div>
                                            <div class="premium-table-main">
                                                <strong>${escapeHtml(item.nama)}</strong>
                                                <small>ID: ${item.id}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="premium-badge blue">${escapeHtml(item.nama_kelas || "-")}</span></td>
                                    <td>${escapeHtml(item.nis || "-")}</td>
                                    <td>${escapeHtml(item.alamat || "-")}</td>
                                    <td>
                                        <div class="premium-table-actions">
                                            <button class="premium-btn-edit" onclick="editSiswa(${item.id})">✏️ Edit</button>
                                            <button class="premium-btn-delete" onclick="hapusSiswa(${item.id})">🗑️ Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
window.simpanSiswa = function () {
    const id = document.getElementById("idSiswa").value;
    const nama = document.getElementById("namaSiswa").value.trim();
    const kelas_id = document.getElementById("kelasSiswa").value;
    const nis = document.getElementById("nisSiswa").value.trim();
    const alamat = document.getElementById("alamatSiswa").value.trim();

    if (!nama || !kelas_id || !nis) {
        showToast("Nama, kelas, dan NIS wajib diisi!", "error");
        localStorage.setItem("adminTab", "siswa");
        showTab("siswa");
        return;
    }

    const payload = { nama, kelas_id, nis, alamat };

    const url = id
        ? apiUrl(`/siswa/${id}`)
        : apiUrl("/siswa");

    const method = id ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || result.message || "Gagal simpan siswa");
            return result;
        })
        .then(result => {
            showToast(result.message || "Siswa berhasil disimpan");
            resetFormSiswa();
            localStorage.setItem("adminTab", "siswa");
            loadSiswa();
            showTab("siswa");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal simpan siswa", "error");
            localStorage.setItem("adminTab", "siswa");
            showTab("siswa");
        });
};

window.editSiswa = function(id) {
    const siswa = dataSiswa.find(s => s.id === id);
    if (!siswa) return;

    document.getElementById("idSiswa").value = siswa.id;
    document.getElementById("namaSiswa").value = siswa.nama;
    document.getElementById("kelasSiswa").value = siswa.kelas_id || "";
    document.getElementById("nisSiswa").value = siswa.nis;
    document.getElementById("alamatSiswa").value = siswa.alamat || "";

    localStorage.setItem("adminTab", "siswa");
    showTab("siswa");
};

window.hapusSiswa = function(id) {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return;

    fetch(apiUrl(`/siswa/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal hapus siswa");
            return result;
        })
        .then(result => {
            showToast(result.message || "Siswa berhasil dihapus");
            loadSiswa();
            localStorage.setItem("adminTab", "siswa");
            showTab("siswa");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal hapus siswa", "error");
        });
};

function resetFormSiswa() {
    document.getElementById("idSiswa").value = "";
    document.getElementById("namaSiswa").value = "";
    document.getElementById("kelasSiswa").value = "";
    document.getElementById("nisSiswa").value = "";
    document.getElementById("alamatSiswa").value = "";
}

// ================= MONITORING ABSENSI ADMIN =================
let dataAbsensiAdminBulanan = [];

function getTodayISO() {
    return new Date().toISOString().split("T")[0];
}

function getNamaBulanAdmin(bulan) {
    const nama = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return nama[Number(bulan)] || "-";
}

function resetSummaryAdmin() {
    ["rekapTotalSiswaAdmin", "rekapHadirAdmin", "rekapIzinAdmin", "rekapSakitAdmin", "rekapAlphaAdmin"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = "0";
        });
}

function renderKelasAbsensiAdminOptions() {
    const select = document.getElementById("kelasAbsensiAdmin");
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = `<option value="">Pilih Kelas</option>`;

    dataKelas.forEach(item => {
        select.innerHTML += `<option value="${item.id}">${escapeHtml(item.nama_kelas)}</option>`;
    });

    if (currentValue) {
        select.value = currentValue;
    }
}

async function loadSummaryAbsensiAdmin() {
    const tanggal = document.getElementById("tanggalAbsensiAdmin")?.value || "";
    const kelas_id = document.getElementById("kelasAbsensiAdmin")?.value || "";

    if (!tanggal || !kelas_id) {
        resetSummaryAdmin();
        return;
    }

    try {
        const res = await fetch(apiUrl(`/absensi/summary?tanggal=${encodeURIComponent(tanggal)}&kelas_id=${encodeURIComponent(kelas_id)}`), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil summary absensi");

        document.getElementById("rekapTotalSiswaAdmin").textContent = result.total_siswa || 0;
        document.getElementById("rekapHadirAdmin").textContent = result.hadir || 0;
        document.getElementById("rekapIzinAdmin").textContent = result.izin || 0;
        document.getElementById("rekapSakitAdmin").textContent = result.sakit || 0;
        document.getElementById("rekapAlphaAdmin").textContent = result.alpha || 0;
    } catch (err) {
        console.error(err);
        resetSummaryAdmin();
        showToast(err.message || "Gagal ambil summary absensi", "error");
    }
}

window.loadRekapAbsensiAdmin = async function () {
    const tanggal = document.getElementById("tanggalAbsensiAdmin")?.value || "";
    const kelas_id = document.getElementById("kelasAbsensiAdmin")?.value || "";
    const list = document.getElementById("list-absensi-admin");
    const printInfo = document.getElementById("printInfoAbsensiAdmin");

    if (!tanggal || !kelas_id) {
        if (list) list.innerHTML = "<p>Pilih tanggal dan kelas terlebih dahulu.</p>";
        if (printInfo) printInfo.textContent = "Tanggal dan kelas belum dipilih";
        resetSummaryAdmin();
        return;
    }

    try {
        if (list) list.innerHTML = "<p>Loading...</p>";

        const kelasDipilih = dataKelas.find(k => String(k.id) === String(kelas_id));
        if (printInfo) {
            printInfo.textContent = `Kelas: ${kelasDipilih ? kelasDipilih.nama_kelas : "-"} | Tanggal: ${formatTanggalIndonesia(tanggal)}`;
        }

        const res = await fetch(apiUrl(`/absensi/rekap?tanggal=${encodeURIComponent(tanggal)}&kelas_id=${encodeURIComponent(kelas_id)}`), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil rekap harian");

        renderRekapAbsensiAdmin(result);
        await loadSummaryAbsensiAdmin();
    } catch (err) {
        console.error(err);
        if (list) list.innerHTML = `<p>${err.message}</p>`;
        resetSummaryAdmin();
        showToast(err.message || "Gagal ambil rekap harian", "error");
    }
};

function renderRekapAbsensiAdmin(rows) {
    const list = document.getElementById("list-absensi-admin");
    if (!list) return;

    if (!rows || !rows.length) {
        list.innerHTML = "<p>Tidak ada data absensi pada filter ini.</p>";
        return;
    }

    list.innerHTML = `
        <div class="absensi-table-card">
            <table class="absensi-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>NIS</th>
                        <th>Kelas</th>
                        <th>Status</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((item, index) => {
                        const badge =
                            item.status === "hadir" ? `<span class="absensi-badge hadir">Hadir</span>` :
                            item.status === "izin" ? `<span class="absensi-badge izin">Izin</span>` :
                            item.status === "sakit" ? `<span class="absensi-badge sakit">Sakit</span>` :
                            item.status === "alpha" ? `<span class="absensi-badge alpha">Alpha</span>` :
                            `<span class="absensi-badge kosong">Belum Diisi</span>`;

                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${escapeHtml(item.nama || "-")}</td>
                                <td>${escapeHtml(item.nis || "-")}</td>
                                <td>${escapeHtml(item.nama_kelas || "-")}</td>
                                <td>${badge}</td>
                                <td>${escapeHtml(item.keterangan || "-")}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}

window.loadBulananAdmin = async function () {
    const kelas_id = document.getElementById("kelasAbsensiAdmin")?.value || "";
    const bulan = document.getElementById("bulanRekapAdmin")?.value || "";
    const tahun = document.getElementById("tahunRekapAdmin")?.value || "";
    const wrap = document.getElementById("rekapBulananAdminWrap");

    if (!kelas_id || !bulan || !tahun) {
        if (wrap) wrap.innerHTML = "<p>Pilih kelas, bulan, dan tahun.</p>";
        return;
    }

    try {
        if (wrap) wrap.innerHTML = "<p>Memuat rekap bulanan...</p>";

        const res = await fetch(apiUrl(`/absensi/bulanan?kelas_id=${encodeURIComponent(kelas_id)}&bulan=${encodeURIComponent(bulan)}&tahun=${encodeURIComponent(tahun)}`), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil rekap bulanan");

        dataAbsensiAdminBulanan = Array.isArray(result.data) ? result.data : [];
        renderBulananAdmin(result);
    } catch (err) {
        console.error(err);
        dataAbsensiAdminBulanan = [];
        if (wrap) wrap.innerHTML = `<p>${err.message}</p>`;
        showToast(err.message || "Gagal ambil rekap bulanan", "error");
    }
};

function renderBulananAdmin(result) {
    const wrap = document.getElementById("rekapBulananAdminWrap");
    const printInfo = document.getElementById("printInfoBulananAdmin");
    if (!wrap) return;

    const kelasDipilih = dataKelas.find(k => String(k.id) === String(result.kelas_id));
    const namaKelas = kelasDipilih ? kelasDipilih.nama_kelas : "-";
    const periodeLabel = `${getNamaBulanAdmin(result.bulan)} ${result.tahun}`;
    const summary = result.summary || {};

    if (printInfo) {
        printInfo.textContent = `Kelas: ${namaKelas} | Periode: ${periodeLabel}`;
    }

    if (!result.data || !result.data.length) {
        wrap.innerHTML = `<p>Tidak ada data rekap bulanan.</p>`;
        return;
    }

    const rows = result.data.map((item, index) => {
        const hadir = Number(item.hadir || 0);
        const izin = Number(item.izin || 0);
        const sakit = Number(item.sakit || 0);
        const alpha = Number(item.alpha || 0);
        const total = Number(item.total_tercatat || 0);
        const persen = total > 0 ? `${Math.round((hadir / total) * 100)}%` : "0%";

        return `
            <tr>
                <td>${index + 1}</td>
                <td class="td-left">${escapeHtml(item.nama || "-")}</td>
                <td>${escapeHtml(item.nis || "-")}</td>
                <td>${hadir}</td>
                <td>${izin}</td>
                <td>${sakit}</td>
                <td>${alpha}</td>
                <td>${total}</td>
                <td>${persen}</td>
            </tr>
        `;
    }).join("");

    wrap.innerHTML = `
        <div class="admin-bulanan-full">
            <div class="admin-bulanan-head">
                <h3>Rekap Bulanan ${periodeLabel}</h3>
                <p>Kelas: <strong>${escapeHtml(namaKelas)}</strong></p>
            </div>

            <div class="admin-bulanan-summary">
                <span>Total Siswa: <strong>${summary.total_siswa || 0}</strong></span>
                <span>Hadir: <strong>${summary.hadir || 0}</strong></span>
                <span>Izin: <strong>${summary.izin || 0}</strong></span>
                <span>Sakit: <strong>${summary.sakit || 0}</strong></span>
                <span>Alpha: <strong>${summary.alpha || 0}</strong></span>
            </div>

            <div class="admin-bulanan-table-wrap">
                <table class="premium-table-admin admin-bulanan-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>NIS</th>
                            <th>Hadir</th>
                            <th>Izin</th>
                            <th>Sakit</th>
                            <th>Alpha</th>
                            <th>Total</th>
                            <th>% Hadir</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
window.printAreaAbsensiAdmin = function () {
    const tanggal = document.getElementById("tanggalAbsensiAdmin")?.value || "-";
    const kelas_id = document.getElementById("kelasAbsensiAdmin")?.value || "";
    const kelasDipilih = dataKelas.find(k => String(k.id) === String(kelas_id));
    const printInfo = document.getElementById("printInfoAbsensiAdmin");

    if (printInfo) {
        printInfo.textContent = `Kelas: ${kelasDipilih ? kelasDipilih.nama_kelas : "-"} | Tanggal: ${formatTanggalIndonesia(tanggal)}`;
    }

    document.body.classList.add("print-absensi-admin-mode");
    window.print();
    setTimeout(() => {
        document.body.classList.remove("print-absensi-admin-mode");
    }, 500);
};

window.printBulananAdmin = function () {
    const bulan = document.getElementById("bulanRekapAdmin")?.value || "";
    const tahun = document.getElementById("tahunRekapAdmin")?.value || "";
    const kelas_id = document.getElementById("kelasAbsensiAdmin")?.value || "";
    const kelasDipilih = dataKelas.find(k => String(k.id) === String(kelas_id));
    const printInfo = document.getElementById("printInfoBulananAdmin");

    if (printInfo) {
        printInfo.textContent = `Kelas: ${kelasDipilih ? kelasDipilih.nama_kelas : "-"} | Periode: ${getNamaBulanAdmin(bulan)} ${tahun}`;
    }

    document.body.classList.add("print-bulanan-admin-mode");
    window.print();
    setTimeout(() => {
        document.body.classList.remove("print-bulanan-admin-mode");
    }, 500);
};

window.exportBulananAdminPDF = async function () {
    if (!dataAbsensiAdminBulanan.length) {
        showToast("Belum ada data rekap bulanan untuk diexport", "error");
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast("Library PDF belum termuat", "error");
        return;
    }

    try {
        const { jsPDF } = window.jspdf;

        const bulan = document.getElementById("bulanRekapAdmin")?.value || "";
        const tahun = document.getElementById("tahunRekapAdmin")?.value || "";
        const kelas_id = document.getElementById("kelasAbsensiAdmin")?.value || "";
        const kelasDipilih = dataKelas.find(k => String(k.id) === String(kelas_id));
        const namaKelas = kelasDipilih ? kelasDipilih.nama_kelas : "Kelas";
        const periode = `${getNamaBulanAdmin(bulan)} ${tahun}`;

        const totalSiswa = dataAbsensiAdminBulanan.length;
        const totalHadir = dataAbsensiAdminBulanan.reduce((n, x) => n + Number(x.hadir || 0), 0);
        const totalIzin = dataAbsensiAdminBulanan.reduce((n, x) => n + Number(x.izin || 0), 0);
        const totalSakit = dataAbsensiAdminBulanan.reduce((n, x) => n + Number(x.sakit || 0), 0);
        const totalAlpha = dataAbsensiAdminBulanan.reduce((n, x) => n + Number(x.alpha || 0), 0);

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("SD HARAPAN", 14, 16);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Monitoring Rekap Absensi Bulanan Siswa", 14, 22);
        doc.text("Export oleh Admin", 14, 27);

        doc.setDrawColor(30, 64, 175);
        doc.setLineWidth(0.8);
        doc.line(14, 32, pageWidth - 14, 32);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("REKAP ABSENSI BULANAN", pageWidth / 2, 41, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(`Kelas : ${namaKelas}`, 14, 50);
        doc.text(`Periode : ${periode}`, 14, 56);
        doc.text(`Tanggal Cetak : ${new Date().toLocaleDateString("id-ID")}`, 14, 62);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.text(`Total Siswa: ${totalSiswa}`, 14, 72);
        doc.text(`Hadir: ${totalHadir}`, 55, 72);
        doc.text(`Izin: ${totalIzin}`, 85, 72);
        doc.text(`Sakit: ${totalSakit}`, 112, 72);
        doc.text(`Alpha: ${totalAlpha}`, 142, 72);

        const bodyRows = dataAbsensiAdminBulanan.map((item, index) => {
            const hadir = Number(item.hadir || 0);
            const izin = Number(item.izin || 0);
            const sakit = Number(item.sakit || 0);
            const alpha = Number(item.alpha || 0);
            const total = Number(item.total_tercatat || 0);
            const persen = total > 0 ? `${Math.round((hadir / total) * 100)}%` : "0%";

            return [
                index + 1,
                item.nama || "-",
                item.nis || "-",
                hadir,
                izin,
                sakit,
                alpha,
                total,
                persen
            ];
        });

        doc.autoTable({
            startY: 78,
            head: [[
                "No",
                "Nama",
                "NIS",
                "Hadir",
                "Izin",
                "Sakit",
                "Alpha",
                "Total",
                "% Hadir"
            ]],
            body: bodyRows,
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 9.5,
                cellPadding: 3,
                valign: "middle",
                halign: "center",
                lineColor: [220, 220, 220],
                lineWidth: 0.2
            },
            headStyles: {
                fillColor: [29, 78, 216],
                textColor: 255,
                fontStyle: "bold"
            },
            columnStyles: {
                0: { cellWidth: 12 },
                1: { cellWidth: 62, halign: "left" },
                2: { cellWidth: 28 },
                3: { cellWidth: 18 },
                4: { cellWidth: 18 },
                5: { cellWidth: 18 },
                6: { cellWidth: 18 },
                7: { cellWidth: 20 },
                8: { cellWidth: 18 }
            },
            didDrawPage: function (data) {
                const currentPage = data.pageNumber;
                const totalPages = doc.internal.getNumberOfPages();

                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.text(
                    `Halaman ${currentPage} dari ${totalPages}`,
                    pageWidth - 14,
                    pageHeight - 8,
                    { align: "right" }
                );
            }
        });

        const namaFile = `monitoring-absensi-${namaKelas}-${getNamaBulanAdmin(bulan)}-${tahun}.pdf`
            .replace(/\s+/g, "-");

        doc.save(namaFile);
        showToast("Export PDF berhasil");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal export PDF", "error");
    }
};

// ================= GALERI =================
let dataGaleri = [];

async function loadGaleri() {
    try {
        const res = await fetch(apiUrl("/galeri"));
        const result = await res.json();
        dataGaleri = Array.isArray(result) ? result : [];
        tampilGaleriAdmin();
    } catch (err) {
        console.error(err);
        showToast("Gagal ambil data galeri", "error");
    }
}

function tampilGaleriAdmin() {
    const container = document.getElementById("admin-galeri");
    if (!container) return;

    container.innerHTML = "";

    if (!dataGaleri.length) {
        container.innerHTML = "<p>Belum ada data galeri.</p>";
        return;
    }

    dataGaleri.forEach((item) => {
        container.innerHTML += `
            <div class="school-galeri-card">
                <div class="school-galeri-image-wrap">
                    <img src="${apiUrl("/uploads/" + item.gambar)}" alt="${escapeHtml(item.judul)}">
                    <div class="school-galeri-overlay"></div>
                </div>

                <div class="school-galeri-content">
                    <h3>${escapeHtml(item.judul)}</h3>
                    <div class="school-galeri-meta">
                        <span><i class="fa fa-images"></i> Dokumentasi Sekolah</span>
                    </div>

                    <div class="school-galeri-actions">
                        <button class="btn-delete" onclick="hapusGaleri(${item.id})">🗑️ Hapus</button>
                    </div>
                </div>
            </div>
        `;
    });
}

window.tambahGaleri = function () {
    const judul = document.getElementById("judulGaleri").value.trim();
    const file = document.getElementById("gambarGaleri").files[0];

    if (!judul || !file) {
        showToast("Judul dan gambar wajib diisi!", "error");
        localStorage.setItem("adminTab", "galeri");
        showTab("galeri");
        return;
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("gambar", file);

    fetch(apiUrl("/galeri"), {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal tambah galeri");
            return result;
        })
        .then(result => {
            showToast(result.message || "Galeri berhasil ditambah");
            document.getElementById("judulGaleri").value = "";
            document.getElementById("gambarGaleri").value = "";
            const oldPreview = document.getElementById("previewGaleriBaru");
            if (oldPreview) oldPreview.remove();
            loadGaleri();
            localStorage.setItem("adminTab", "galeri");
            showTab("galeri");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal tambah galeri", "error");
        });
};

window.hapusGaleri = function (id) {
    if (!confirm("Yakin ingin menghapus foto galeri ini?")) return;

    fetch(apiUrl(`/galeri/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal hapus galeri");
            return result;
        })
        .then(result => {
            showToast(result.message || "Galeri berhasil dihapus");
            loadGaleri();
            localStorage.setItem("adminTab", "galeri");
            showTab("galeri");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal hapus galeri", "error");
        });
};

// ================= PESAN =================
let dataPesan = [];
let lastJumlahPesanBaru = 0;

async function loadPesan() {
    try {
        const res = await fetch(apiUrl("/pesan"), {
            headers: getAuthHeaders()
        });
        const result = await res.json();
        dataPesan = Array.isArray(result) ? result : [];
        tampilPesan();
        updateBadgePesan();
        updateStats();
    } catch (err) {
        console.error(err);
        showToast("Gagal ambil data pesan", "error");
    }
}

function tampilPesan() {
    const container = document.getElementById("list-pesan");
    if (!container) return;

    container.innerHTML = "";

    if (!dataPesan.length) {
        container.innerHTML = "<p>Belum ada pesan masuk.</p>";
        return;
    }

    dataPesan.forEach(item => {
        container.innerHTML += `
            <div class="item-pesan ${item.status === "baru" ? "pesan-baru" : ""}">
                <h3>${escapeHtml(item.subjek)}</h3>
                <p><strong>Nama:</strong> ${escapeHtml(item.nama)}</p>
                <p><strong>Email:</strong> ${escapeHtml(item.email)}</p>
                <p><strong>Status:</strong> ${escapeHtml(item.status)}</p>
                <p><strong>Tanggal:</strong> ${item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : "-"}</p>
                <div class="pesan-isi">${escapeHtml(item.pesan)}</div>

                <div class="guru-actions">
                    ${
                        item.status === "baru"
                        ? `<button class="btn-edit" onclick="tandaiDibaca(${item.id})">✔ Tandai Dibaca</button>`
                        : ""
                    }
                    <button class="btn-delete" onclick="hapusPesan(${item.id})">🗑️ Hapus</button>
                </div>
            </div>
        `;
    });
}

async function updateBadgePesan() {
    try {
        const res = await fetch(apiUrl("/pesan/count/baru"), {
            headers: getAuthHeaders()
        });
        const result = await res.json();
        const badge = document.getElementById("badgePesan");
        const totalBaru = Number(result.total || 0);

        if (badge) {
            if (totalBaru > 0) {
                badge.textContent = totalBaru;
                badge.style.display = "inline-block";
            } else {
                badge.textContent = "";
                badge.style.display = "none";
            }
        }

        if (totalBaru > lastJumlahPesanBaru && lastJumlahPesanBaru !== 0) {
            showToast("Ada pesan baru masuk!");
            playNotifSound();
        }

        lastJumlahPesanBaru = totalBaru;
        updateStats();
    } catch (err) {
        console.error(err);
    }
}

window.tandaiDibaca = function(id) {
    fetch(apiUrl(`/pesan/${id}/dibaca`), {
        method: "PUT",
        headers: getAuthHeaders()
    })
    .then(async res => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Gagal update status pesan");
        return result;
    })
    .then(data => {
        showToast(data.message || "Pesan ditandai dibaca");
        loadPesan();
        localStorage.setItem("adminTab", "pesan");
        showTab("pesan");
    })
    .catch(err => {
        console.error(err);
        showToast(err.message || "Gagal update status pesan", "error");
    });
};

window.hapusPesan = function(id) {
    if (!confirm("Hapus pesan ini?")) return;

    fetch(apiUrl(`/pesan/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
    .then(async res => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Gagal hapus pesan");
        return result;
    })
    .then(data => {
        showToast(data.message || "Pesan berhasil dihapus");
        loadPesan();
        localStorage.setItem("adminTab", "pesan");
        showTab("pesan");
    })
    .catch(err => {
        console.error(err);
        showToast(err.message || "Gagal hapus pesan", "error");
    });
};

// ================= USERS =================
async function loadUsers() {
    try {
        const res = await fetch(apiUrl("/users"), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil data user");

        dataUsers = Array.isArray(result) ? result : [];
        tampilUsers();
        renderWaliKelasOptions();
    } catch (err) {
        console.error(err);
        dataUsers = [];
        tampilUsers();
        renderWaliKelasOptions();
        showToast(err.message || "Gagal ambil data user", "error");
    }
}

function getUserStatusBadge(isActive) {
    return Number(isActive) === 1
        ? `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#dcfce7;color:#166534;font-weight:700;">Aktif</span>`
        : `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fee2e2;color:#991b1b;font-weight:700;">Nonaktif</span>`;
}

function tampilUsers() {
    const container = document.getElementById("list-users");
    if (!container) return;

    container.innerHTML = "";

    if (!dataUsers.length) {
        container.innerHTML = "<p>Belum ada user.</p>";
        return;
    }

    dataUsers.forEach((u) => {
        const isAktif = Number(u.is_active) === 1;
        const toggleText = isAktif ? "⛔ Nonaktifkan" : "✅ Aktifkan";
        const toggleClass = isAktif ? "btn-delete" : "btn-edit";

        container.innerHTML += `
            <div class="item-berita">
                <h3>${escapeHtml(u.nama)}</h3>
                <p><strong>Username:</strong> ${escapeHtml(u.username)}</p>
                <p><strong>Role:</strong> ${escapeHtml(u.role)}</p>
                <p><strong>Status:</strong> ${getUserStatusBadge(u.is_active)}</p>

                <div class="guru-actions" style="margin-top:12px; display:flex; flex-wrap:wrap; gap:10px;">
                    <button class="btn-edit" onclick="editUser(${u.id})">✏️ Edit</button>
                    <button class="${toggleClass}" onclick="toggleStatusUser(${u.id}, ${isAktif ? 0 : 1})">${toggleText}</button>
                    <button class="btn-edit" onclick="resetPasswordUser(${u.id})">🔐 Reset Password</button>
                    <button class="btn-delete" onclick="hapusUser(${u.id})">🗑️ Hapus</button>
                </div>
            </div>
        `;
    });
}

window.simpanUser = function () {
    const id = document.getElementById("idUser").value;
    const nama = document.getElementById("namaUser").value.trim();
    const username = document.getElementById("usernameUser").value.trim();
    const password = document.getElementById("passwordUser").value.trim();
    const role = document.getElementById("roleUser").value;
    const statusEl = document.getElementById("statusUser");
    const is_active = statusEl ? Number(statusEl.value) : 1;

    if (!nama || !username || !role) {
        showToast("Nama, username, dan role wajib diisi", "error");
        return;
    }

    if (!id && !password) {
        showToast("Password wajib diisi untuk user baru", "error");
        return;
    }

    const payload = {
        nama,
        username,
        role,
        is_active
    };

    if (password) payload.password = password;

    const url = id ? apiUrl(`/users/${id}`) : apiUrl("/users");
    const method = id ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal simpan user");
            return result;
        })
        .then(result => {
            showToast(result.message || "User berhasil disimpan");
            resetFormUser();
            loadUsers();
            localStorage.setItem("adminTab", "users");
            showTab("users");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal simpan user", "error");
        });
};

window.editUser = function(id) {
    const user = dataUsers.find(u => Number(u.id) === Number(id));
    if (!user) return;

    document.getElementById("idUser").value = user.id;
    document.getElementById("namaUser").value = user.nama || "";
    document.getElementById("usernameUser").value = user.username || "";
    document.getElementById("passwordUser").value = "";
    document.getElementById("roleUser").value = user.role || "";

    const statusEl = document.getElementById("statusUser");
    if (statusEl) {
        statusEl.value = String(Number(user.is_active) === 1 ? 1 : 0);
    }

    localStorage.setItem("adminTab", "users");
    showTab("users");
};

window.toggleStatusUser = function(id, targetStatus) {
    const user = dataUsers.find(u => Number(u.id) === Number(id));
    if (!user) {
        showToast("User tidak ditemukan", "error");
        return;
    }

    const confirmText = Number(targetStatus) === 1
        ? `Aktifkan user ${user.nama}?`
        : `Nonaktifkan user ${user.nama}?`;

    if (!confirm(confirmText)) return;

    const payload = {
        nama: user.nama,
        username: user.username,
        role: user.role,
        is_active: Number(targetStatus)
    };

    fetch(apiUrl(`/users/${id}`), {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal ubah status user");
            return result;
        })
        .then(result => {
            showToast(result.message || "Status user berhasil diubah");
            loadUsers();
            loadKelas();
            localStorage.setItem("adminTab", "users");
            showTab("users");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal ubah status user", "error");
        });
};

window.resetPasswordUser = function(id) {
    const password = prompt("Masukkan password baru:");
    if (!password) return;

    fetch(apiUrl(`/users/${id}/reset-password`), {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ password })
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal reset password");
            return result;
        })
        .then(result => {
            showToast(result.message || "Password berhasil direset");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal reset password", "error");
        });
};

window.hapusUser = function(id) {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    fetch(apiUrl(`/users/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal hapus user");
            return result;
        })
        .then(result => {
            showToast(result.message || "User berhasil dihapus");
            loadUsers();
            loadKelas();
            localStorage.setItem("adminTab", "users");
            showTab("users");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal hapus user", "error");
        });
};

function resetFormUser() {
    document.getElementById("idUser").value = "";
    document.getElementById("namaUser").value = "";
    document.getElementById("usernameUser").value = "";
    document.getElementById("passwordUser").value = "";
    document.getElementById("roleUser").value = "";

    const statusEl = document.getElementById("statusUser");
    if (statusEl) statusEl.value = "1";
}

// ================= AGENDA =================
let dataAgenda = [];

async function loadAgenda() {
    try {
        const res = await fetch(apiUrl("/agenda"), {
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil data agenda");

        dataAgenda = Array.isArray(result) ? result : [];
        tampilAgenda();
        renderDashboardAgendaTerbaru();
        updateStats();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal ambil data agenda", "error");
    }
}

function tampilAgenda() {
    const list = document.getElementById("list-agenda");
    if (!list) return;

    list.innerHTML = "";

    if (!dataAgenda.length) {
        list.innerHTML = "<p>Belum ada agenda.</p>";
        return;
    }

    dataAgenda.forEach(item => {
        list.innerHTML += `
            <div class="item-berita">
                <h3>${escapeHtml(item.judul)}</h3>
                <small>${formatTanggalIndonesia(item.tanggal)} ${item.waktu ? "• " + escapeHtml(item.waktu) : ""}</small>
                <p style="margin-top:8px;"><strong>Lokasi:</strong> ${escapeHtml(item.lokasi || "-")}</p>
                <p>${escapeHtml(item.deskripsi || "")}</p>
                <div class="guru-actions" style="margin-top:12px;">
                    <button class="btn-edit" onclick="editAgenda(${item.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="hapusAgenda(${item.id})">🗑️ Hapus</button>
                </div>
            </div>
        `;
    });
}

window.simpanAgenda = function () {
    const id = document.getElementById("idAgenda").value;
    const judul = document.getElementById("judulAgenda").value.trim();
    const tanggal = document.getElementById("tanggalAgenda").value;
    const waktu = document.getElementById("waktuAgenda").value;
    const lokasi = document.getElementById("lokasiAgenda").value.trim();
    const deskripsi = document.getElementById("deskripsiAgenda").value.trim();

    if (!judul || !tanggal) {
        showToast("Judul dan tanggal wajib diisi", "error");
        return;
    }

    const payload = { judul, tanggal, waktu, lokasi, deskripsi };
    const url = id ? apiUrl(`/agenda/${id}`) : apiUrl("/agenda");
    const method = id ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal simpan agenda");
            return result;
        })
        .then(result => {
            showToast(result.message || "Agenda berhasil disimpan");
            resetFormAgenda();
            loadAgenda();
            localStorage.setItem("adminTab", "agenda");
            showTab("agenda");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal simpan agenda", "error");
        });
};

window.editAgenda = function(id) {
    const item = dataAgenda.find(a => a.id === id);
    if (!item) return;

    document.getElementById("idAgenda").value = item.id;
    document.getElementById("judulAgenda").value = item.judul;
    document.getElementById("tanggalAgenda").value = String(item.tanggal).split("T")[0];
    document.getElementById("waktuAgenda").value = item.waktu || "";
    document.getElementById("lokasiAgenda").value = item.lokasi || "";
    document.getElementById("deskripsiAgenda").value = item.deskripsi || "";

    localStorage.setItem("adminTab", "agenda");
    showTab("agenda");
};

window.hapusAgenda = function(id) {
    if (!confirm("Yakin ingin menghapus agenda ini?")) return;

    fetch(apiUrl(`/agenda/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal hapus agenda");
            return result;
        })
        .then(result => {
            showToast(result.message || "Agenda berhasil dihapus");
            loadAgenda();
            localStorage.setItem("adminTab", "agenda");
            showTab("agenda");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal hapus agenda", "error");
        });
};

function resetFormAgenda() {
    document.getElementById("idAgenda").value = "";
    document.getElementById("judulAgenda").value = "";
    document.getElementById("tanggalAgenda").value = "";
    document.getElementById("waktuAgenda").value = "";
    document.getElementById("lokasiAgenda").value = "";
    document.getElementById("deskripsiAgenda").value = "";
}

function renderDashboardAgendaTerbaru() {
    const box = document.getElementById("dashboard-agenda-terbaru");
    if (!box) return;

    box.innerHTML = "";

    if (!dataAgenda.length) {
        box.innerHTML = "<p>Belum ada agenda.</p>";
        return;
    }

    dataAgenda.slice(0, 5).forEach(item => {
        box.innerHTML += `
            <div class="item-berita">
                <h3>${escapeHtml(item.judul)}</h3>
                <small>${formatTanggalIndonesia(item.tanggal)}</small>
            </div>
        `;
    });
}

// ================= PROFIL SAYA =================
async function loadProfilSaya() {
    try {
        const res = await fetch(apiUrl("/profile"), {
            headers: getAuthHeaders()
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil profil");

        const profilNama = document.getElementById("profilNama");
        const profilUsername = document.getElementById("profilUsername");
        const profilRole = document.getElementById("profilRole");

        if (profilNama) profilNama.value = result.nama || "";
        if (profilUsername) profilUsername.value = result.username || "";
        if (profilRole) profilRole.value = result.role || "";
    } catch (err) {
        console.error(err);
    }
}

window.updateProfilSaya = function () {
    const profilNama = document.getElementById("profilNama");
    if (!profilNama) return;

    const nama = profilNama.value.trim();

    if (!nama) {
        showToast("Nama wajib diisi", "error");
        return;
    }

    fetch(apiUrl("/profile"), {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ nama })
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal update profil");
            return result;
        })
        .then(result => {
            localStorage.setItem("nama", nama);
            showToast(result.message || "Profil berhasil diupdate");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal update profil", "error");
        });
};

window.gantiPasswordSaya = function () {
    const lamaEl = document.getElementById("passwordLama");
    const baruEl = document.getElementById("passwordBaru");

    if (!lamaEl || !baruEl) return;

    const passwordLama = lamaEl.value.trim();
    const passwordBaru = baruEl.value.trim();

    if (!passwordLama || !passwordBaru) {
        showToast("Password lama dan baru wajib diisi", "error");
        return;
    }

    fetch(apiUrl("/profile/change-password"), {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ passwordLama, passwordBaru })
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal ganti password");
            return result;
        })
        .then(result => {
            lamaEl.value = "";
            baruEl.value = "";
            showToast(result.message || "Password berhasil diganti");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal ganti password", "error");
        });
};

// ================= PROFIL WEBSITE =================
async function loadWebsiteProfile() {
    try {
        const res = await fetch(apiUrl("/website-profile"), {
            headers: getAuthHeaders()
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Gagal ambil profil website");

        const map = {
            wpNamaSekolah: result.nama_sekolah || "",
            wpHeroJudul: result.hero_judul || "",
            wpHeroDeskripsi: result.hero_deskripsi || "",
            wpTentangJudul: result.tentang_judul || "",
            wpTentangDeskripsi: result.tentang_deskripsi || "",
            wpVisi: result.visi || "",
            wpMisi: result.misi || "",
            wpAlamat: result.alamat || "",
            wpTelepon: result.telepon || "",
            wpEmail: result.email || "",
            wpAkreditasi: result.akreditasi || "",
            wpPembelajaran: result.pembelajaran || "",
            wpLingkungan: result.lingkungan || ""
        };

        Object.keys(map).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = map[id];
        });
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal ambil profil website", "error");
    }
}

window.simpanWebsiteProfile = function() {
    const payload = {
        nama_sekolah: document.getElementById("wpNamaSekolah")?.value.trim() || "",
        hero_judul: document.getElementById("wpHeroJudul")?.value.trim() || "",
        hero_deskripsi: document.getElementById("wpHeroDeskripsi")?.value.trim() || "",
        tentang_judul: document.getElementById("wpTentangJudul")?.value.trim() || "",
        tentang_deskripsi: document.getElementById("wpTentangDeskripsi")?.value.trim() || "",
        visi: document.getElementById("wpVisi")?.value.trim() || "",
        misi: document.getElementById("wpMisi")?.value.trim() || "",
        alamat: document.getElementById("wpAlamat")?.value.trim() || "",
        telepon: document.getElementById("wpTelepon")?.value.trim() || "",
        email: document.getElementById("wpEmail")?.value.trim() || "",
        akreditasi: document.getElementById("wpAkreditasi")?.value.trim() || "",
        pembelajaran: document.getElementById("wpPembelajaran")?.value.trim() || "",
        lingkungan: document.getElementById("wpLingkungan")?.value.trim() || ""
    };

    if (!payload.nama_sekolah || !payload.hero_judul) {
        showToast("Nama sekolah dan judul hero wajib diisi", "error");
        return;
    }

    fetch(apiUrl("/website-profile"), {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal simpan profil website");
            return result;
        })
        .then(result => {
            showToast(result.message || "Profil website berhasil disimpan");
            loadWebsiteProfile();
            localStorage.setItem("adminTab", "profil");
            showTab("profil");
        })
        .catch(err => {
            console.error(err);
            showToast(err.message || "Gagal simpan profil website", "error");
        });
};

// ================= PPDB =================
let dataPPDB = [];

function getFilePreviewUrl(filename) {
    if (!filename) return "#";
    return `${BASE_URL}/uploads/${filename}`;
}

function getStatusBadgePPDB(status) {
    const value = String(status || "").toLowerCase();

    if (value === "diterima") {
        return `<span class="badge-soft-green">Diterima</span>`;
    }
    if (value === "ditolak") {
        return `<span class="badge-soft-red">Ditolak</span>`;
    }
    if (value === "diverifikasi") {
        return `<span class="badge-soft-blue">Diverifikasi</span>`;
    }
    return `<span class="badge-soft-orange">Menunggu</span>`;
}

function updateStatsPPDB() {
    const total = dataPPDB.length;
    const menunggu = dataPPDB.filter(x => String(x.status).toLowerCase() === "menunggu").length;
    const diverifikasi = dataPPDB.filter(x => String(x.status).toLowerCase() === "diverifikasi").length;
    const diterima = dataPPDB.filter(x => String(x.status).toLowerCase() === "diterima").length;
    const ditolak = dataPPDB.filter(x => String(x.status).toLowerCase() === "ditolak").length;

    const totalEl = document.getElementById("ppdbTotalSemua");
    const menungguEl = document.getElementById("ppdbTotalMenunggu");
    const verifikasiEl = document.getElementById("ppdbTotalVerifikasi");
    const diterimaEl = document.getElementById("ppdbTotalDiterima");
    const ditolakEl = document.getElementById("ppdbTotalDitolak");

    if (totalEl) totalEl.textContent = total;
    if (menungguEl) menungguEl.textContent = menunggu;
    if (verifikasiEl) verifikasiEl.textContent = diverifikasi;
    if (diterimaEl) diterimaEl.textContent = diterima;
    if (ditolakEl) ditolakEl.textContent = ditolak;
}

window.loadPPDB = async function () {
    const keyword = document.getElementById("searchPPDB")?.value.trim() || "";
    const status = document.getElementById("filterStatusPPDB")?.value || "";
    const list = document.getElementById("list-ppdb");

    try {
        if (list) list.innerHTML = "<p>Memuat data PPDB...</p>";

        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (status) params.append("status", status);

        const res = await fetch(apiUrl(`/ppdb?${params.toString()}`), {
            headers: getAuthHeaders()
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Gagal ambil data PPDB");
        }

        dataPPDB = Array.isArray(result) ? result : [];
        renderPPDB();
        updateStatsPPDB();
    } catch (err) {
        console.error(err);
        dataPPDB = [];
        updateStatsPPDB();
        if (list) list.innerHTML = `<p>${escapeHtml(err.message)}</p>`;
        showToast(err.message || "Gagal load data PPDB", "error");
    }
};

function renderPPDB() {
    const list = document.getElementById("list-ppdb");
    if (!list) return;

    if (!dataPPDB.length) {
        list.innerHTML = `<div class="premium-empty-state">Belum ada pendaftar PPDB.</div>`;
        return;
    }

    list.innerHTML = `
        <div class="premium-table-card">
            <div class="premium-table-toolbar">
                <div>
                    <h3>Data Pendaftar PPDB</h3>
                    <p>Total ${dataPPDB.length} pendaftar</p>
                </div>
                <span class="premium-badge blue">PPDB Online</span>
            </div>

            <div class="premium-table-wrap">
                <table class="premium-table-admin">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>No Pendaftaran</th>
                            <th>Nama</th>
                            <th>Asal Sekolah</th>
                            <th>HP</th>
                            <th>Status</th>
                            <th>Berkas</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataPPDB.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    <strong>${escapeHtml(item.no_pendaftaran || "-")}</strong><br>
                                    <small>${item.created_at ? formatTanggalIndonesia(item.created_at) : "-"}</small>
                                </td>
                                <td>
                                    <div class="ppdb-name-block">
                                        <strong>${escapeHtml(item.nama_lengkap || "-")}</strong>
                                        <small>NISN: ${escapeHtml(item.nisn || "-")}</small>
                                    </div>
                                </td>
                                <td>${escapeHtml(item.asal_sekolah || "-")}</td>
                                <td>${escapeHtml(item.no_hp || "-")}</td>
                                <td>${getStatusBadgePPDB(item.status)}</td>
                                <td>
                                    <div class="ppdb-berkas-links">
                                        ${item.akta_file ? `<a href="${getFilePreviewUrl(item.akta_file)}" target="_blank">Akta</a>` : ""}
                                        ${item.kk_file ? `<a href="${getFilePreviewUrl(item.kk_file)}" target="_blank">KK</a>` : ""}
                                        ${item.foto_file ? `<a href="${getFilePreviewUrl(item.foto_file)}" target="_blank">Foto</a>` : ""}
                                        ${item.ijazah_file ? `<a href="${getFilePreviewUrl(item.ijazah_file)}" target="_blank">Ijazah</a>` : ""}
                                        ${!item.akta_file && !item.kk_file && !item.foto_file && !item.ijazah_file ? "-" : ""}
                                    </div>
                                </td>
                                <td>
                                    <div class="ppdb-action-group">
    <button class="premium-btn-edit" onclick="lihatDetailPPDB(${item.id})">Detail</button>
    <button class="premium-btn-edit" onclick="ubahStatusPPDB(${item.id}, 'diverifikasi')">Verifikasi</button>
    <button class="premium-btn-edit" onclick="ubahStatusPPDB(${item.id}, 'diterima')">Terima</button>
    <button class="premium-btn-delete" onclick="ubahStatusPPDB(${item.id}, 'ditolak')">Tolak</button>
    <button class="premium-btn-delete" onclick="hapusPPDB(${item.id})">Hapus</button>
</div>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.ubahStatusPPDB = async function (id, status) {
    const catatan_admin = prompt("Catatan admin (opsional):", "") || "";

    try {
        const res = await fetch(apiUrl(`/ppdb/${id}/status`), {
            method: "PUT",
            headers: getAuthHeaders(true),
            body: JSON.stringify({ status, catatan_admin })
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Gagal update status PPDB");

        showToast(result.message || "Status PPDB berhasil diupdate");
        await loadPPDB();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal update status PPDB", "error");
    }
};

window.hapusPPDB = async function (id) {
    if (!confirm("Yakin ingin menghapus data PPDB ini?")) return;

    try {
        const res = await fetch(apiUrl(`/ppdb/${id}`), {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Gagal hapus data PPDB");

        showToast(result.message || "Data PPDB berhasil dihapus");
        await loadPPDB();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal hapus data PPDB", "error");
    }
};

window.exportPPDBPDF = async function () {
    if (!dataPPDB.length) {
        showToast("Belum ada data PPDB untuk diexport", "error");
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast("Library PDF belum termuat", "error");
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const statusFilter = document.getElementById("filterStatusPPDB")?.value || "semua";
        const keyword = document.getElementById("searchPPDB")?.value.trim() || "-";

        const total = dataPPDB.length;
        const menunggu = dataPPDB.filter(x => String(x.status).toLowerCase() === "menunggu").length;
        const diverifikasi = dataPPDB.filter(x => String(x.status).toLowerCase() === "diverifikasi").length;
        const diterima = dataPPDB.filter(x => String(x.status).toLowerCase() === "diterima").length;
        const ditolak = dataPPDB.filter(x => String(x.status).toLowerCase() === "ditolak").length;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("SD HARAPAN", 14, 16);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Laporan Data Pendaftar PPDB", 14, 22);
        doc.text("Dashboard Admin", 14, 27);

        doc.setDrawColor(29, 78, 216);
        doc.setLineWidth(0.8);
        doc.line(14, 32, pageWidth - 14, 32);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("LAPORAN PPDB", pageWidth / 2, 41, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(`Filter Status : ${statusFilter}`, 14, 50);
        doc.text(`Keyword : ${keyword}`, 14, 56);
        doc.text(`Tanggal Cetak : ${new Date().toLocaleDateString("id-ID")}`, 14, 62);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.text(`Total: ${total}`, 14, 72);
        doc.text(`Menunggu: ${menunggu}`, 45, 72);
        doc.text(`Diverifikasi: ${diverifikasi}`, 85, 72);
        doc.text(`Diterima: ${diterima}`, 130, 72);
        doc.text(`Ditolak: ${ditolak}`, 165, 72);

        const bodyRows = dataPPDB.map((item, index) => [
            index + 1,
            item.no_pendaftaran || "-",
            item.nama_lengkap || "-",
            item.nisn || "-",
            item.asal_sekolah || "-",
            item.no_hp || "-",
            item.status || "-"
        ]);

        doc.autoTable({
            startY: 78,
            head: [[
                "No",
                "No Pendaftaran",
                "Nama Lengkap",
                "NISN",
                "Asal Sekolah",
                "No HP",
                "Status"
            ]],
            body: bodyRows,
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 9.5,
                cellPadding: 3,
                valign: "middle",
                halign: "center",
                lineColor: [220, 220, 220],
                lineWidth: 0.2
            },
            headStyles: {
                fillColor: [29, 78, 216],
                textColor: 255,
                fontStyle: "bold"
            },
            columnStyles: {
                0: { cellWidth: 12 },
                1: { cellWidth: 38 },
                2: { cellWidth: 70, halign: "left" },
                3: { cellWidth: 28 },
                4: { cellWidth: 55, halign: "left" },
                5: { cellWidth: 34 },
                6: { cellWidth: 28 }
            },
            didDrawPage: function (data) {
                const currentPage = data.pageNumber;
                const totalPages = doc.internal.getNumberOfPages();

                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.text(
                    `Halaman ${currentPage} dari ${totalPages}`,
                    pageWidth - 14,
                    pageHeight - 8,
                    { align: "right" }
                );
            }
        });

        const namaFile = `laporan-ppdb-${statusFilter}-${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(namaFile);
        showToast("Export PDF PPDB berhasil");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal export PDF PPDB", "error");
    }
};

window.lihatDetailPPDB = async function (id) {
    const modal = document.getElementById("modalDetailPPDB");
    const content = document.getElementById("detailPPDBContent");

    if (!modal || !content) return;

    modal.style.display = "block";
    content.innerHTML = "<p>Memuat detail...</p>";

    try {
        const res = await fetch(apiUrl(`/ppdb/${id}`), {
            headers: getAuthHeaders()
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Gagal ambil detail PPDB");

        content.innerHTML = `
            <div class="ppdb-detail-grid">
                <div class="ppdb-detail-card">
                    <h4>Informasi Pendaftaran</h4>
                    <div class="ppdb-detail-list">
                        <div class="ppdb-detail-item"><strong>No Pendaftaran</strong><span>${escapeHtml(result.no_pendaftaran || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>Status</strong><span>${getStatusBadgePPDB(result.status)}</span></div>
                        <div class="ppdb-detail-item"><strong>Tanggal Daftar</strong><span>${result.created_at ? formatTanggalIndonesia(result.created_at) : "-"}</span></div>
                        <div class="ppdb-detail-item"><strong>Pilihan Kelas</strong><span>${escapeHtml(result.pilihan_kelas || "-")}</span></div>
                    </div>
                </div>

                <div class="ppdb-detail-card">
                    <h4>Data Siswa</h4>
                    <div class="ppdb-detail-list">
                        <div class="ppdb-detail-item"><strong>Nama Lengkap</strong><span>${escapeHtml(result.nama_lengkap || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>Jenis Kelamin</strong><span>${escapeHtml(result.jenis_kelamin || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>Tempat Lahir</strong><span>${escapeHtml(result.tempat_lahir || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>Tanggal Lahir</strong><span>${escapeHtml(result.tanggal_lahir || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>NISN</strong><span>${escapeHtml(result.nisn || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>Agama</strong><span>${escapeHtml(result.agama || "-")}</span></div>
                    </div>
                </div>

                <div class="ppdb-detail-card full">
                    <h4>Alamat</h4>
                    <div class="ppdb-detail-list">
                        <div class="ppdb-detail-item"><strong>Alamat Lengkap</strong><span>${escapeHtml(result.alamat || "-")}</span></div>
                    </div>
                </div>

                <div class="ppdb-detail-card">
                    <h4>Data Orang Tua</h4>
                    <div class="ppdb-detail-list">
                        <div class="ppdb-detail-item"><strong>Nama Ayah</strong><span>${escapeHtml(result.nama_ayah || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>Nama Ibu</strong><span>${escapeHtml(result.nama_ibu || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>No HP</strong><span>${escapeHtml(result.no_hp || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>Email</strong><span>${escapeHtml(result.email || "-")}</span></div>
                    </div>
                </div>

                <div class="ppdb-detail-card">
                    <h4>Asal Sekolah</h4>
                    <div class="ppdb-detail-list">
                        <div class="ppdb-detail-item"><strong>Asal Sekolah</strong><span>${escapeHtml(result.asal_sekolah || "-")}</span></div>
                        <div class="ppdb-detail-item"><strong>Catatan Admin</strong><span>${escapeHtml(result.catatan_admin || "-")}</span></div>
                    </div>
                </div>

                <div class="ppdb-detail-card full">
                    <h4>Berkas Pendaftaran</h4>
                    <div class="ppdb-file-list">
                        ${result.akta_file ? `<a href="${getFilePreviewUrl(result.akta_file)}" target="_blank">Lihat Akta</a>` : ""}
                        ${result.kk_file ? `<a href="${getFilePreviewUrl(result.kk_file)}" target="_blank">Lihat KK</a>` : ""}
                        ${result.foto_file ? `<a href="${getFilePreviewUrl(result.foto_file)}" target="_blank">Lihat Foto</a>` : ""}
                        ${result.ijazah_file ? `<a href="${getFilePreviewUrl(result.ijazah_file)}" target="_blank">Lihat Ijazah/SKL</a>` : ""}
                        ${!result.akta_file && !result.kk_file && !result.foto_file && !result.ijazah_file ? "<span>-</span>" : ""}
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error(err);
        content.innerHTML = `<p>${escapeHtml(err.message)}</p>`;
        showToast(err.message || "Gagal ambil detail PPDB", "error");
    }
};

window.tutupDetailPPDB = function () {
    const modal = document.getElementById("modalDetailPPDB");
    if (modal) modal.style.display = "none";
};

function resetSummaryGuruAdmin() {
    const total = document.getElementById("rekapTotalGuruAdmin");
    const hadir = document.getElementById("rekapHadirGuruAdmin");
    const izin = document.getElementById("rekapIzinGuruAdmin");
    const sakit = document.getElementById("rekapSakitGuruAdmin");
    const alpha = document.getElementById("rekapAlphaGuruAdmin");

    if (total) total.textContent = "0";
    if (hadir) hadir.textContent = "0";
    if (izin) izin.textContent = "0";
    if (sakit) sakit.textContent = "0";
    if (alpha) alpha.textContent = "0";
}

async function loadSummaryAbsensiGuruAdmin() {
    const tanggal = document.getElementById("tanggalAbsensiGuruAdmin")?.value || "";

    if (!tanggal) {
        resetSummaryGuruAdmin();
        return;
    }

    try {
        const res = await fetch(
            apiUrl(`/absensi-guru/summary?tanggal=${encodeURIComponent(tanggal)}`),
            { headers: getAuthHeaders() }
        );
        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Gagal ambil summary absensi guru");
        }

        document.getElementById("rekapTotalGuruAdmin").textContent = result.total_guru || 0;
        document.getElementById("rekapHadirGuruAdmin").textContent = result.hadir || 0;
        document.getElementById("rekapIzinGuruAdmin").textContent = result.izin || 0;
        document.getElementById("rekapSakitGuruAdmin").textContent = result.sakit || 0;
        document.getElementById("rekapAlphaGuruAdmin").textContent = result.alpha || 0;
    } catch (err) {
        console.error(err);
        resetSummaryGuruAdmin();
        showToast(err.message || "Gagal ambil summary absensi guru", "error");
    }
}
function renderRekapAbsensiGuruAdmin(rows) {
    const list = document.getElementById("list-absensi-guru-admin");
    if (!list) return;

    if (!rows || !rows.length) {
        list.innerHTML = "<p>Tidak ada data absensi guru pada tanggal ini.</p>";
        return;
    }

    list.innerHTML = `
        <div class="absensi-table-card">
            <table class="absensi-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Guru</th>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Jam Masuk</th>
                        <th>Jam Pulang</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((item, index) => {
                        const badge =
                            item.status === "hadir" ? `<span class="absensi-badge hadir">Hadir</span>` :
                            item.status === "izin" ? `<span class="absensi-badge izin">Izin</span>` :
                            item.status === "sakit" ? `<span class="absensi-badge sakit">Sakit</span>` :
                            item.status === "alpha" ? `<span class="absensi-badge alpha">Alpha</span>` :
                            `<span class="absensi-badge kosong">Belum Diisi</span>`;

                        const jamMasuk = item.jam_masuk
                            ? new Date(item.jam_masuk).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                            : "-";

                        const jamPulang = item.jam_pulang
                            ? new Date(item.jam_pulang).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                            : "-";

                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${escapeHtml(item.nama || "-")}</td>
                                <td>${escapeHtml(item.username || "-")}</td>
                                <td>${badge}</td>
                                <td>${jamMasuk}</td>
                                <td>${jamPulang}</td>
                                <td>${escapeHtml(item.keterangan || "-")}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}

window.loadRekapAbsensiGuruAdmin = async function () {
    const tanggal = document.getElementById("tanggalAbsensiGuruAdmin")?.value || "";
    const list = document.getElementById("list-absensi-guru-admin");

    if (!tanggal) {
        if (list) list.innerHTML = "<p>Pilih tanggal terlebih dahulu.</p>";
        resetSummaryGuruAdmin();
        return;
    }

    try {
        if (list) list.innerHTML = "<p>Loading rekap absensi guru...</p>";

        const res = await fetch(
            apiUrl(`/absensi-guru/rekap?tanggal=${encodeURIComponent(tanggal)}`),
            { headers: getAuthHeaders() }
        );
        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Gagal ambil rekap absensi guru");
        }

        renderRekapAbsensiGuruAdmin(result);
        await loadSummaryAbsensiGuruAdmin();
    } catch (err) {
        console.error(err);
        if (list) list.innerHTML = `<p>${err.message}</p>`;
        resetSummaryGuruAdmin();
        showToast(err.message || "Gagal ambil rekap absensi guru", "error");
    }
};

function renderBulananGuruAdmin(rows) {
    const wrap = document.getElementById("rekapBulananGuruAdminWrap");
    if (!wrap) return;

    if (!rows || !rows.length) {
        wrap.innerHTML = "<p>Tidak ada data rekap bulanan guru.</p>";
        return;
    }

    wrap.innerHTML = `
        <div class="absensi-table-card">
            <table class="absensi-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Guru</th>
                        <th>Username</th>
                        <th>Hadir</th>
                        <th>Izin</th>
                        <th>Sakit</th>
                        <th>Alpha</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${escapeHtml(item.nama || "-")}</td>
                            <td>${escapeHtml(item.username || "-")}</td>
                            <td>${item.hadir || 0}</td>
                            <td>${item.izin || 0}</td>
                            <td>${item.sakit || 0}</td>
                            <td>${item.alpha || 0}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

window.loadBulananGuruAdmin = async function () {
    const bulan = document.getElementById("bulanRekapGuruAdmin")?.value || "";
    const tahun = document.getElementById("tahunRekapGuruAdmin")?.value || "";
    const wrap = document.getElementById("rekapBulananGuruAdminWrap");

    if (!bulan || !tahun) {
        if (wrap) wrap.innerHTML = "<p>Pilih bulan dan tahun terlebih dahulu.</p>";
        return;
    }

    try {
        if (wrap) wrap.innerHTML = "<p>Loading rekap bulanan guru...</p>";

        const res = await fetch(
            apiUrl(`/absensi-guru/bulanan?bulan=${encodeURIComponent(bulan)}&tahun=${encodeURIComponent(tahun)}`),
            { headers: getAuthHeaders() }
        );
        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Gagal ambil rekap bulanan guru");
        }

        renderBulananGuruAdmin(result);
    } catch (err) {
        console.error(err);
        if (wrap) wrap.innerHTML = `<p>${err.message}</p>`;
        showToast(err.message || "Gagal ambil rekap bulanan guru", "error");
    }
};



// ================= STATS =================
function updateStats() {
    const totalBerita = document.getElementById("totalBerita");
    const totalGuru = document.getElementById("totalGuru");
    const totalSiswa = document.getElementById("totalSiswa");
    const totalPengumuman = document.getElementById("totalPengumuman");
    const totalAgenda = document.getElementById("totalAgenda");
    const pesanBelumDibaca = document.getElementById("pesanBelumDibaca");
    const badgePesan = document.getElementById("badgePesan");

    if (totalBerita) totalBerita.innerText = Array.isArray(data) ? data.length : 0;
    if (totalGuru) totalGuru.innerText = Array.isArray(dataGuru) ? dataGuru.length : 0;
    if (totalSiswa) totalSiswa.innerText = Array.isArray(dataSiswa) ? dataSiswa.length : 0;
    if (totalPengumuman) totalPengumuman.innerText = Array.isArray(dataPengumuman) ? dataPengumuman.length : 0;
    if (totalAgenda) totalAgenda.innerText = Array.isArray(dataAgenda) ? dataAgenda.length : 0;

    const unreadCount = Array.isArray(dataPesan)
        ? dataPesan.filter(item => String(item.status || "").toLowerCase() === "baru").length
        : 0;

    if (pesanBelumDibaca) pesanBelumDibaca.innerText = unreadCount;
    if (badgePesan) {
        badgePesan.innerText = unreadCount;
        badgePesan.style.display = unreadCount > 0 ? "inline-block" : "none";
    }
}

window.exportBulananAdminPDF = function () {
    if (!dataAbsensiAdminBulanan || dataAbsensiAdminBulanan.length === 0) {
        showToast("Data bulanan belum ditampilkan!", "error");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape");

    const bulan = document.getElementById("bulanRekapAdmin").value;
    const tahun = document.getElementById("tahunRekapAdmin").value;
    const kelas_id = document.getElementById("kelasAbsensiAdmin").value;

    const kelas = dataKelas.find(k => String(k.id) === String(kelas_id));
    const namaKelas = kelas ? kelas.nama_kelas : "-";

    doc.setFontSize(16);
    doc.text("REKAP ABSENSI BULANAN", 140, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Kelas : ${namaKelas}`, 14, 25);
    doc.text(`Periode : ${getNamaBulanAdmin(bulan)} ${tahun}`, 14, 32);

    const table = dataAbsensiAdminBulanan.map((item, i) => {
        const hadir = Number(item.hadir || 0);
        const izin = Number(item.izin || 0);
        const sakit = Number(item.sakit || 0);
        const alpha = Number(item.alpha || 0);
        const total = Number(item.total_tercatat || 0);
        const persen = total > 0 ? Math.round((hadir / total) * 100) + "%" : "0%";

        return [
            i + 1,
            item.nama,
            item.nis,
            hadir,
            izin,
            sakit,
            alpha,
            total,
            persen
        ];
    });

    doc.autoTable({
        startY: 40,
        head: [["No", "Nama", "NIS", "Hadir", "Izin", "Sakit", "Alpha", "Total", "%"]],
        body: table,
        styles: {
            fontSize: 9
        }
    });

    doc.save(`rekap-bulanan-${namaKelas}-${bulan}-${tahun}.pdf`);
};

// ================= LOGOUT =================
window.logout = function() {
    localStorage.removeItem("login");
    localStorage.removeItem("adminTab");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("nama");
    localStorage.removeItem("role");
    localStorage.removeItem("guruTab");
    localStorage.removeItem("activeTab");
    sessionStorage.clear();
    location.href = "login.html";
};

// ================= INIT =================



window.addEventListener("DOMContentLoaded", () => {
    restoreTab();

    loadBerita();
    loadPengumuman();
    loadGuru();
    loadKelas();
    loadSiswa();
    loadGaleri();
    loadPesan();
    loadUsers();
    loadAgenda();
    loadProfilSaya();
    loadWebsiteProfile();
    loadPPDB();

    setInterval(() => {
        loadPesan();
    }, 5000);
});