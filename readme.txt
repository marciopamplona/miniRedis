==============================
┌┬┐┬┌┐┌┬  ╦═╗╔═╗╔╦╗╦╔═╗  ┌┐ ┬ ┬  ╔╦╗╔═╗╔═╗
││││││││  ╠╦╝║╣  ║║║╚═╗  ├┴┐└┬┘  ║║║╠╣ ╠═╝
┴ ┴┴┘└┘┴  ╩╚═╚═╝═╩╝╩╚═╝  └─┘ ┴   ╩ ╩╚  ╩  
Mini Redis por Marcio Pamplona
==============================

PARTE1 (core): aproximadamente 4h de desenvolvimento
PARTE2 (networking): aproximadamente 2h de desenvolvimento

Usei NodeJS para esse desenvolvimento, pois estou muito familiarizado com o ambiente,
e a adoção de frameworks e módulos é muito fácil.
Todos os dados são armazenados em um objeto chamado 'database', em memória. O Garbage
collector do V8 engine, se encarrega de manter enxuta a alocação de memória.
Além do requerido pelo desafio, implementei ainda a persistência em arquivo do objeto 
de memória, que só é realizada quando o processo recebe o sinal de KILL (gracefull shutdown).
Há uma variável global, chamada MAX_MEMORY, para limitar a tamanho do HEAP utilizado pelo
programa, caso seja atingido o limite, o programa para de manipular os dados (gravação e edição).

Módulos usados:
===============
'net' (nativo), para a comunicação da interface de comandos.
'fs' (nativo), para persistência de dados em arquivo.
'carrier', para a separação dos chunks de dados recebidos pela interface CLI.
'express', para a implementação do REST API.
'body-parser', middleware para o express, para interpretação do body da resposta http.

Instalando e rodando:
=====================
Requerimento: NodeJS >= v8.0

Extrair em uma pasta.
Dentro da pasta, rodar:
    > npm install
    > node index.js


COMMAND SET implementado:
-------------------------
1. SET​ key value
2. SET​ key value EX seconds
3. GET​ key
4. DEL​ key
5. DBSIZE
6. INCR​ key
7. ZADD​ key score member
8. ZCARD​ key
9. ZRANK​ key member
10. ZRANGE​ key start stop
11. PRINTALL

A interface de comandos pode ser acessada conectando na porta 1234 usando telnet ou netcat:
> nc localhost 1234
ou
> telnet locahost 1234

REST API, servido na porta 8080:
--------------------------------

SET key value:
--------------
    MÉTODO: PUT
    URL: localhost:8080/key
    HEADERS: "Content-type":"application/json"
    BODY: JSON body.value => {"value": "valor_a_ser_armazenado"}

SET key value EX seconds:
-------------------------
    MÉTODO: PUT
    URL: localhost:8080/key/seconds
    HEADERS: "Content-type":"application/json"
    BODY: JSON body.value => {"value": "valor_a_ser_armazenado"}

GET key:
--------
    MÉTODO: GET
    URL: localhost:8080/key
    HEADERS: N/A
    BODY: N/A

DEL key:
--------
    MÉTODO: DELETE
    URL: localhost:8080/key
    HEADERS: N/A
    BODY: N/A

DBSIZE:
-------
    MÉTODO: GET
    URL: localhost:8080/sys/dbsize
    HEADERS: N/A
    BODY: N/A

PRINTALL:
---------
    MÉTODO: GET
    URL: localhost:8080/sys/printall
    HEADERS: "Content-type":"application/json"
    BODY: N/A

INCR key:
---------
    MÉTODO: POST
    URL: localhost:8080/incr/key
    HEADERS: N/A
    BODY: N/A

ZADD key score member:
----------------------
    MÉTODO: POST
    URL: localhost:8080/zadd/key/score
    HEADERS: "Content-type":"application/json"
    BODY: JSON body.value => {"value": "valor_a_ser_armazenado"}

ZCARD key:
----------
    MÉTODO: GET
    URL: localhost:8080/zcard/key
    HEADERS: N/A
    BODY: N/A

ZRANK key member:
-----------------
    MÉTODO: GET
    URL: localhost:8080/zrank/key/member
    HEADERS: N/A
    BODY: N/A

ZRANGE key start stop:
----------------------
    MÉTODO: GET
    URL: localhost:8080/zrange/key/start/stop
    HEADERS: N/A
    BODY: N/A

