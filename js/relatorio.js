function renderList() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registrosContainer = document.getElementById('registros-relatorio');
    const filtroPeriodo = document.getElementById('filtro-periodo').value;

    // Limpa o container
    registrosContainer.innerHTML = '';

    if (registros.length === 0) {
        registrosContainer.innerHTML = '<p>Nenhum registro encontrado.</p>';
        return;
    }

    const filteredRecords = registros.filter(register => {
        const registerDate = new Date(register.data.split('/').reverse().join('-'));
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        if (filtroPeriodo === 'ultima-semana') {
            return registerDate >= lastWeek;
        } else if (filtroPeriodo === 'ultimo-mes') {
            return registerDate >= lastMonth;
        } else {
            return true; // Todos
        }
    });

    // Agrupando os registros por data
    const groupedRecords = {};
    filteredRecords.forEach(register => {
        if (!groupedRecords[register.data]) {
            groupedRecords[register.data] = [];
        }
        groupedRecords[register.data].push(register);
    });

    // Renderizando os registros agrupados
    for (const [data, registros] of Object.entries(groupedRecords)) {
        const divData = document.createElement("div");
        divData.innerHTML = `<h3>${data}</h3>`; // Adicionando a data
        registros.forEach(register => {
            const divRegistro = document.createElement("div");
            divRegistro.innerHTML = `
                <p>${register.hora} | ${register.tipo} | 
                Lat: ${register.localizacao.latitude}, Lon: ${register.localizacao.longitude}</p>
                <button onclick="editRegister(${register.id})">Editar</button>
                <button onclick="alert('Esse registro não pode ser excluído!')">Excluir</button>
            `;
            divData.appendChild(divRegistro);
        });
        registrosContainer.appendChild(divData);
    }
}

function editRegister(id) {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registroIndex = registros.findIndex(r => r.id === id); // Encontrar o índice do registro

    if (registroIndex !== -1) {
        // Exibir um prompt para editar o registro
        const newType = prompt("Editar tipo de registro:", registros[registroIndex].tipo);
        if (newType) {
            registros[registroIndex].tipo = newType; // Atualiza o tipo do registro
            localStorage.setItem("register", JSON.stringify(registros)); // Salva no localStorage
            renderList(); // Atualiza a lista
        }
    } else {
        alert('Registro não encontrado!');
    }
}

renderList();
