const API_URL = "http://localhost:3000/api";
const formulario = document.getElementById("form-evento");
const selectPalestrante = document.getElementById("palestrante");
const titulo = document.getElementById("titulo-formulario");
const parametros = new URLSearchParams(window.location.search);
const idEvento = parametros.get("id");

async function iniciar() {
    await carregarPalestrantes();

    if (idEvento) {
        await carregarEventoParaEdicao(idEvento);
    }
}

async function carregarPalestrantes() {
    try {
        const resposta = await fetch(`${API_URL}/palestrantes`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar palestrantes.");
        }

        const palestrantes = await resposta.json();

        // Sem palestrante cadastrado não dá para criar evento
        if (palestrantes.length === 0) {
            selectPalestrante.innerHTML = `
                <option value="">Nenhum palestrante cadastrado</option>
            `;
            alert("Cadastre um palestrante antes de criar um evento.");
            window.location.href = "cadastro-palestrante.html";
            return;
        }

        selectPalestrante.innerHTML = `
            <option value="">Selecione um palestrante</option>
        `;

        palestrantes.forEach(palestrante => {
            const option = document.createElement("option");
            option.value = palestrante.id;
            option.textContent = palestrante.nome;
            selectPalestrante.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar os palestrantes.");
    }
}

async function carregarEventoParaEdicao(id) {
    try {
        const resposta = await fetch(`${API_URL}/eventos/${id}`);

        if (!resposta.ok) {
            throw new Error("Evento não encontrado.");
        }

        const evento = await resposta.json();

        document.getElementById("nome").value = evento.nome;
        document.getElementById("descricao").value = evento.descricao;
        document.getElementById("local").value = evento.local;

        if (evento.data) {
            const data = new Date(evento.data);
            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, "0");
            const dia = String(data.getDate()).padStart(2, "0");
            const horas = String(data.getHours()).padStart(2, "0");
            const minutos = String(data.getMinutes()).padStart(2, "0");

            document.getElementById("data").value = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
        }

        if (evento.palestranteId) {
            selectPalestrante.value = evento.palestranteId;
        }

        titulo.textContent = "Editar evento";
    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar o evento.");
    }
}

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const local = document.getElementById("local").value.trim();
    const data = document.getElementById("data").value;
    const palestranteId = selectPalestrante.value;

    if (!nome || !descricao || !local || !data || !palestranteId) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    try {
        let resposta;

        const dados = {
            nome: nome,
            descricao: descricao,
            local: local,
            data: new Date(data).toISOString(),
            palestranteId: Number(palestranteId)
        };

        if (idEvento) {
            resposta = await fetch(`${API_URL}/eventos/${idEvento}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });
        } else {
            resposta = await fetch(`${API_URL}/eventos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });
        }

        // Obs.: seu backend, quando dá erro, nem sempre responde em JSON.
        // Por isso só conferimos se deu certo, sem ler a resposta.
        if (!resposta.ok) {
            alert("Erro ao salvar evento.");
            return;
        }

        alert("cadastro concluído com sucesso");
        window.location.href = "index.html";
    } catch (error) {
        console.error(error);
        alert("Não foi possível conectar com a API.");
    }
});

iniciar();
