const PPDB_BASE_URL = "http://localhost:3000";

// ================= HELPER =================
function ppdbEscapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPpdbAlert(message, type = "success") {
  return `
    <div style="
      padding:16px;
      border-radius:12px;
      border:1px solid ${type === "error" ? "#fecaca" : "#bbf7d0"};
      background:${type === "error" ? "#fef2f2" : "#ecfdf5"};
      color:${type === "error" ? "#b91c1c" : "#166534"};
      line-height:1.6;
    ">
      ${message}
    </div>
  `;
}

// ================= KIRIM PPDB =================
window.kirimPPDB = async function (event) {
  if (event) event.preventDefault();

  const hasil = document.getElementById("hasilPPDB");
  const btn = document.getElementById("btnKirimPPDB");

  // ambil data
  const nama_lengkap = document.getElementById("ppdbNama")?.value.trim() || "";
  const jenis_kelamin = document.getElementById("ppdbJenisKelamin")?.value || "";
  const alamat = document.getElementById("ppdbAlamat")?.value.trim() || "";
  const no_hp = document.getElementById("ppdbNoHp")?.value.trim() || "";

  if (!nama_lengkap || !jenis_kelamin || !alamat || !no_hp) {
    if (hasil) {
      hasil.innerHTML = renderPpdbAlert("Data wajib belum lengkap!", "error");
    }
    return;
  }

  const formData = new FormData();

  formData.append("nama_lengkap", nama_lengkap);
  formData.append("jenis_kelamin", jenis_kelamin);
  formData.append("tempat_lahir", document.getElementById("ppdbTempatLahir")?.value || "");
  formData.append("tanggal_lahir", document.getElementById("ppdbTanggalLahir")?.value || "");
  formData.append("nisn", document.getElementById("ppdbNisn")?.value || "");
  formData.append("agama", document.getElementById("ppdbAgama")?.value || "");
  formData.append("alamat", alamat);
  formData.append("nama_ayah", document.getElementById("ppdbNamaAyah")?.value || "");
  formData.append("nama_ibu", document.getElementById("ppdbNamaIbu")?.value || "");
  formData.append("no_hp", no_hp);
  formData.append("email", document.getElementById("ppdbEmail")?.value || "");
  formData.append("asal_sekolah", document.getElementById("ppdbAsalSekolah")?.value || "");
  formData.append("pilihan_kelas", document.getElementById("ppdbPilihanKelas")?.value || "");

  // file
  const akta = document.getElementById("ppdbAkta")?.files[0];
  const kk = document.getElementById("ppdbKK")?.files[0];
  const foto = document.getElementById("ppdbFoto")?.files[0];
  const ijazah = document.getElementById("ppdbIjazah")?.files[0];

  if (akta) formData.append("akta_file", akta);
  if (kk) formData.append("kk_file", kk);
  if (foto) formData.append("foto_file", foto);
  if (ijazah) formData.append("ijazah_file", ijazah);

  try {
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Mengirim...";
    }

    const res = await fetch(`${PPDB_BASE_URL}/ppdb`, {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    console.log("Response PPDB:", result);

    if (!res.ok) {
      throw new Error(result.message || "Gagal kirim");
    }

    // simpan ke localStorage
    localStorage.setItem("ppdb_terakhir", JSON.stringify({
      no: result.no_pendaftaran,
      status: result.status,
      nama: nama_lengkap
    }));

    // tampilkan hasil
    if (hasil) {
     hasil.innerHTML = `
    <div style="
        background:#ecfdf5;
        padding:18px;
        border-radius:14px;
        border:1px solid #bbf7d0;
        text-align:center;
    ">
        <h2 style="color:#16a34a;">✅ Pendaftaran Berhasil</h2>

        <p style="margin-top:10px;">Nomor Pendaftaran Anda:</p>
        <h1 style="color:#16a34a;">${ppdbEscapeHtml(result.no_pendaftaran)}</h1>
        <button onclick="copyNoPPDB('${result.no_pendaftaran}')">
    📋 Copy Nomor
</button>

        <p>Status: <b>${ppdbEscapeHtml(result.status)}</b></p>

        <p style="
            margin-top:12px;
            font-size:13px;
            color:#b45309;
            background:#fff7ed;
            padding:10px;
            border-radius:10px;
        ">
            ⚠️ Simpan nomor pendaftaran ini untuk cek status pendaftaran Anda.
        </p>
    </div>
`;
    }

  } catch (err) {
    console.error(err);

    if (hasil) {
      hasil.innerHTML = renderPpdbAlert(err.message, "error");
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Kirim Pendaftaran";
    }
  }
};

// ================= CEK STATUS =================
window.cekStatusPPDB = async function (event) {
  if (event) event.preventDefault();

  const no = document.getElementById("cekNoPendaftaran")?.value.trim() || "";
  const hasil = document.getElementById("hasilCekPPDB");
  const actionBox = document.getElementById("ppdbActionButtons");

  if (!no) {
    if (hasil) hasil.innerHTML = renderPpdbAlert("Nomor pendaftaran wajib diisi.", "error");
    if (actionBox) actionBox.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(`${PPDB_BASE_URL}/ppdb/check/${encodeURIComponent(no)}`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Data tidak ditemukan");
    }

    if (hasil) {
      hasil.innerHTML = `
        <div class="ppdb-status-card">
          <h3>${ppdbEscapeHtml(result.nama_lengkap || "-")}</h3>
          <p><strong>No Pendaftaran:</strong> ${ppdbEscapeHtml(result.no_pendaftaran || "-")}</p>
          <p><strong>Asal Sekolah:</strong> ${ppdbEscapeHtml(result.asal_sekolah || "-")}</p>
          <p><strong>Pilihan Kelas:</strong> ${ppdbEscapeHtml(result.pilihan_kelas || "-")}</p>
          <p><strong>Status:</strong> <span class="badge-soft-blue">${ppdbEscapeHtml(result.status || "-")}</span></p>
          <p><strong>Catatan Admin:</strong> ${ppdbEscapeHtml(result.catatan_admin || "-")}</p>
        </div>
      `;
    }

    if (actionBox) {
      if (String(result.status || "").toLowerCase() === "diterima") {
        actionBox.innerHTML = `
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="button" class="btn-secondary" onclick="downloadBuktiPPDB(event)">Download Bukti PDF</button>
            <button type="button" class="btn-secondary" onclick="cetakKartuPesertaPPDB(event)">Cetak Kartu Peserta</button>
          </div>
        `;
      } else {
        actionBox.innerHTML = "";
      }
    }
  } catch (err) {
    if (hasil) hasil.innerHTML = renderPpdbAlert(ppdbEscapeHtml(err.message), "error");
    if (actionBox) actionBox.innerHTML = "";
  }
};
window.downloadBuktiPPDB = async function (event) {
  if (event) event.preventDefault();

  const no = document.getElementById("cekNoPendaftaran")?.value.trim() || "";
  const hasil = document.getElementById("hasilCekPPDB");

  if (!no) {
    if (hasil) hasil.innerHTML = renderPpdbAlert("Masukkan nomor pendaftaran terlebih dahulu.", "error");
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    if (hasil) hasil.innerHTML = renderPpdbAlert("Library PDF belum termuat.", "error");
    return;
  }

  try {
    const res = await fetch(`${PPDB_BASE_URL}/ppdb/check/${encodeURIComponent(no)}`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Data tidak ditemukan");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SD HARAPAN SUNGAILIAT", pageWidth / 2, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Bukti Pendaftaran PPDB Online", pageWidth / 2, 25, { align: "center" });

    doc.setDrawColor(29, 78, 216);
    doc.setLineWidth(0.8);
    doc.line(20, 30, pageWidth - 20, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DATA PENDAFTAR", 20, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    let y = 52;
    const row = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(`: ${value || "-"}`, 72, y);
      y += 8;
    };

    row("No Pendaftaran", result.no_pendaftaran || "-");
    row("Nama Lengkap", result.nama_lengkap || "-");
    row("Asal Sekolah", result.asal_sekolah || "-");
    row("Pilihan Kelas", result.pilihan_kelas || "-");
    row("Status", result.status || "-");
    row("Catatan Admin", result.catatan_admin || "-");
    row("Tanggal Cetak", new Date().toLocaleDateString("id-ID"));

    y += 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(
      "Simpan bukti pendaftaran ini dan gunakan nomor pendaftaran untuk cek status secara berkala.",
      20,
      y,
      { maxWidth: pageWidth - 40 }
    );

    y += 28;
    doc.setFont("helvetica", "normal");
    doc.text("Admin PPDB", pageWidth - 50, y);
    y += 20;
    doc.text("__________________", pageWidth - 60, y);

    const fileName = `bukti-ppdb-${String(result.no_pendaftaran || "pendaftar").replace(/\s+/g, "-")}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error(err);
    if (hasil) hasil.innerHTML = renderPpdbAlert(ppdbEscapeHtml(err.message), "error");
  }
};

window.cetakKartuPesertaPPDB = async function (event) {
  if (event) event.preventDefault();

  const no = document.getElementById("cekNoPendaftaran")?.value.trim() || "";
  const hasil = document.getElementById("hasilCekPPDB");

  if (!no) {
    if (hasil) {
      hasil.innerHTML = renderPpdbAlert("Masukkan nomor pendaftaran terlebih dahulu.", "error");
    }
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    if (hasil) {
      hasil.innerHTML = renderPpdbAlert("Library PDF belum termuat.", "error");
    }
    return;
  }

  try {
    const res = await fetch(`${PPDB_BASE_URL}/ppdb/check/${encodeURIComponent(no)}`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Data tidak ditemukan");
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [90, 140]
    });

    const pageWidth = 140;
    const pageHeight = 90;

    // Background card
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(4, 4, pageWidth - 8, pageHeight - 8, 6, 6, "F");

    // Header
    doc.setFillColor(29, 78, 216);
    doc.roundedRect(4, 4, pageWidth - 8, 22, 6, 6, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("KARTU PESERTA PPDB", 10, 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("SD HARAPAN SUNGAILIAT", 10, 19);

    // Body
    doc.setTextColor(15, 23, 42);

    // Photo placeholder
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 30, 28, 36, 3, 3, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("FOTO", 24, 49, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    let y = 34;
    const left = 44;

    const row = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, left, y);
      doc.setFont("helvetica", "normal");
      doc.text(`: ${value || "-"}`, left + 25, y);
      y += 7;
    };

    row("No Peserta", result.no_pendaftaran || "-");
    row("Nama", result.nama_lengkap || "-");
    row("Asal Sekolah", result.asal_sekolah || "-");
    row("Pilihan Kelas", result.pilihan_kelas || "-");
    row("Status", result.status || "-");

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(10, 72, pageWidth - 10, 72);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.text("Bawa kartu ini saat proses verifikasi / daftar ulang.", 10, 78);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - 10, 78, {
      align: "right"
    });

    const fileName = `kartu-peserta-${String(result.no_pendaftaran || "ppdb").replace(/\s+/g, "-")}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error(err);
    if (hasil) {
      hasil.innerHTML = renderPpdbAlert(ppdbEscapeHtml(err.message), "error");
    }
  }
};

window.copyNoPPDB = function (no) {
    navigator.clipboard.writeText(no);
    alert("Nomor pendaftaran berhasil disalin!");
};

// ================= AUTO LOAD TERAKHIR =================
window.addEventListener("DOMContentLoaded", () => {
  const hasil = document.getElementById("hasilPPDB");
  const saved = localStorage.getItem("ppdb_terakhir");

  if (hasil && saved) {
    try {
      const data = JSON.parse(saved);

      hasil.innerHTML = `
        <div style="
          background:#ecfdf5;
          padding:16px;
          border-radius:12px;
          border:1px solid #bbf7d0;
        ">
          <strong>Pendaftaran terakhir:</strong><br>
          Nomor: <b>${ppdbEscapeHtml(data.no)}</b><br>
          Status: <b>${ppdbEscapeHtml(data.status)}</b>
        </div>
      `;
    } catch {}
  }
});