function baterPonto() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];

    
    const dataAnteriorCheckbox = document.getElementById("checkboxDataAnterior").checked;
    const justificativaCheckbox = document.getElementById("checkboxJustificativa").checked;

    
    const novoRegistro = {
        id: Date.now(),
        data: new Date().toLocaleDateString("pt-BR"), 
        hora: new Date().toLocaleTimeString("pt-BR"), 
        tipo: "Bateu ponto", 
        localizacao: { latitude: 0, longitude: 0 }, 
        modificado: justificativaCheckbox, 
        dataPassada: dataAnteriorCheckbox 
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
        divRegistro.innerHTML = `
            <p>${register.data} - ${register.hora} | ${register.tipo} |
            Lat: ${register.localizacao.latitude}, Lon: ${register.localizacao.longitude}</p>
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
