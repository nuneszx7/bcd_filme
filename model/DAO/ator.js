/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente aos atores
* Data: 08/12/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

//Import da dependência do Prisma que permite a execução de script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')
//Cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

//Função para retornar uma lista contendo todos os atores no banco de dados
const getSelectAllAtores = async function () {

    try {
        // Script SQL
        let result = await prisma.$queryRaw`SELECT * FROM tbl_ator ORDER BY id DESC`

        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para retornar um ator através de seu ID
const getSelectByIdAtor = async function (id) {

    try {
        //Script SQL
        let result = await prisma.$queryRaw`SELECT * FROM tbl_ator WHERE id = ${id}`

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
const getSelectLastID = async function () {

    try {
        //Script para retornar somente o ultimo ID
        let sql = `select id from tbl_ator order by id desc limit 1`

        //Encaminha para o BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result) && result.length > 0)
            return Number(result[0].id)
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para inserir um ator na tabela
const setInsertAtor = async function (ator) {

    try {
        let result = await prisma.$executeRaw`
        INSERT INTO tbl_ator (
            nome,
            data_nascimento,
            biografia,
            id_sexo
        ) VALUES (
            ${ator.nome},
            ${ator.data_nascimento},
            ${ator.biografia},
            ${ator.id_sexo}
        )`

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para atualizar um ator no banco de dados
const setUpdateAtor = async function (ator) {

    try {
        let result = await prisma.$executeRaw`
            UPDATE tbl_ator SET
                nome               =   ${ator.nome},
                data_nascimento    =   ${ator.data_nascimento},
                biografia          =   ${ator.biografia},
                id_sexo            =   ${ator.id_sexo}
            WHERE id = ${ator.id}`

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para deletar o ator
const setDeleteAtor = async function (id) {

    try {
        let result = await prisma.$executeRaw`DELETE FROM tbl_ator WHERE id = ${id}`

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
    getSelectAllAtores,
    getSelectByIdAtor,
    getSelectLastID,
    setInsertAtor,
    setUpdateAtor,
    setDeleteAtor
}