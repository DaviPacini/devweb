function baterPonto() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];

    // Obter o estado das checkboxes
    const dataAnteriorCheckbox = document.getElementById("checkboxDataAnterior").checked;
    const justificativaCheckbox = document.getElementById("checkboxJustificativa").checked;

    // Criar novo registro com a data e hora atuais
    const novoRegistro = {
        id: Date.now(),
        data: new Date().toLocaleDateString("pt-BR"), // Data no formato DD/MM/YYYY
        hora: new Date().toLocaleTimeString("pt-BR"), // Hora no formato HH:MM:SS
        tipo: "Bateu ponto", // Exemplo de tipo
        localizacao: { latitude: 0, longitude: 0 }, // Preencha conforme necessário
        modificado: justificativaCheckbox, // Marcar como modificado se justificativa estiver marcada
        dataPassada: dataAnteriorCheckbox // Marcar como data anterior se checkbox estiver marcada
    };

    // Salvar o novo registro no array
    registros.push(novoRegistro);
    localStorage.setItem("register", JSON.stringify(registros));

    renderList(); // Atualizar a lista com o novo registro
}

function renderList() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registrosContainer = document.getElementById('registros-relatorio');
    registrosContainer.innerHTML = ''; // Limpa o container

    if (registros.length === 0) {
        registrosContainer.innerHTML = '<p>Nenhum registro encontrado.</p>';
        return;
    }

    // Renderizando os registros
    registros.forEach(register => {
        const divRegistro = document.createElement("div");
        divRegistro.innerHTML = `
            <p>${register.data} - ${register.hora} | ${register.tipo} |
            Lat: ${register.localizacao.latitude}, Lon: ${register.localizacao.longitude}</p>
            <button onclick="editRegister(${register.id})">Editar</button>
            <button onclick="editJustification(${register.id})">Modificar Justificativa</button>
            <button onclick="alert('Esse registro não pode ser excluído!')">Excluir</button>
        `;

        // Limpar classes anteriores antes de aplicar novas classes
        divRegistro.className = "";  // Remove todas as classes

        // Definindo a cor com base nos valores de `dataPassada` e `modificado`
        if (register.modificado) {
            divRegistro.classList.add("text-red"); // Registro com justificativa (vermelho)
        } else if (register.dataPassada) {
            divRegistro.classList.add("text-yellow"); // Registro com data anterior (amarelo)
        } else {
            divRegistro.classList.add("text-white"); // Registro normal (branco)
        }

        registrosContainer.appendChild(divRegistro);
    });
}

function editRegister(id) {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registroIndex = registros.findIndex(r => r.id === id);

    if (registroIndex !== -1) {
        const newType = prompt("Editar tipo de registro:", registros[registroIndex].tipo);
        if (newType) {
            registros[registroIndex].tipo = newType;
            localStorage.setItem("register", JSON.stringify(registros));
            renderList();
        }
    } else {
        alert('Registro não encontrado!');
    }
}

function editJustification(id) {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registroIndex = registros.findIndex(r => r.id === id);

    if (registroIndex !== -1) {
        const newJustification = prompt("Modificar justificativa:", registros[registroIndex].justificativa || "");
        if (newJustification) {
            registros[registroIndex].justificativa = newJustification;
            registros[registroIndex].modificado = true;
            localStorage.setItem("register", JSON.stringify(registros));
            renderList();
        }
    } else {
        alert("Registro não encontrado!");
    }
}

// Inicializa a lista de registros
renderList();
