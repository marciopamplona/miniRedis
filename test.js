const net = require('net');

const serverPORT = 1234;
var lastRead = '';
const amount = 100000;

const client = net.createConnection({
    port: serverPORT
}, () => {
    console.log('Servidor conectado...');
    client.setNoDelay();
    setTimeout(() => { start() }, 1000);
});

client.on('data', (d) => {
    // lastRead = d.toString();
    // console.log(lastRead);
});

client.on('drain', (d) => {
    console.log('drain');
});

client.on('end', () => {
    console.log("Servidor desconectado")
});

function start(callback) {
    console.log("1) Testando inserção de dados com SET: ");

    for (var i = 0; i < amount; i++) {
        client.write('SET ' + 'SET_' + i + ' DATA_' + i + '\r\n', 'utf8');
    }

    insertDataEX();
}

function insertDataEX(callback) {
    console.log("2) Testando inserção de dados com SET EX: ");

    for (var i = 0; i < amount; i++) {
        client.write('SET ' + 'SET_EX_' + i + ' DATA_' + i + ' EX 30\r\n', 'utf8');
    }

    delData();
}

function delData(callback) {
    console.log("3) Testando remoção de dados com DEL: ");

    for (var i = 0; i < amount; i++) {
        client.write('DEL ' + 'SET_' + i +'\r\n', 'utf8');
    }

    client.end();
}