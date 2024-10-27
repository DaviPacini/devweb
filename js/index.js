const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
btnBaterPonto.addEventListener("click", register);

const dialogPonto = document.getElementById("dialog-ponto");
const dialogJustificativa = document.getElementById("dialog-justificativa");
const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

const btnJustificar = document.getElementById("btn-justificar");
const btnDialogJustificativaFechar = document.getElementById("btn-dialog-justificativa-fechar");
const formJustificativa = document.getElementById("form-justificativa");

document.getElementById("btn-relatorios").onclick = function() {
    window.location.href = "html/relatorio.html";
};

const nextRegister = {
    "entrada": "intervalo",
    "intervalo": "volta-intervalo", 
    "volta-intervalo": "saida", 
    "saida": "entrada"
}

let registerLocalStorage = getRegisterLocalStorage();

const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");
const usarDataPassada = document.getElementById("usar-data-passada");
const dataPonto = document.getElementById("data-ponto");
const usarObservacao = document.getElementById("usar-observacao");
const observacaoContainer = document.getElementById("observacao-container");
const observacao = document.getElementById("observacao");

const divAlertaRegistroPonto = document.getElementById("alerta-registro-ponto");

usarDataPassada.addEventListener("change", () => {
    if (usarDataPassada.checked) {
        dataPonto.classList.remove("hidden");
        const today = new Date().toISOString().split('T')[0];
        dataPonto.max = today; 
    } else {
        dataPonto.classList.add("hidden");
        dataPonto.value = ""; 
    }
});

usarObservacao.addEventListener("change", () => {
    if (usarObservacao.checked) {
        observacaoContainer.classList.remove("hidden");
    } else {
        observacaoContainer.classList.add("hidden");
    }
});

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();

async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        },
        (error) => {
            reject("Erro ao recuperar a localização " + error);
        });
    });
}

const btnCloseAlertRegister = document.getElementById("alerta-registro-ponto-fechar");
btnCloseAlertRegister.addEventListener("click", () => {
    divAlertaRegistroPonto.classList.remove("show");
    divAlertaRegistroPonto.classList.add("hidden");
});

const btnDialogBaterPonto = document.getElementById("btn-dialog-bater-ponto");
btnDialogBaterPonto.addEventListener("click", async () => {
    const typeRegister = document.getElementById("tipos-ponto");
    let lastTypeRegister = localStorage.getItem("lastTypeRegister");
    
    let ponto = {
        "data": usarDataPassada.checked ? dataPonto.value || getCurrentDate() : getCurrentDate(),
        "hora": getCurrentHour(),
        "localizacao": await getCurrentPosition(),
        "id": Date.now(),  
        "tipo": typeRegister.value,
        "observacao": usarObservacao.checked ? observacao.value : null 
    };

    saveRegisterLocalStorage(ponto);
    divAlertaRegistroPonto.classList.remove("hidden");
    divAlertaRegistroPonto.classList.add("show");

    localStorage.setItem("lastDateRegister", ponto.data);
    localStorage.setItem("lastTimeRegister", ponto.hora);
    dialogPonto.close();

    setTimeout(() => {
        divAlertaRegistroPonto.classList.remove("show");
        divAlertaRegistroPonto.classList.add("hidden");
    }, 5000);
});

btnJustificar.addEventListener("click", () => {
    dialogJustificativa.showModal();  
});

btnDialogJustificativaFechar.addEventListener("click", () => {
    dialogJustificativa.close(); 
});

formJustificativa.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const descricao = document.getElementById("descricao-justificativa").value;
    const arquivo = document.getElementById("arquivo-justificativa").files[0];
    
    const justificativa = {
        "descricao": descricao,
        "arquivo": arquivo ? arquivo.name : null 
    };
    
    console.log("Justificativa enviada:", justificativa);
    dialogJustificativa.close(); 
});

function saveRegisterLocalStorage(register) {
    registerLocalStorage.push(register); 
    localStorage.setItem("register", JSON.stringify(registerLocalStorage));
    localStorage.setItem("lastTypeRegister", register.tipo);
} 

function getRegisterLocalStorage() {
    let registers = localStorage.getItem("register");
    if (!registers) {
        return [];
    }
    return JSON.parse(registers); 
}

function register() {
    dialogData.textContent = "Data: " + getCurrentDate();
    dialogHora.textContent = "Hora: " + getCurrentHour();
    
    let lastTypeRegister = localStorage.getItem("lastTypeRegister");
    if (lastTypeRegister) {
        const typeRegister = document.getElementById("tipos-ponto");
        typeRegister.value = nextRegister[lastTypeRegister];
        let lastRegisterText = "Último registro: " + localStorage.getItem("lastDateRegister") + " - " + localStorage.getItem("lastTimeRegister") + " | " + localStorage.getItem("lastTypeRegister")
        document.getElementById("dialog-last-register").textContent = lastRegisterText;
    }

    setInterval(() => {
        diaSemana.textContent = getWeekDay();
        diaMesAno.textContent = getCurrentDate();
        horaMinSeg.textContent = getCurrentTime();
    }, 1000);

    console.log("Bater p0nto");

    dialogPonto.showModal();
}

function getWeekDay() {
    return new Date().toLocaleString('pt-BR', { weekday: 'long' });
}

function getCurrentHour() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getCurrentDate() {
    return new Date().toLocaleDateString('pt-BR');
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentHour();
}

printCurrentHour();
setInterval(printCurrentHour, 1000);

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}


