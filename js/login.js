function togglePassword() {
    const pass = document.getElementById("pass");
    const icon = document.querySelector(".toggle-pass");

    if (!pass) return;

    if (pass.type === "password") {
        pass.type = "text";
        if (icon) {
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    } else {
        pass.type = "password";
        if (icon) {
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }
}

// ================= CEK LOGIN SAAT HALAMAN DIBUKA =================
window.addEventListener("pageshow", function () {
    const isLogin = localStorage.getItem("login") === "true";
    const role = localStorage.getItem("role");

    if (isLogin && role === "guru") {
        window.location.href = "guru.html";
    } else if (isLogin && role === "admin") {
        window.location.href = "admin.html";
    }
});

// ================= LOGIN =================
async function login() {
    const userEl = document.getElementById("user");
    const passEl = document.getElementById("pass");
    const btn = document.getElementById("btnLogin");

    const u = userEl ? userEl.value.trim() : "";
    const p = passEl ? passEl.value.trim() : "";

    if (u === "" || p === "") {
        alert("Isi username dan password!");
        return;
    }

    if (btn) {
        btn.innerText = "Loading...";
        btn.classList.add("loading");
        btn.disabled = true;
    }

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: u,
                password: p
            })
        });

        const data = await res.json();

        if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("login", "true");
            localStorage.setItem("username", data.username || u);
            localStorage.setItem("nama", data.nama || data.username || u);
            localStorage.setItem("role", data.role || "");

            if (data.role === "guru") {
                window.location.href = "guru.html";
            } else {
                window.location.href = "admin.html";
            }
            return;
        }

        alert(data.message || "Username atau password salah!");
    } catch (err) {
        console.error("Login error:", err);
        alert("Server error!");
    } finally {
        if (btn) {
            btn.innerText = "Login";
            btn.classList.remove("loading");
            btn.disabled = false;
        }
    }
}

// ================= ENTER KEY SUPPORT =================
window.addEventListener("DOMContentLoaded", function () {
    const userEl = document.getElementById("user");
    const passEl = document.getElementById("pass");

    if (userEl) {
        userEl.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                login();
            }
        });
    }

    if (passEl) {
        passEl.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                login();
            }
        });
    }
});