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

    
    const comentario = prompt("Insira um comentário:");
    console.log("Comentário capturado:", comentario); 

    
    const novoRegistro = {
        id: Date.now(),
        data: dataRegistro, 
        hora: new Date().toLocaleTimeString("pt-BR"), 
        tipo: "Bateu ponto", 
        localizacao: { latitude: 0, longitude: 0 }, 
        modificado: justificativaCheckbox, 
        dataPassada: dataAnteriorCheckbox, 
        comentario: comentario || "Nenhum comentário." 
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
        
        
        const dataExibida = register.data; 
        console.log("Data exibida:", dataExibida); 

        divRegistro.innerHTML = `
            <p>${dataExibida} - ${register.hora} | ${register.tipo} |
            Lat: ${register.localizacao.latitude}, Lon: ${register.localizacao.longitude} |
            Comentário: ${register.comentario}</p> <!-- Adicionando comentário -->
            <button onclick="editRegister(${register.id})">Editar</button>
            <button onclick="editJustification(${register.id})">Modificar Justificativa</button>
            <button onclick="alert('Esse registro não pode ser excluído!')">Excluir</button>
        `;

        
        divRegistro.className = "";  

        
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
