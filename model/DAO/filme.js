/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente ao filme
* Data: 01/10/2025
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

//Função para retornar uma lista contendo todos os filmes no banco de dados
const getSelectAllMovies = async function () {

    try {
        //Script SQL
        // Usando o método seguro $queryRaw com template literals
        let result = await prisma.$queryRaw`SELECT * FROM tbl_filme ORDER BY id DESC`
 
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

//Função para retornar um filme filtrando pelo ID no banco de dados
const getSelectByIdMovies = async function (id) {

    try {

        //Script SQL
        // Usando o método seguro $queryRaw com template literals e passando o 'id' como parâmetro
        let result = await prisma.$queryRaw`SELECT * FROM tbl_filme WHERE id = ${id}`

        
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
        let sql = `select id from tbl_filme order by id desc limit 1`

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

//Insere um filme novo no banco de dados
const setInsertMovies = async function (filme) {

    try {
        // Usando o método seguro $executeRaw com template literals para evitar SQL Injection
        let result = await prisma.$executeRaw`
        INSERT INTO tbl_filme (
            nome,
            sinopse,
            data_lancamento,
            duracao,
            orcamento,
            trailer,
            capa
        ) VALUES (
            ${filme.nome},
            ${filme.sinopse},
            ${filme.data_lancamento},
            ${filme.duracao},
            ${filme.orcamento},
            ${filme.trailer},
            ${filme.capa}
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

//Altera um filme no banco de dados
const setUpdateMovies = async function (filme) {

    try {
        
        let sql =`
        UPDATE tbl_filme SET
            nome               =   '${filme.nome}',
            sinopse            =   '${filme.sinopse}',
            data_lancamento    =   '${filme.data_lancamento}',
            duracao            =   '${filme.duracao}',
            orcamento          =   '${filme.orcamento}',
            trailer            =   '${filme.trailer}',
            capa               =   '${filme.capa}'

            where id = ${filme.id}`

        //executeRawUnsafe() ->
        let result = await prisma.$executeRawUnsafe(sql)



    if (result)
        return true
    else
        return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Deleta um filme pelo ID no banco de dados
const setDeleteMovies = async function (id) {

    try {
        // Usando o método seguro $executeRaw para DELETE
        let result = await prisma.$executeRaw`DELETE FROM tbl_filme WHERE id = ${id}`;

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

    getSelectAllMovies,
    getSelectByIdMovies,
    getSelectLastID,
    setInsertMovies,
    setUpdateMovies,
    setDeleteMovies

}