const socket = io();
const overlay = document.getElementById("overlay");
const buttons = document.querySelectorAll(".action-btn")

function ligar(cor) {
    desligar();
    document.getElementById(cor).classList.add(cor);
}

function desligar() {
    document.getElementById('vermelho').classList.remove('vermelho');
    document.getElementById('amarelo').classList.remove('amarelo');
    document.getElementById('verde').classList.remove('verde');
}

//Função para enviar o controle do semaforo para o backend
function enviaControle(botao){
    socket.emit("controleManual", botao);
}

//--------CONEXÃO WEBSOCKET---------
//Receber o status MQTT
socket.on("mqtt_status", (status) =>{
    console.log(status);
    const mqttStatusDiv = document.getElementById("mqtt-status");
    mqttStatusDiv.innerText = "MQTT: " + status;
    mqttStatusDiv.classList = "";

    if (status === "Conectado") {
        mqttStatusDiv.classList.add("status-conectado");
    } else if (status === "Desconectado") {
        mqttStatusDiv.classList.add("status-desconectado");
    } else {
        mqttStatusDiv.classList.add("status-reconectando");
    }
});

//Receber STATUS do semaforo
socket.on("semaforo_status", (msg) =>{
    console.log(msg.toString());

    switch(msg){
        case "0":
            ligar('verde');
            break;
        case "1":
            ligar('amarelo');
            break;
        case "2":
            ligar('vermelho');
            break;
        case "5":
            desligar();
            break;
        default:
            console.log("mensagem não foi definida", msg);
    }
});

buttons: forEach(button =>{
    button.addEventListener("click", () =>{
        overlay.classList.add("active");
    });
});

