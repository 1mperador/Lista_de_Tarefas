async function loadProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado.");
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/auth/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Envia o token
            }
        });

        if (!response.ok) {
            throw new Error("Falha ao carregar perfil");
        }

        const user = await response.json();
        document.getElementById("name").textContent = user.name;
        document.getElementById("email").textContent = user.email;
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        alert("Erro ao carregar perfil. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
}
