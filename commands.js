const fs = require('fs');

// Lê o banco persistido
if (fs.existsSync('database.json')) {
    database = JSON.parse(fs.readFileSync('database.json'));
}

var ttl = {};

// Interpretador de comandos
var cmdReader = function (cmd, c){
    const invArgs = "Quantidade ou tipo de argumento inválido!\n"
    var command = String(cmd).trim();
    var cmdArray = command.split(' ');
    var response = '';

    cmdArray[0] = cmdArray[0].toUpperCase();

    if (cmdArray[0] === 'SET'){
        if (cmdArray.length == 3){
            response = cmdSET(cmdArray.slice(1), c)
        } else if ((cmdArray.length == 5)&&(cmdArray[3] === 'EX')&&( Number.isInteger(Number(cmdArray[4])))){
            response = cmdSETex(cmdArray.slice(1), c)
        } else {
            response = invArgs;
        }
    } else if (cmdArray[0] === 'GET') {
        if (cmdArray.length == 2){
            response = cmdGET(cmdArray.slice(1), c)
        } else {
            response = invArgs
        }
    } else if (cmdArray[0] === 'DEL') {
        if (cmdArray.length == 2){
            response = cmdDEL(cmdArray.slice(1), c)
        } else {
            response = invArgs
        }
    } else if (cmdArray[0] === 'DBSIZE') {
        if (cmdArray.length == 1){
            response = cmdDBSIZE(c)
        } else {
            response = invArgs
        }
    } else if (cmdArray[0] === 'INCR') {
        if (cmdArray.length == 2){
            response = cmdINCR(cmdArray.slice(1), c)
        } else {
            response = invArgs
        }
    } else if (cmdArray[0] === 'ZADD') {
        if ((cmdArray.length == 4) && ( !Number.isNaN(Number(cmdArray[2])))){
            response = cmdZADD(cmdArray.slice(1), c)
        } else {
            response = invArgs
        }
    } else if (cmdArray[0] === 'ZCARD') {
        if (cmdArray.length == 2){
            response = cmdZCARD(cmdArray.slice(1), c)
        } else {
            response = invArgs
        }
    } else if (cmdArray[0] === 'ZRANK') {
        if (cmdArray.length == 3){
            response = cmdZRANK(cmdArray.slice(1), c)
        } else {
            response = invArgs
        }
    } else if (cmdArray[0] === 'ZRANGE') {
        if ((cmdArray.length == 4)&&(!Number.isNaN(Number(cmdArray[2])))&&(!Number.isNaN(Number(cmdArray[3])))){
            response = cmdZRANGE(cmdArray.slice(1), c)
        } else {
            response = invArgs
        }
    } else if (cmdArray[0] === 'PRINTALL') {
        if (cmdArray.length == 1){
            response = printAll(c)
        } else {
            response = invArgs
        }
    }

    if (c !== undefined){
        if (!c.destroyed) {
            c.write(response);
            c.write(liner);
        } else {
            return response;
        }
    } else {
        return response;
    }
}

function cmdSET(args, c){
    if (memory_usage > MAX_MEMORY) {
        console.log(`Tamanho máximo de memória atingido! (${MAX_MEMORY}MB)`)
        return 'NOK\n'
    }
    database[args[0]] = args[1];
    return ('OK\n');
}

function cmdSETex(args, c){
    if (memory_usage > MAX_MEMORY) {
        console.log(`Tamanho máximo de memória atingido! (${MAX_MEMORY}MB)`)
        return 'NOK\n'
    }
    if (ttl.hasOwnProperty(args[0])){
        clearTimeout(ttl[args[0]]);
        delete ttl[args[0]];
    }
    database[args[0]] = args[1];
    ttl[args[0]] = setTimeout(()=>{
        delete database[args[0]];
        if (c !== undefined) {
            if (!c.destroyed) {
                c.write('\nChave '+args[0]+ ' expirou!\n');
                c.write(liner);
            }
        }
    }, args[3]*1000);
    return ('Expira em '+args[3]+ ' segundos\nOK\n');
}

function cmdGET(args, c){
    if (database.hasOwnProperty(args[0])){
        return (database[args[0]]+'\n')
    } else {
        return ('CHAVE não existe!\n')
    }
}

function cmdDEL(args, c){
    if (database.hasOwnProperty(args[0])){
        delete database[args[0]]
        return ('OK (1)\n')
    } else {
        return ('CHAVE não existe!\n')
    }
}

function printAll(c){
    return ('\n'+JSON.stringify(database)+'\n')
}

function cmdDBSIZE(c){
    const size = Object.keys(database).length;
    return ('Tamanho do banco: '+size+' chaves\n')
}

function cmdINCR(args, c){
    if (memory_usage > MAX_MEMORY) {
        console.log(`Tamanho máximo de memória atingido! (${MAX_MEMORY}MB)`)
        return 'NOK\n'
    }
    if (database.hasOwnProperty(args[0])){
        if (Number.isInteger(Number(database[args[0]]))){
            database[args[0]]++
            return (database[args[0]]+'\n')
        } else {
            return ('VALOR não é um número!\n')
        }
    } else {
        return ('CHAVE não existe!\n')
    }
}

function cmdZADD(args, c){
    if (memory_usage > MAX_MEMORY) {
        console.log(`Tamanho máximo de memória atingido! (${MAX_MEMORY}MB)`)
        return 'NOK\n'
    }
    if (database.hasOwnProperty(args[0])){
        var keynotfound = true;
        // SE ENCONTRAR MESMA CHAVE, ATUALIZA SOMENTE O SCORE
        for (var e in database[args[0]]){
            if (database[args[0]][e][0] === args[2]){
                database[args[0]][e][1] = args[1]
                keynotfound = false;
            }
        }
        if (keynotfound) {
            var tempArray = database[args[0]];
            tempArray.push([args[2], args[1]]);
            database[args[0]] = tempArray.slice().sort(function(a, b){ return a[1] - b[1] });
        }
    } else {
        database[args[0]] = [[args[2], args[1]]];
    }
    return ("OK\n");
}

function cmdZCARD(args, c){
    if (database.hasOwnProperty(args[0])){
        return (database[args[0]].length+'\n')
    } else {
        return ('0\n')
    }
}

function cmdZRANK(args, c){
    if (database.hasOwnProperty(args[0])){
        for (var e in database[args[0]]){
            if (database[args[0]][e][0] === args[1]){
                return (e+'\n');
            }
        }
    } else {
        return ('(nil)\n')
    }
}

function cmdZRANGE(args, c){
    var response = '';
    if (database.hasOwnProperty(args[0])){
        var start = Number(args[1]);
        var end = Number(args[2]);
        var size = database[args[0]].length;
        if (start < 0) start = size + start;
        if (end < 0) end = size + end;
        for (var e in database[args[0]]){
            if ((e >= start) && (e <= end)) {
                response += (database[args[0]][e][0]+' ');
            }
        }
        response += '\n';
    } else {
        response = 'CHAVE não existe\n'
    }
    return response;
}

module.exports = {cmdReader:cmdReader, database:database};

