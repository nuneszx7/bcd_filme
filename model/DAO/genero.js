/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente aos generos
* Data: 05/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

/*
    Exemplos de dependências para conexão com o banco de dados

    Bancos de dados relacionais
        Sequelize   -> Foi utilizado em muitos projetos desde o inicio do node
        Prisma      -> É uma dependência atual que trabalha com banco de dados (MySQL, PostgreSQL, SQL Server) (SQL ou ORM)
            npm i prisma         --save     -> Comando que instala as dependências do prisma (Que realiza a conexão com o DataBase)
            npm i @prisma/client --save     -> Comando que instala o cliente do prisma (Executa scripts SQL no Banco de Dados)
            npx prisma init                 -> Prompt de comando para inicializar o prisma
            npx prisma migrate dev          -> Realiza o sincronismo entre o prisma e o banco de dados (CUIDADO!!! Nesse processo você poderá PERDER dados reais do banco, pois ele pega
                                                                                                        e cria as tableas programadas no ORM schema.prisma)
            npx prisma generate             -> Apenas realiza o sincronismo entre o prisma e o banco de dados, geralmente, usamos para rodas o projeto em um PC novo

        Knex        -> É uma dependência atual que trabalha com MySQL

    Bancos não relacionais
        Mongoose    -> É uma dependência para o MongoDB (Não relacional)


*/

//$queryRawUnsafe()     -> permite executar um script SQL de uma variável e que retorna valores do banco (SELECT)
//$executeRawUnsafe()   -> permite executar um script SQL de uma variavel e que NÃO retorna dados do banco (INSERT, UPDATE E DELETE)
//$queryRaw()           ->Permite executar um script SQL SEM estar em uma variável e que retorna valores do banco (SELECT) e faz tratamentos de segurança contra SQL Injection
//$executeRaw()         -> Permite executar um script SQL SEM estar em uma variável e que retorna valores do banco (INSERT, UPDATE E DELETE) e faz tratamentos de segurança contra SQL Injection

//Import da dependência do Prisma que permite a execução de script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')
//Cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient();

//Função para retornar uma lista contendo todos os generos no banco de dados
const getSelectAllGeneros = async function () {

    try {
        //Script SQL
        // Usando o método seguro $queryRaw com template literals
        let result = await prisma.$queryRaw`SELECT * FROM tbl_genero ORDER BY id DESC`
 
        // O prisma.$queryRaw já retorna um array, então a verificação é mais simples
 
        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para retornar um genero filtrando pelo ID no banco de dados
const getSelectByIdGenero = async function (id) {

    try {

        //Script SQL
        // Usando o método seguro $queryRaw com template literals e passando o 'id' como parâmetro
        let result = await prisma.$queryRaw`SELECT * FROM tbl_genero WHERE id = ${id}`

        
        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.log(error) 
        return false
    }

}

//Função que retorna o ultimo ID gerado no BD
const getSelectLastID = async function (){

    try {
        //Script para retornar somente o ultimo ID
        let sql = `select id from tbl_genero order by id desc limit 1`

        //Encaminha para o BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return Number(result[0].id)
        else
            return false


    } catch (error) {
        return false
    }

}

//Insere um genero novo no banco de dados
const setInsertGenero = async function (genero) {

    try {
        
        let result = await prisma.$executeRaw`
        INSERT INTO tbl_genero (
            nome

        ) VALUES (
            ${genero.nome}
        )`;

    if (result)
        return true
    else
        return false

    } catch (error) {
        console.log(error)
        return false
    }


}

//Altera um genero no banco de dados
const setUpdateGenero = async function (genero) {

    try {
        
        let result = await prisma.$executeRaw`
            UPDATE tbl_genero SET
                nome = ${genero.nome}
            WHERE id = ${genero.id}
        `;

        
        if (result > 0)
            return true;
        else
            return false;

    } catch (error) {
        console.log(error)
        return false
    }

}

//Deleta um genero pelo ID no banco de dados
const setDeleteGenero = async function (id) {

    try {
        
        let result = await prisma.$executeRaw`DELETE FROM tbl_genero WHERE id = ${id}`;

        if (result)
            return true
        else
            return false
    
        } catch (error) {
            console.log(error)
            return false
        }

}







module.exports = {

    getSelectAllGeneros,
    getSelectByIdGenero,
    getSelectLastID,
    setInsertGenero,
    setUpdateGenero,
    setDeleteGenero

}