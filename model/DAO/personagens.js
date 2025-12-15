/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente aos personagens
* Data: 04/11/2025
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
const prisma = new PrismaClient()

//Função para retornar uma lista contendo todos os personagens no banco de dados
const getSelectAllPersonagens = async function () {

    try {
        // Script SQL
        let result = await prisma.$queryRaw`
            SELECT 
                tbl_personagem.id_personagem, tbl_personagem.nome_personagem, tbl_personagem.descricao, tbl_personagem.objetivo,
                tbl_ator.id AS id_ator, tbl_ator.nome AS nome_ator, tbl_ator.data_nascimento, tbl_ator.biografia
            FROM tbl_personagem
            INNER JOIN tbl_ator ON tbl_ator.id = tbl_personagem.id_ator
            ORDER BY tbl_personagem.id_personagem DESC
        `

        // O prisma.$queryRaw retorna um array
        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para retornar um personagem através de seu ID
const getPersonagemById = async function (id_personagem) {

    try {

        //Script SQL
        let result = await prisma.$queryRaw`
            SELECT 
                tbl_personagem.id_personagem, tbl_personagem.nome_personagem, tbl_personagem.descricao, tbl_personagem.objetivo,
                tbl_ator.id AS id_ator, tbl_ator.nome AS nome_ator, tbl_ator.data_nascimento, tbl_ator.biografia
            FROM tbl_personagem
            INNER JOIN tbl_ator ON tbl_ator.id = tbl_personagem.id_ator
            WHERE tbl_personagem.id_personagem = ${id_personagem}`


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
        let sql = `select id_personagem from tbl_personagem order by id_personagem desc limit 1`

        //Encaminha para o BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return Number(result[0].id_personagem) // Mantido, pois está correto
        else
            return false


    } catch (error) {
        console.log(error) 
        return false
    }

}

//Função para inserir um personagem na tabela
const setInsertPersonagem = async function (personagem) {

    try {
        // Usando o método seguro $executeRaw com template literals para evitar SQL Injection
        let result = await prisma.$executeRaw`
        INSERT INTO tbl_personagem (
            nome_personagem,
            descricao,
            objetivo,
            id_ator
        ) VALUES (
            ${personagem.nome_personagem},
            ${personagem.descricao},
            ${personagem.objetivo},
            ${personagem.id_ator}
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

//Função para atualizar um personagem no banco de dados
const setUpdatePersonagem = async function (personagem) {

    try {
        let result = await prisma.$executeRaw`
        UPDATE tbl_personagem SET
            nome_personagem    =   ${personagem.nome_personagem},
            descricao          =   ${personagem.descricao},
            objetivo           =   ${personagem.objetivo},
            id_ator            =   ${personagem.id_ator}
        WHERE id_personagem = ${personagem.id_personagem}`

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para deletar o personagem
const setDeletePersonagens = async function (id_personagem) {

    try {
        // Usando o método seguro $executeRaw para DELETE
        let result = await prisma.$executeRaw`DELETE FROM tbl_personagem WHERE id_personagem = ${id_personagem}`;

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

    getSelectAllPersonagens,
    getPersonagemById,
    getSelectLastID,
    setInsertPersonagem,
    setUpdatePersonagem,
    setDeletePersonagens

}