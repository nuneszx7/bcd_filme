/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de classificação indicativa do filme
* Data: 12/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

//Import da dependência do Prisma que permite a execução de script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')
//Cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient();

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


module.exports = {

    getSelectAllClassificacoes

}