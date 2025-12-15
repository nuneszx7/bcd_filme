/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de classificação indicativa do filme
* Data: 12/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

//Import da dependência do Prisma que permite a execução de script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')
//Cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

//Função que retorna uma lista contendo todas as classificações
const getSelectAllClassificacoes = async function () {

    try {
        // Script SQL
        // Usando o método seguro $queryRaw com template literals
        let result = await prisma.$queryRaw`SELECT * FROM tbl_classificacao ORDER BY id ASC`

        // O prisma $queryRaw retorna um array, simplificando a verificação

        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para retornar uma classificação quando buscada pelo seu ID
const getSelectByIdClassificacao = async function (id) {

    try {
        //Script
        //Metodo seguro $queryRaw
        let result = await prisma.$queryRaw`SELECT * FROM tbl_classificacao WHERE id = ${id}`

        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        return false        
    }


}

//Função que retorna o ultimo ID gerado no BD
const getSelectLastID = async function (){

    try {
        //Script para retornar somente o ultimo ID
        let sql = `select id from tbl_classificacao order by id desc limit 1`

        //Encaminha para o BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return Number(result[0].id)
        else
            return false

    } catch (error){
        return false
    }

}





module.exports = {

    getSelectAllClassificacoes,
    getSelectByIdClassificacao,
    getSelectLastID,


}