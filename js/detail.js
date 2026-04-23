function getDetailImage(gambar) {
    if (!gambar) {
        return "https://via.placeholder.com/1200x700?text=No+Image";
    }

    if (gambar.startsWith("http://") || gambar.startsWith("https://")) {
        return gambar;
    }

    return `http://localhost:3000/uploads/${gambar}`;
}

function renderEmpty(message = "Data berita tidak tersedia atau belum dipilih.") {
    const detail = document.getElementById("detail");
    if (!detail) return;

    detail.innerHTML = `
        <div class="detail-empty-state">
            <div class="detail-empty-card">
                <i class="fa fa-circle-exclamation"></i>
                <h2>Berita tidak ditemukan</h2>
                <p>${message}</p>
                <a href="berita.html" class="btn">Kembali ke Halaman Berita</a>
            </div>
        </div>
    `;
}

async function loadDetail() {
    const detail = document.getElementById("detail");
    if (!detail) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        renderEmpty("ID berita tidak ditemukan pada URL.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/berita/${id}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Berita tidak ditemukan");
        }

        detail.innerHTML = `
            <div class="detail-premium-hero">
                <div class="detail-premium-overlay"></div>
                <div class="detail-premium-wrap">
                    <a href="berita.html" class="btn detail-back premium-detail-back">
                        <i class="fa fa-arrow-left"></i> Kembali ke Berita
                    </a>

                    <div class="detail-header premium-detail-header">
                        <span class="detail-chip">${data.kategori || "Berita Sekolah"}</span>
                        <h1>${data.judul}</h1>
                        <p class="detail-date">
                            <i class="fa fa-calendar-days"></i> ${data.tanggal}
                        </p>
                    </div>
                </div>
            </div>

            <div class="detail-premium-content-area">
                <div class="detail-wrap premium-detail-wrap">
                    <div class="detail-image-box premium-detail-image-box">
                        <img src="${getDetailImage(data.gambar)}" alt="${data.judul}">
                    </div>

                    <div class="detail-content-box premium-detail-content-box">
                        <div class="detail-content-head">
                            <h2>Isi Berita</h2>
                            <span>SD Harapan Sungailiat</span>
                        </div>
                        <p>${data.isi || ""}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error(err);
        renderEmpty(err.message || "Gagal memuat detail berita.");
    }
}

loadDetail();