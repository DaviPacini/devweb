const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
btnBaterPonto.addEventListener("click", register);

const dialogPonto = document.getElementById("dialog-ponto");
const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

const nextRegister = {
    "entrada": "intervalo",
    "intervalo": "volta-intervalo", 
    "volta-intervalo": "saida", 
    "saida": "entrada"
}

let registerLocalStorage = getRegisterLocalStorage();

const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

const divAlertaRegistroPonto = document.getElementById("alerta-registro-ponto");

// Elementos da data e hora passadas
const usarDataPassada = document.getElementById("usar-data-passada");
const dataHoraPassada = document.getElementById("data-hora-passa");
const dataPonto = document.getElementById("data-ponto");
const horaPonto = document.getElementById("hora-ponto");

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();

// Define a data máxima do input date como a data atual
const today = new Date().toISOString().split('T')[0];
dataPonto.max = today;

usarDataPassada.addEventListener("change", () => {
    if (usarDataPassada.checked) {
        dataHoraPassada.classList.remove("hidden");
    } else {
        dataHoraPassada.classList.add("hidden");
    }
});

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
            reject("Erro ao recuperar a localização: " + error);
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
    let ponto;
    if (usarDataPassada.checked) {
        ponto = {
            "data": dataPonto.value,
            "hora": horaPonto.value,
            "localizacao": await getCurrentPosition(),
            "tipo": document.getElementById("tipos-ponto").value
        };
    } else {
        ponto = {
            "data": getCurrentDate(),
            "hora": getCurrentHour(),
            "localizacao": await getCurrentPosition(),
            "tipo": document.getElementById("tipos-ponto").value
        };
    }

    saveRegisterLocalStorage(ponto);
    console.log(registerLocalStorage); // Adicionado para verificar se o ponto foi salvo
    divAlertaRegistroPonto.classList.remove("hidden");
    divAlertaRegistroPonto.classList.add("show");

    setTimeout(() => {
        divAlertaRegistroPonto.classList.remove("show");
        divAlertaRegistroPonto.classList.add("hidden");
    }, 5000);

    dialogPonto.close();
});

function saveRegisterLocalStorage(ponto) {
    registerLocalStorage = getRegisterLocalStorage(); // Atualiza o registro com o que já existe
    registerLocalStorage.push(ponto); // Adiciona o novo registro
    localStorage.setItem("pontos", JSON.stringify(registerLocalStorage)); // Salva no localStorage
}

function getRegisterLocalStorage() {
    let points = localStorage.getItem("pontos");
    return points ? JSON.parse(points) : []; // Retorna os pontos armazenados ou um array vazio
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentHour() {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function getWeekDay() {
    return new Date().toLocaleString('pt-BR', { weekday: 'long' });
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

setInterval(() => {
    diaSemana.textContent = getWeekDay();
    diaMesAno.textContent = getCurrentDate();
    horaMinSeg.textContent = getCurrentTime();
}, 1000);

function register() {
    dialogPonto.showModal();
}
