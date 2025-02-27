let token = "";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.token) {
        token = data.token;
        document.getElementById("login").style.display = "none";
        document.getElementById("taskSection").style.display = "block";
        fetchTasks();
    } else {
        alert("Login falhou");
    }
}

async function fetchTasks() {
    try {
        const response = await fetch("http://localhost:3000/tasks", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("Tarefas recebidas:", data); // Verifica o retorno da API

        const tasks = data.tasks || data; // Corrige o acesso ao array

        const taskList = document.getElementById("taskList");
        taskList.innerHTML = ""; // Limpa a lista antes de adicionar as tarefas

        if (!Array.isArray(tasks)) {
            console.error("Erro: API não retornou um array", data);
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task.title;

            const btn = document.createElement("button");
            btn.textContent = "Excluir";
            btn.classList.add("delete-btn");
            btn.onclick = () => deleteTask(task._id);

            li.appendChild(btn);
            taskList.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
    }
}



// async function fetchTasks() {
//     const response = await fetch("http://localhost:3000/tasks", {
//         headers: { "Authorization": `Bearer ${token}` }
//     });
//     const tasks = await response.json();
//     const taskList = document.getElementById("taskList");
//     taskList.innerHTML = "";
//     tasks.forEach(task => {
//         const li = document.createElement("li");
//         li.textContent = task.title;
//         const btn = document.createElement("button");
//         btn.textContent = "Excluir";
//         btn.classList.add("delete-btn");
//         btn.onclick = () => deleteTask(task._id);
//         li.appendChild(btn);
//         taskList.appendChild(li);
//     });
// }

async function addTask() {
    const title = document.getElementById("taskTitle").value;
    await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title })
    });
    fetchTasks();
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao excluir tarefa");
        }

        console.log(`Tarefa ${taskId} excluída.`);
        fetchTasks(); // Atualiza a lista após exclusão
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error.message);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fetchTasks(); // Carrega as tarefas automaticamente
});

