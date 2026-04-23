const BASE_URL = "http://localhost:3000";

function apiUrl(path = "") {
    return `${BASE_URL}${path}`;
}

// ================= AUTH =================
function getAuthHeaders(isJson = false) {
    const token = localStorage.getItem("token");
    const headers = {};

    if (token) headers["Authorization"] = "Bearer " + token;
    if (isJson) headers["Content-Type"] = "application/json";

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

    setTimeout(() => toast.classList.add("show"), 10);

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

// ================= LOGIN CHECK =================
if (localStorage.getItem("login") !== "true") {
    location.href = "login.html";
}

if (
    localStorage.getItem("username") !== "guru" &&
    localStorage.getItem("role") !== "guru"
) {
    location.href = "admin.html";
}

// ================= TAB =================
function showTab(tab, event = null) {
    const allTabs = [
        "dashboard",
        "beritaTab",
        "pengumumanTab",
        "guruTab",
        "siswaTab",
        "absensiTab",
        "kelasTab",
        "galeriTab",
        "pesanTab",
        "usersTab",
        "agendaTab",
        "profilTab"
    ];

    allTabs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    const map = {
        dashboard: "dashboard",
        berita: "beritaTab",
        pengumuman: "pengumumanTab",
        guru: "guruTab",
        siswa: "siswaTab",
        absensi: "absensiTab",
        kelas: "kelasTab",
        galeri: "galeriTab",
        pesan: "pesanTab",
        users: "usersTab",
        agenda: "agendaTab",
        profil: "profilTab"
    };

    if (map[tab]) {
        const target = document.getElementById(map[tab]);
        if (target) target.style.display = "block";
    }

    document.querySelectorAll(".school-menu li").forEach(item => {
        item.classList.remove("active");
    });

    if (event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }

    localStorage.setItem("guruTab", tab);
}

function restoreTab() {
    showTab(localStorage.getItem("guruTab") || "dashboard");
}

// ================= DATA =================
let dataSiswa = [];
let dataKelas = [];
let grafikAbsensiInstance = null;
let dataBulananGuru = [];

// ================= HELPER =================
function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getToday() {
    return new Date().toISOString().split("T")[0];
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

function getNamaBulan(bulan) {
    const nama = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return nama[Number(bulan)] || "-";
}

function setDefaultBulanTahun() {
    const now = new Date();
    const bulan = document.getElementById("bulanRekapGuru");
    const tahun = document.getElementById("tahunRekapGuru");

    if (bulan) bulan.value = String(now.getMonth() + 1);
    if (tahun) tahun.value = String(now.getFullYear());
}

async function fetchJsonSafe(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();

    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (e) {
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} - Response bukan JSON`);
        }
        throw new Error("Response server bukan JSON");
    }

    if (!res.ok) {
        throw new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
    }

    return data;
}

function loadImageAsDataURL(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = function () {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                resolve(canvas.toDataURL("image/png"));
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = function () {
            reject(new Error("Gagal memuat logo sekolah"));
        };

        img.src = src;
    });
}

function updateDashboardInfo() {
    const nama = localStorage.getItem("nama") || "Guru";
    const role = localStorage.getItem("role") || "guru";

    const namaLogin = document.getElementById("namaLogin");
    const guruRole = document.getElementById("guruRole");
    const guruRoleTopbar = document.getElementById("guruRoleTopbar");
    const dashboardNamaGuru = document.getElementById("dashboardNamaGuru");
    const dashboardRoleGuru = document.getElementById("dashboardRoleGuru");
    const dashboardRoleGuruText = document.getElementById("dashboardRoleGuruText");
    const dashboardKelasInfo = document.getElementById("dashboardKelasInfo");
    const dashboardKelasInfoText = document.getElementById("dashboardKelasInfoText");
    const totalSiswa = document.getElementById("totalSiswa");
    const dashboardKelasCount = document.getElementById("dashboardKelasCount");

    const kelasText = dataKelas.length
        ? dataKelas.map(k => k.nama_kelas).join(", ")
        : "Belum ada kelas";

    if (namaLogin) namaLogin.textContent = nama;
    if (guruRole) guruRole.textContent = role;
    if (guruRoleTopbar) guruRoleTopbar.textContent = `Mengelola ${dataSiswa.length} siswa`;
    if (dashboardNamaGuru) dashboardNamaGuru.textContent = nama;
    if (dashboardRoleGuru) dashboardRoleGuru.textContent = role;
    if (dashboardRoleGuruText) dashboardRoleGuruText.textContent = role;
    if (dashboardKelasInfo) dashboardKelasInfo.textContent = kelasText;
    if (dashboardKelasInfoText) dashboardKelasInfoText.textContent = kelasText;
    if (totalSiswa) totalSiswa.textContent = dataSiswa.length;
    if (dashboardKelasCount) dashboardKelasCount.textContent = dataKelas.length;
}

function resetSummary() {
    ["rekapTotalSiswa", "rekapHadir", "rekapIzin", "rekapSakit", "rekapAlpha"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = "0";
        });
}

// ================= LOAD KELAS =================
async function loadKelas() {
    try {
        const data = await fetchJsonSafe(apiUrl("/kelas"), {
            headers: getAuthHeaders()
        });

        dataKelas = Array.isArray(data) ? data : [];

        const kelasAbsensi = document.getElementById("kelasAbsensi");
        const kelasSiswa = document.getElementById("kelasSiswa");
        const filterKelasGuru = document.getElementById("filterKelasGuru");

        if (kelasAbsensi) {
            kelasAbsensi.innerHTML = `<option value="">Pilih Kelas</option>`;
            dataKelas.forEach(k => {
                kelasAbsensi.innerHTML += `<option value="${k.id}">${escapeHtml(k.nama_kelas)}</option>`;
            });
        }

        if (kelasSiswa) {
            kelasSiswa.innerHTML = `<option value="">Pilih Kelas</option>`;
            dataKelas.forEach(k => {
                kelasSiswa.innerHTML += `<option value="${k.id}">${escapeHtml(k.nama_kelas)}</option>`;
            });
        }

        if (filterKelasGuru) {
            filterKelasGuru.innerHTML = `<option value="">Semua Kelas</option>`;
            dataKelas.forEach(k => {
                filterKelasGuru.innerHTML += `<option value="${k.id}">${escapeHtml(k.nama_kelas)}</option>`;
            });
        }

        if (kelasAbsensi && dataKelas.length === 1) {
            kelasAbsensi.value = dataKelas[0].id;
        }

        updateDashboardInfo();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal load kelas", "error");
    }
}

// ================= LOAD SISWA =================
async function loadSiswa() {
    try {
        const data = await fetchJsonSafe(apiUrl("/siswa"), {
            headers: getAuthHeaders()
        });

        dataSiswa = Array.isArray(data) ? data : [];
        tampilSiswa(dataSiswa);
        updateDashboardInfo();
    } catch (err) {
        console.error(err);
        dataSiswa = [];
        tampilSiswa([]);
        updateDashboardInfo();
        showToast(err.message || "Gagal load siswa", "error");
    }
}

function tampilSiswa(data) {
    const list = document.getElementById("list-siswa");
    if (!list) return;

    if (!data.length) {
        list.innerHTML = `<div class="premium-empty-state">Tidak ada siswa</div>`;
        return;
    }

    list.innerHTML = `
        <div class="premium-table-card">
            <div class="premium-table-toolbar">
                <div>
                    <h3>Daftar Siswa</h3>
                    <p>Data siswa sesuai kelas guru</p>
                </div>
                <span class="premium-badge green">Total: ${data.length} Siswa</span>
            </div>

            <div class="premium-table-wrap">
                <table class="premium-table-admin">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Siswa</th>
                            <th>Kelas</th>
                            <th>NIS</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((s, i) => {
                            const inisial = String(s.nama || "S").trim().charAt(0).toUpperCase();

                            return `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>
                                        <div class="premium-table-name">
                                            <div class="premium-table-avatar">${inisial}</div>
                                            <div class="premium-table-main">
                                                <strong>${escapeHtml(s.nama)}</strong>
                                                <small>ID: ${s.id}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="premium-badge blue">${escapeHtml(s.nama_kelas || "-")}</span>
                                    </td>
                                    <td>${escapeHtml(s.nis || "-")}</td>
                                    <td>
                                        <div class="premium-table-actions">
                                            <button class="premium-btn-edit" onclick="lihatRiwayat(${s.id})">📋 Riwayat</button>
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
window.filterSiswaByKelasGuru = function () {
    const filter = document.getElementById("filterKelasGuru")?.value || "";

    if (!filter) {
        tampilSiswa(dataSiswa);
        return;
    }

    const hasil = dataSiswa.filter(s => String(s.kelas_id) === String(filter));
    tampilSiswa(hasil);
};

// ================= SUMMARY =================
async function loadSummary() {
    const tanggal = document.getElementById("tanggalAbsensi")?.value || "";
    const kelas_id = document.getElementById("kelasAbsensi")?.value || "";

    if (!tanggal || !kelas_id) {
        resetSummary();
        return;
    }

    try {
        const d = await fetchJsonSafe(
            apiUrl(`/absensi/summary?tanggal=${encodeURIComponent(tanggal)}&kelas_id=${encodeURIComponent(kelas_id)}`),
            { headers: getAuthHeaders() }
        );

        document.getElementById("rekapTotalSiswa").textContent = d.total_siswa || 0;
        document.getElementById("rekapHadir").textContent = d.hadir || 0;
        document.getElementById("rekapIzin").textContent = d.izin || 0;
        document.getElementById("rekapSakit").textContent = d.sakit || 0;
        document.getElementById("rekapAlpha").textContent = d.alpha || 0;
    } catch (err) {
        console.error(err);
        resetSummary();
        showToast(err.message || "Gagal ambil summary absensi", "error");
    }
}

// ================= REKAP HARIAN =================
window.loadRekapAbsensiGuru = async function () {
    const tanggal = document.getElementById("tanggalAbsensi")?.value || "";
    const kelas_id = document.getElementById("kelasAbsensi")?.value || "";
    const list = document.getElementById("list-absensi");
    const printInfo = document.getElementById("printInfoAbsensi");

    if (!tanggal || !kelas_id) {
        if (list) list.innerHTML = "<p>Pilih tanggal dan kelas</p>";
        if (printInfo) printInfo.textContent = "Tanggal dan kelas belum dipilih";
        resetSummary();
        return;
    }

    try {
        if (list) list.innerHTML = "<p>Loading...</p>";

        const kelasDipilih = dataKelas.find(k => String(k.id) === String(kelas_id));
        if (printInfo) {
            printInfo.textContent = `Kelas: ${kelasDipilih ? kelasDipilih.nama_kelas : "-"} | Tanggal: ${formatTanggalIndonesia(tanggal)}`;
        }

        const data = await fetchJsonSafe(
            apiUrl(`/absensi/rekap?tanggal=${encodeURIComponent(tanggal)}&kelas_id=${encodeURIComponent(kelas_id)}`),
            { headers: getAuthHeaders() }
        );

        tampilAbsensi(data);
        await loadSummary();
    } catch (err) {
        console.error(err);
        if (list) list.innerHTML = "<p>Gagal memuat data absensi.</p>";
        resetSummary();
        showToast(err.message || "Gagal ambil rekap harian", "error");
    }
};

function tampilAbsensi(data) {
    const list = document.getElementById("list-absensi");
    if (!list) return;

    if (!data.length) {
        list.innerHTML = "<p>Tidak ada data</p>";
        return;
    }

    let html = `
    <div class="absensi-toolbar-top" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
        <div class="absensi-toolbar-left">
            <strong>Input absensi siswa per hari</strong>
        </div>
        <div class="absensi-toolbar-right">
            <button class="absensi-action-btn" onclick="simpanSemuaAbsensiGuru()">
                💾 Simpan Semua Absensi
            </button>
        </div>
    </div>

    <div class="absensi-table-card">
    <table class="absensi-table">
    <thead>
        <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Status Saat Ini</th>
            <th>Input Status</th>
            <th>Keterangan</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
    `;

    data.forEach((s, i) => {
        const badge =
            s.status === "hadir" ? `<span class="absensi-badge hadir">Hadir</span>` :
            s.status === "izin" ? `<span class="absensi-badge izin">Izin</span>` :
            s.status === "sakit" ? `<span class="absensi-badge sakit">Sakit</span>` :
            s.status === "alpha" ? `<span class="absensi-badge alpha">Alpha</span>` :
            `<span class="absensi-badge kosong">Belum Diisi</span>`;

        html += `
        <tr>
            <td>${i + 1}</td>
            <td>
                <div class="absensi-student-cell">
                    <strong>${escapeHtml(s.nama)}</strong>
                    <small>NIS: ${escapeHtml(s.nis || "-")}</small>
                </div>
            </td>
            <td>${badge}</td>
            <td>
                <select id="abs-${s.siswa_id}" class="absensi-select">
                    <option value="">-</option>
                    <option value="hadir" ${s.status === "hadir" ? "selected" : ""}>Hadir</option>
                    <option value="izin" ${s.status === "izin" ? "selected" : ""}>Izin</option>
                    <option value="sakit" ${s.status === "sakit" ? "selected" : ""}>Sakit</option>
                    <option value="alpha" ${s.status === "alpha" ? "selected" : ""}>Alpha</option>
                </select>
            </td>
            <td>
                <textarea id="ket-${s.siswa_id}" class="absensi-keterangan" placeholder="Keterangan">${escapeHtml(s.keterangan || "")}</textarea>
            </td>
            <td>
                <span class="absensi-row-info">Masuk ke simpan semua</span>
            </td>
        </tr>`;
    });

    html += `
        </tbody>
        </table>
        </div>
    `;

    list.innerHTML = html;
}

// ================= SIMPAN HARIAN =================
window.simpanAbsensi = async function (siswa_id) {
    const status = document.getElementById(`abs-${siswa_id}`)?.value || "";
    const tanggal = document.getElementById("tanggalAbsensi")?.value || "";
    const keterangan = document.getElementById(`ket-${siswa_id}`)?.value?.trim() || "";

    if (!status) return showToast("Pilih status", "error");
    if (!tanggal) return showToast("Tanggal belum dipilih", "error");

    try {
        const result = await fetchJsonSafe(apiUrl("/absensi"), {
            method: "POST",
            headers: getAuthHeaders(true),
            body: JSON.stringify({ siswa_id, tanggal, status, keterangan })
        });

        showToast(result.message || "Tersimpan");
        await loadRekapAbsensiGuru();
        await loadGrafikAbsensiGuru();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal simpan absensi", "error");
    }
};

window.simpanSemuaAbsensiGuru = async function () {
    const tanggal = document.getElementById("tanggalAbsensi")?.value || "";
    const selects = document.querySelectorAll('[id^="abs-"]');

    if (!tanggal) return showToast("Tanggal belum dipilih", "error");
    if (!selects.length) return showToast("Belum ada data absensi", "error");

    let totalDiproses = 0;

    try {
        for (const el of selects) {
            const siswa_id = el.id.replace("abs-", "");
            const status = el.value;
            const keterangan = document.getElementById(`ket-${siswa_id}`)?.value?.trim() || "";

            if (!status) continue;

            await fetchJsonSafe(apiUrl("/absensi"), {
                method: "POST",
                headers: getAuthHeaders(true),
                body: JSON.stringify({
                    siswa_id,
                    tanggal,
                    status,
                    keterangan
                })
            });

            totalDiproses++;
        }

        if (totalDiproses === 0) {
            return showToast("Belum ada status yang dipilih", "error");
        }

        showToast(`Absensi berhasil disimpan (${totalDiproses} siswa)`);
        await loadRekapAbsensiGuru();
        await loadGrafikAbsensiGuru();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal simpan semua absensi", "error");
    }
};

window.setSemuaStatus = function (status) {
    document.querySelectorAll('[id^="abs-"]').forEach(el => {
        el.value = status;
    });
};

// ================= RIWAYAT =================
window.lihatRiwayat = async function (id) {
    try {
        const data = await fetchJsonSafe(apiUrl(`/absensi/riwayat/${id}`), {
            headers: getAuthHeaders()
        });

        if (!data.length) {
            showToast("Belum ada riwayat absensi siswa ini", "error");
            return;
        }

        let txt = "Riwayat Absensi:\n\n";
        data.forEach(r => {
            txt += `${formatTanggalIndonesia(r.tanggal)} - ${String(r.status || "").toUpperCase()}${r.keterangan ? " (" + r.keterangan + ")" : ""}\n`;
        });

        alert(txt);
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal ambil riwayat", "error");
    }
};

// ================= REKAP BULANAN =================
window.loadBulananGuru = async function () {
    const kelas_id = document.getElementById("kelasAbsensi")?.value || "";
    const bulan = document.getElementById("bulanRekapGuru")?.value || "";
    const tahun = document.getElementById("tahunRekapGuru")?.value || "";
    const wrap = document.getElementById("rekapBulananGuruWrap");

    if (!kelas_id || !bulan || !tahun) {
        if (wrap) wrap.innerHTML = "<p>Pilih kelas, bulan, dan tahun.</p>";
        return;
    }

    try {
        if (wrap) wrap.innerHTML = "<p>Memuat rekap bulanan...</p>";

        const url = apiUrl(`/absensi/bulanan?kelas_id=${encodeURIComponent(kelas_id)}&bulan=${encodeURIComponent(bulan)}&tahun=${encodeURIComponent(tahun)}`);
        console.log("LOAD BULANAN URL:", url);

        const result = await fetchJsonSafe(url, {
            headers: getAuthHeaders()
        });

        dataBulananGuru = Array.isArray(result.data) ? result.data : [];
        renderBulananGuru(result);
    } catch (err) {
        console.error("ERROR loadBulananGuru:", err);
        dataBulananGuru = [];
        if (wrap) wrap.innerHTML = `<p>${err.message}</p>`;
        showToast(err.message || "Gagal ambil rekap bulanan", "error");
    }
};

function renderBulananGuru(result) {
    const wrap = document.getElementById("rekapBulananGuruWrap");
    const printInfo = document.getElementById("printInfoBulananGuru");
    if (!wrap) return;

    const kelasDipilih = dataKelas.find(k => String(k.id) === String(result.kelas_id));
    const summary = result.summary || {};
    const namaKelas = kelasDipilih ? kelasDipilih.nama_kelas : "-";
    const periodeLabel = `${getNamaBulan(result.bulan)} ${result.tahun}`;

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
                <td class="td-left">${escapeHtml(item.nama)}</td>
                <td>${escapeHtml(item.nis || "-")}</td>
                <td><span class="bulanan-badge hadir">${hadir}</span></td>
                <td><span class="bulanan-badge izin">${izin}</span></td>
                <td><span class="bulanan-badge sakit">${sakit}</span></td>
                <td><span class="bulanan-badge alpha">${alpha}</span></td>
                <td>${total}</td>
                <td>${persen}</td>
            </tr>
        `;
    }).join("");

    wrap.innerHTML = `
        <div class="bulanan-layout-fix">
            <div class="bulanan-header-card">
                <div>
                    <h3>Rekap Bulanan ${periodeLabel}</h3>
                    <p>Kelas: <strong>${escapeHtml(namaKelas)}</strong></p>
                </div>
                <div class="bulanan-header-meta">Total Siswa: ${summary.total_siswa || 0}</div>
            </div>

            <div class="bulanan-summary-grid premium">
                <div class="bulanan-mini-card total">
                    <strong>${summary.total_siswa || 0}</strong>
                    <span>Total Siswa</span>
                </div>
                <div class="bulanan-mini-card hadir">
                    <strong>${summary.hadir || 0}</strong>
                    <span>Total Hadir</span>
                </div>
                <div class="bulanan-mini-card izin">
                    <strong>${summary.izin || 0}</strong>
                    <span>Total Izin</span>
                </div>
                <div class="bulanan-mini-card sakit">
                    <strong>${summary.sakit || 0}</strong>
                    <span>Total Sakit</span>
                </div>
                <div class="bulanan-mini-card alpha">
                    <strong>${summary.alpha || 0}</strong>
                    <span>Total Alpha</span>
                </div>
            </div>

            <div class="bulanan-table-wrap">
                <table class="bulanan-table-premium">
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

window.exportBulananGuruPDF = async function () {
    if (!dataBulananGuru.length) {
        showToast("Belum ada data rekap bulanan untuk diexport", "error");
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast("Library PDF belum termuat", "error");
        return;
    }

    try {
        const { jsPDF } = window.jspdf;

        const bulan = document.getElementById("bulanRekapGuru")?.value || "";
        const tahun = document.getElementById("tahunRekapGuru")?.value || "";
        const kelas_id = document.getElementById("kelasAbsensi")?.value || "";
        const kelasDipilih = dataKelas.find(k => String(k.id) === String(kelas_id));
        const namaKelas = kelasDipilih ? kelasDipilih.nama_kelas : "Kelas";
        const periode = `${getNamaBulan(bulan)} ${tahun}`;

        const namaWaliKelas =
            document.getElementById("ttdWaliKelas")?.value?.trim() ||
            localStorage.getItem("nama") ||
            "Wali Kelas";

        const namaKepalaSekolah =
            document.getElementById("ttdKepalaSekolah")?.value?.trim() ||
            "Kepala Sekolah";

        const totalSiswa = dataBulananGuru.length;
        const totalHadir = dataBulananGuru.reduce((n, x) => n + Number(x.hadir || 0), 0);
        const totalIzin = dataBulananGuru.reduce((n, x) => n + Number(x.izin || 0), 0);
        const totalSakit = dataBulananGuru.reduce((n, x) => n + Number(x.sakit || 0), 0);
        const totalAlpha = dataBulananGuru.reduce((n, x) => n + Number(x.alpha || 0), 0);

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        let logoDataUrl = null;
        try {
            logoDataUrl = await loadImageAsDataURL("img/logo.png");
        } catch (e) {
            console.warn("Logo tidak dimuat:", e.message);
        }

        if (logoDataUrl) {
            doc.addImage(logoDataUrl, "PNG", 14, 10, 18, 18);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("SD HARAPAN", 40, 16);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Laporan Rekap Absensi Bulanan Siswa", 40, 22);
        doc.text("Tahun Ajaran " + tahun, 40, 27);

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

        const bodyRows = dataBulananGuru.map((item, index) => {
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

        const finalY = doc.lastAutoTable.finalY || 90;
        const tandaTanganY = Math.min(finalY + 18, pageHeight - 45);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        doc.text("Mengetahui,", 30, tandaTanganY);
        doc.text("Mengetahui,", pageWidth - 80, tandaTanganY);

        doc.text("Wali Kelas", 30, tandaTanganY + 6);
        doc.text("Kepala Sekolah", pageWidth - 80, tandaTanganY + 6);

        doc.line(30, tandaTanganY + 30, 80, tandaTanganY + 30);
        doc.line(pageWidth - 80, tandaTanganY + 30, pageWidth - 30, tandaTanganY + 30);

        doc.setFont("helvetica", "bold");
        doc.text(namaWaliKelas, 55, tandaTanganY + 35, { align: "center" });
        doc.text(namaKepalaSekolah, pageWidth - 55, tandaTanganY + 35, { align: "center" });

        const namaFile = `rekap-bulanan-${namaKelas}-${getNamaBulan(bulan)}-${tahun}.pdf`
            .replace(/\s+/g, "-");

        doc.save(namaFile);
        showToast("Export PDF berhasil");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal export PDF", "error");
    }
};

// ================= GRAFIK DASHBOARD =================
async function loadGrafikAbsensiGuru() {
    const canvas = document.getElementById("grafikAbsensiGuru");
    if (!canvas || typeof Chart === "undefined") return;

    const kelas_id = document.getElementById("kelasAbsensi")?.value || (dataKelas[0] ? dataKelas[0].id : "");
    const now = new Date();
    const bulan = now.getMonth() + 1;
    const tahun = now.getFullYear();

    if (!kelas_id) return;

    try {
        const result = await fetchJsonSafe(
            apiUrl(`/absensi/bulanan?kelas_id=${encodeURIComponent(kelas_id)}&bulan=${encodeURIComponent(bulan)}&tahun=${encodeURIComponent(tahun)}`),
            { headers: getAuthHeaders() }
        );

        const summary = result.summary || {};
        const ctx = canvas.getContext("2d");

        if (grafikAbsensiInstance) {
            grafikAbsensiInstance.destroy();
        }

        grafikAbsensiInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Hadir", "Izin", "Sakit", "Alpha"],
                datasets: [{
                    label: `Absensi ${getNamaBulan(bulan)} ${tahun}`,
                    data: [
                        summary.hadir || 0,
                        summary.izin || 0,
                        summary.sakit || 0,
                        summary.alpha || 0
                    ],
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
}

// ================= PRINT =================
window.printAreaAbsensi = function () {
    const tanggal = document.getElementById("tanggalAbsensi")?.value || "-";
    const kelas_id = document.getElementById("kelasAbsensi")?.value || "";
    const kelasDipilih = dataKelas.find(k => String(k.id) === String(kelas_id));
    const printInfo = document.getElementById("printInfoAbsensi");

    if (printInfo) {
        printInfo.textContent = `Kelas: ${kelasDipilih ? kelasDipilih.nama_kelas : "-"} | Tanggal: ${formatTanggalIndonesia(tanggal)}`;
    }

    window.print();
};

window.printBulananGuru = function () {
    const bulan = document.getElementById("bulanRekapGuru")?.value || "";
    const tahun = document.getElementById("tahunRekapGuru")?.value || "";
    const kelas_id = document.getElementById("kelasAbsensi")?.value || "";
    const kelasDipilih = dataKelas.find(k => String(k.id) === String(kelas_id));
    const printInfo = document.getElementById("printInfoBulananGuru");

    if (printInfo) {
        printInfo.textContent = `Kelas: ${kelasDipilih ? kelasDipilih.nama_kelas : "-"} | Periode: ${getNamaBulan(bulan)} ${tahun}`;
    }

    document.body.classList.add("print-bulanan-mode");
    window.print();
    setTimeout(() => {
        document.body.classList.remove("print-bulanan-mode");
    }, 500);
};

// ================= PROFIL =================
async function loadProfilGuru() {
    try {
        const data = await fetchJsonSafe(apiUrl("/profile"), {
            headers: getAuthHeaders()
        });

        if (document.getElementById("profilNamaGuru")) {
            document.getElementById("profilNamaGuru").value = data.nama || "";
        }
        if (document.getElementById("profilUsernameGuru")) {
            document.getElementById("profilUsernameGuru").value = data.username || "";
        }
        if (document.getElementById("profilRoleGuru")) {
            document.getElementById("profilRoleGuru").value = data.role || "";
        }

        localStorage.setItem("nama", data.nama || "Guru");
        localStorage.setItem("role", data.role || "guru");
        updateDashboardInfo();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal ambil profil guru", "error");
    }
}

window.updateProfilGuru = async function () {
    const nama = document.getElementById("profilNamaGuru")?.value?.trim() || "";

    if (!nama) {
        showToast("Nama wajib diisi", "error");
        return;
    }

    try {
        const result = await fetchJsonSafe(apiUrl("/profile"), {
            method: "PUT",
            headers: getAuthHeaders(true),
            body: JSON.stringify({ nama })
        });

        localStorage.setItem("nama", nama);
        updateDashboardInfo();
        showToast(result.message || "Profil berhasil diupdate");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal update profil", "error");
    }
};

window.gantiPasswordGuru = async function () {
    const passwordLama = document.getElementById("passwordLamaGuru")?.value?.trim() || "";
    const passwordBaru = document.getElementById("passwordBaruGuru")?.value?.trim() || "";

    if (!passwordLama || !passwordBaru) {
        showToast("Password lama dan baru wajib diisi", "error");
        return;
    }

    try {
        const result = await fetchJsonSafe(apiUrl("/profile/change-password"), {
            method: "PUT",
            headers: getAuthHeaders(true),
            body: JSON.stringify({ passwordLama, passwordBaru })
        });

        document.getElementById("passwordLamaGuru").value = "";
        document.getElementById("passwordBaruGuru").value = "";
        showToast(result.message || "Password berhasil diganti");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal ganti password", "error");
    }
};

// ================= LOGOUT =================
window.logout = function () {
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("nama");
    localStorage.removeItem("role");
    localStorage.removeItem("guruTab");
    location.href = "login.html";
};

// ================= INIT =================

window.onload = async () => {
    restoreTab();

    const tanggal = document.getElementById("tanggalAbsensi");
    if (tanggal) tanggal.value = getToday();

    setDefaultBulanTahun();

    await loadKelas();
    await loadSiswa();
    await loadProfilGuru();
    await loadGrafikAbsensiGuru();

    const ttdWaliKelas = document.getElementById("ttdWaliKelas");
    if (ttdWaliKelas && !ttdWaliKelas.value) {
        ttdWaliKelas.value = localStorage.getItem("nama") || "Guru / Wali Kelas";
    }
};