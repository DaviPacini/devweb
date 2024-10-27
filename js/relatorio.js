function baterPonto() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];

    const dataAnteriorCheckbox = document.getElementById("usar-data-passada").checked; 
    const justificativaCheckbox = document.getElementById("usar-observacao").checked; 

    let dataRegistro;
    if (dataAnteriorCheckbox) {
        dataRegistro = document.getElementById("data-ponto").value; 
        if (!dataRegistro) {
            alert("Por favor, selecione uma data.");
            return; 
        }
    } else {
        dataRegistro = new Date().toLocaleDateString("pt-BR"); 
    }

    // Variável para o comentário
    let comentario = "Nenhum comentário."; // Valor padrão

    // Solicita o comentário apenas se a checkbox estiver marcada
    if (justificativaCheckbox) {
        const userComment = prompt("Insira um comentário:"); // Pede ao usuário
        if (userComment && userComment.trim() !== "") {
            comentario = userComment; // Se houver um comentário, usa-o
        }
    }

    const novoRegistro = {
        id: Date.now(),
        data: dataRegistro, 
        hora: new Date().toLocaleTimeString("pt-BR"), 
        tipo: "Bateu ponto", 
        localizacao: { latitude: 0, longitude: 0 }, 
        modificado: justificativaCheckbox, 
        dataPassada: dataAnteriorCheckbox, 
        comentario: comentario // Armazena o comentário
    };

    registros.push(novoRegistro);
    localStorage.setItem("register", JSON.stringify(registros));
    renderList(); 
}

function renderList() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registrosContainer = document.getElementById('registros-relatorio');
    registrosContainer.innerHTML = ''; 

    if (registros.length === 0) {
        registrosContainer.innerHTML = '<p>Nenhum registro encontrado.</p>';
        return;
    }

    registros.forEach(register => {
        const divRegistro = document.createElement("div");

        let dataExibida;
        if (register.data.includes("-")) { 
            const [ano, mes, dia] = register.data.split("-");
            dataExibida = `${dia}/${mes}/${ano}`;
        } else {
            dataExibida = register.data;
        }

        divRegistro.innerHTML = `
            <p>${dataExibida} - ${register.hora} | ${register.tipo} |
            Lat: ${register.localizacao.latitude}, Lon: ${register.localizacao.longitude} |
            Comentário: ${register.comentario}</p> <!-- Aqui é onde exibimos o comentário -->
            <button onclick="editRegister(${register.id})">Editar</button>
            <button onclick="editJustification(${register.id})">Modificar Justificativa</button>
            <button onclick="alert('Esse registro não pode ser excluído!')">Excluir</button>
        `;

        // Define a classe CSS com base no estado do registro
        if (register.modificado) {
            divRegistro.classList.add("text-red"); 
        } else if (register.dataPassada) {
            divRegistro.classList.add("text-yellow"); 
        } else {
            divRegistro.classList.add("text-white"); 
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

renderList();
