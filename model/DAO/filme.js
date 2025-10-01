/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente ao filme
* Data: 01/10/2025
* Autor: Marcel
* Versão: 1.0
************************************************************************************************/

/*
    Exemplos de dependências para conexão com o banco de dados

    Bancos de dados relacionais
        Sequelize   -> Foi utilizado em muitos projetos desde o inicio do node
        Prisma      -> É uma dependência atual que trabalha com banco de dados (MySQL, PostgreSQL, SQL Server) (SQL ou ORM)
        Knex        -> É uma dependência atual que trabalha com MySQL

    Bancos não relacionais
        Mongoose    -> É uma dependência para o MongoDB (Não relacional)
*/

    //$queryRawUnsafe()     -> permite executar um script SQL de uma variável e que retorna valores do banco (SELECT)
    //$executeRawUnsafe()   -> permite executar um script SQL de uma variavel e que NÃO retorna dados do banco (INSERT, UPDATE E DELETE)
    //$queryRaw()           ->Permite executar um script SQL SEM estar em uma variável e que retorna valores do banco (SELECT) e faz tratamentos de segurança contra SQL Injection
    //$executeRaw()         -> Permite executar um script SQL SEM estar em uma variável e que retorna valores do banco (INSERT, UPDATE E DELETE) e faz tratamentos de segurança contra SQL Injection

//Import da dependência do Prisma que permite a execução de script SQL no banco de dados
const {PrismaClient} = require('@prisma/client')
//Cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

//Função para retornar uma lista contendo todos os filmes no banco de dados
const getSelectAllMovies = async function(){

    try {        
    //Script SQL
    let sql = `SELECT * FROM tbl_filme order by id desc`

    //Encaminha para o banco de dados o script SQL
    let result = await prisma.$queryRawUnsafe(sql)

    if(result.length > 0)
        return result 
    else
        return false

    } catch (error) {
        // console.log(error)
        return false  
    }

}

//Função para retornar um filme filtrando pelo ID no banco de dados
const getSelectByIdMovies = async function(id){



}

//Insere um filme novo no banco de dados
const setInsertMovies = async function(){

}

//Altera um filme no banco de dados
const setUpdateMovies = async function(id){

}

//Deleta um filme pelo ID no banco de dados
const setDeleteMovies = async function(id){

}

module.exports = {

    getSelectAllMovies,
    getSelectByIdMovies,
    setInsertMovies,
    setUpdateMovies,
    setDeleteMovies

}