const API_URL = "http://localhost:3000/api";
const listaEventos = document.getElementById("lista-eventos");

carregarEventos();

async function carregarEventos() {
    try {
        const resposta = await fetch(`${API_URL}/eventos`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar eventos");
        }

        const eventos = await resposta.json();
        listaEventos.innerHTML = "";

        if (eventos.length === 0) {
            listaEventos.innerHTML = "<p>Nenhum evento cadastrado.</p>";
            return;
        }

        eventos.forEach(evento => {
            const card = criarCardEvento(evento);
            listaEventos.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        listaEventos.innerHTML = "<p>Erro ao carregar os eventos.</p>";
    }
}

function criarCardEvento(evento) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <p><strong>nome:</strong> ${evento.nome}</p>
        <p><strong>descrição:</strong> ${evento.descricao}</p>
        <p><strong>palestrante:</strong> ${evento.palestrante || "Sem palestrante"}</p>
        <p><strong>local:</strong> ${evento.local}</p>
        <div class="botoes">
            <button onclick="editarEvento(${evento.id})">Editar</button>
            <button onclick="excluirEvento(${evento.id})">Excluir</button>
        </div>
    `;

    return card;
}

function editarEvento(id) {
    window.location.href = `cadastro-evento.html?id=${id}`;
}

async function excluirEvento(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este evento?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/eventos/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            alert("Erro ao excluir evento.");
            return;
        }

        alert("Evento excluído com sucesso.");
        carregarEventos();
    } catch (error) {
        console.error(error);
        alert("Não foi possível conectar com a API.");
    }
}