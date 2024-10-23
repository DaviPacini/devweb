function renderList() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registrosContainer = document.getElementById('registros-relatorio');

    if (registros.length === 0) {
        registrosContainer.innerHTML = '<p>Nenhum registro encontrado.</p>';
        return;
    }

    registros.forEach(register => {
        const divRegistro = document.createElement("div");
        divRegistro.innerHTML = `<p>${register.data} - ${register.hora} | ${register.tipo} | 
            Lat: ${register.localizacao.latitude}, Lon: ${register.localizacao.longitude}</p>`;
        registrosContainer.appendChild(divRegistro);
    });
}

renderList();
