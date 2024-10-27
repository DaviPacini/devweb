function baterPonto() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];

    // Obter o estado das checkboxes
    const dataAnteriorCheckbox = document.getElementById("usar-data-passada").checked; 
    const justificativaCheckbox = document.getElementById("usar-observacao").checked; 

    // Obter a data, se a checkbox estiver selecionada
    let dataRegistro;
    if (dataAnteriorCheckbox) {
        dataRegistro = document.getElementById("data-ponto").value; // Data do input
        // Se o input estiver vazio, usa a data atual
        if (!dataRegistro) {
            alert("Por favor, selecione uma data.");
            return; // Não registrar se a data não for fornecida
        }
    } else {
        dataRegistro = new Date().toLocaleDateString("pt-BR"); // Data atual
    }

    // Obter comentário, se fornecido
    const comentario = prompt("Insira um comentário:");
    console.log("Comentário capturado:", comentario); // Para depuração

    // Criar um novo registro com os dados coletados
    const novoRegistro = {
        id: Date.now(),
        data: dataRegistro, // Usar a data da checkbox
        hora: new Date().toLocaleTimeString("pt-BR"), 
        tipo: "Bateu ponto", 
        localizacao: { latitude: 0, longitude: 0 }, 
        modificado: justificativaCheckbox, 
        dataPassada: dataAnteriorCheckbox, // Guarda o estado da checkbox
        comentario: comentario || "Nenhum comentário." // Armazena o comentário ou uma mensagem padrão
    };

    // Adicionar o novo registro ao array e salvar no localStorage
    registros.push(novoRegistro);
    localStorage.setItem("register", JSON.stringify(registros));

    // Atualizar a lista de registros
    renderList(); 
}

function renderList() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registrosContainer = document.getElementById('registros-relatorio');
    registrosContainer.innerHTML = ''; 

    // Exibir mensagem se não houver registros
    if (registros.length === 0) {
        registrosContainer.innerHTML = '<p>Nenhum registro encontrado.</p>';
        return;
    }

    // Loop para criar os elementos de registro
    registros.forEach(register => {
        const divRegistro = document.createElement("div");
        
        // Definindo a data a ser exibida
        const dataExibida = register.data; // data já está definida no registro
        console.log("Data exibida:", dataExibida); // Para depuração

        divRegistro.innerHTML = `
            <p>${dataExibida} - ${register.hora} | ${register.tipo} |
            Lat: ${register.localizacao.latitude}, Lon: ${register.localizacao.longitude} |
            Comentário: ${register.comentario}</p> <!-- Adicionando comentário -->
            <button onclick="editRegister(${register.id})">Editar</button>
            <button onclick="editJustification(${register.id})">Modificar Justificativa</button>
            <button onclick="alert('Esse registro não pode ser excluído!')">Excluir</button>
        `;

        // Altera a cor com base nos registros modificados e data passada
        divRegistro.className = "";  

        // Aplica a classe de cor correta
        if (register.modificado) {
            divRegistro.classList.add("text-red"); // Para registros modificados
        } else if (register.dataPassada) {
            divRegistro.classList.add("text-yellow"); // Para registros com data passada
        } else {
            divRegistro.classList.add("text-white"); // Para registros normais
        }

        registrosContainer.appendChild(divRegistro);
    });
}

// Funções de edição
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
            registros[registroIndex].modificado = true; // Marca como modificado
            localStorage.setItem("register", JSON.stringify(registros));
            renderList();
        }
    } else {
        alert("Registro não encontrado!");
    }
}

// Chama a renderList na inicialização para mostrar registros existentes
renderList();
