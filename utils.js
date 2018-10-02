
var float2 = function (x) {
    var s = String(x);
    var int = '0';
    var res = '00';
    if (s.includes('.')){
        s = s.split('.');
        res = s[1].slice(0,2);
        int = s[0];
    } else {
        int = s;
    }
    return int+'.'+res;
}

var printMemory = function (){
    const usage = float2(process.memoryUsage().heapUsed / 1024 / 1024);
    memory_usage = usage;
    console.log(`INFO: Consumo de memória está em ${usage} MB`);
}

module.exports = { float2: float2, printMemory:printMemory}