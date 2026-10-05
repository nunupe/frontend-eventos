const API_URL = "http://localhost:3000/api";
const formulario = document.getElementById("form-palestrante");

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !email) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    if (!validarEmail(email)) {
        alert("Digite um e-mail válido.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/palestrantes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email
            })
        });

        // Obs.: seu backend, quando dá erro, nem sempre responde em JSON.
        // O erro mais comum aqui é e-mail repetido.
        if (!resposta.ok) {
            alert("Erro ao cadastrar palestrante. Esse e-mail já pode estar cadastrado.");
            return;
        }

        alert("cadastro concluído com sucesso");
        formulario.reset();
    } catch (error) {
        console.error(error);
        alert("Não foi possível conectar com a API.");
    }
});

function validarEmail(email) {
    const regra = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regra.test(email);
}