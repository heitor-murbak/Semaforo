//Importando a biblioteca
const express = require("express");
const mqtt = require("mqtt");
const http = require("http");
const {Server} = require("socket.io")

// Configurando servidor express
const app = express();
const server = http.createServer(app);

// Configurando WebSocket

const io = new Server(server);

// Configurando parametros
const port = 3005;
const URL_BROKER = "mqtt://broker.hivemq.com";
const TOPIC_STATUS = "heitor/status/semaforo";
const TOPIC_CONTROLE = "heitor/status/semaforo";
const PORT_BROKER = 1883;

// Configurando variaveis globais

mqttEstadoAnterior = "";

// Arquivos de frontend na pasta public
app.use(express.static("semaforo_web"));

//Rodar servidor express
server.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`);
});

//Criar a conexão MQTT
const client = mqtt.connect(URL_BROKER, PORT_BROKER);

//Status servidor MQTT
client.on("connect", ()=>{
    console.log("Conectado ao MQTT");
    client.subscribe(TOPIC_STATUS);
    mqttEstado("Conectado")
    io.emit("mqtt_status", mqttEstadoAnterior)
});

client.on("offline", () => {
    console.console.warn("Cliente MQTT Desconectado");
    mqttEstado("Desconectado"); 
});

client.on("error", (err) => {
    console.error("Erro MQTT:", err.message);
    mqttEstado("Reconectando");
});

// Receber Mensagem do MQTT
client.on("message", (topic, message) =>{
    console.log(`[${topic}] - ${message}`);
    io.emit("semaforo_status", message.toString());
});

//Receber as conexões do frontend via WebSocket
io.on("connection", (socket) =>{
    console.log("Novo cliente conectado");
    io.emit("mqtt_status", mqttEstadoAnterior);

    socket.on("controleManual", (botao) => {
        client.publish(TOPIC_CONTROLE, botao);
        console.log("Botão Acionado:", botao);
    });
});

//Funções Locais
function mqttEstado(estado){
    mqttEstadoAnterior = estado;
    io.emit("mqtt_status", estado);
}