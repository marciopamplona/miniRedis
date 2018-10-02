/*
========== miniRedis ==========
Author: Marcio Pamplona
===============================
*/
const banner = '\
┌┬┐┬┌┐┌┬  ╦═╗╔═╗╔╦╗╦╔═╗  ┌┐ ┬ ┬  ╔╦╗╔═╗╔═╗ \n\
││││││││  ╠╦╝║╣  ║║║╚═╗  ├┴┐└┬┘  ║║║╠╣ ╠═╝ \n\
┴ ┴┴┘└┘┴  ╩╚═╚═╝═╩╝╩╚═╝  └─┘ ┴   ╩ ╩╚  ╩   \n\n\ ';

global.MAX_MEMORY = 500; // em Megabytes
global.liner = 'miniRedis> ';
global.database = {};
global.memory_usage = 0;
const cliPort = 1234;
const restPort = 8080;

const utils = require('./utils.js')
const net = require('net')
const carrier = require('carrier')
const commands = require('./commands.js')
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const app = express();
const fs = require('fs');

console.log(banner);
utils.printMemory();

// REST API server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var restServer = app.listen(restPort, function () {
    console.log("REST API rodando na porta ", restServer.address().port);
});

// CLI server
const server = net.createServer((c) => {
    console.log('CLI conectado');
    c.setNoDelay();
    c.on('end', () => { console.log('CLI desconectado') });

    carrier.carry(c, function(line){
        commands.cmdReader(line, c);
    })

    c.write(banner);
    c.write(liner);
});
server.on('error', (err) => { throw err });
server.listen(cliPort, () => { 
    console.log('Servindo CLI na porta '+cliPort) }
);

// SYS INFO
setInterval(()=>{
    utils.printMemory();
    console.log('INFO: '+ commands.cmdReader('DBSIZE\n'));
}, 10000)

process.on('SIGTERM', function() {
    exitMain();
});

process.on('SIGINT', function() {
    exitMain();
});

function exitMain() {
    console.log("INFO: Saindo da aplicação, persistindo dados no disco.");
    const data = JSON.stringify(commands.database);
    fs.writeFile('database.json', data, (err) => {
        if (err) throw err;
        console.log('Banco de dados gravado!');
    });
}
