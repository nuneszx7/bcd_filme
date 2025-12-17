/************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados com o BD (insert, update, delete,    
 * select) da tabela de idiomas                                                                 
 * Autor: João Pedro Teodoro Nunes correia                                                                   
 * Data de criação: 17/12/2025                                                                  
 * Versão: 1.0.0                                                                                
 ************************************************************************************************/

// Import da biblioteca do prisma client
const { PrismaClient } = require('../../generated/prisma');
// Instância da classe PrismaClient
const prisma = new PrismaClient();

//Função para inserir um novo idioma no banco de dados
const setInsertIdioma = async function (dadosIdioma) {
    try {
        let result = await prisma.$executeRaw`
            INSERT INTO tbl_idioma (nome) VALUES (${dadosIdioma.nome})
        `;
        return !!result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Função para atualizar um idioma existente no banco de dados
const setUpdateIdioma = async function (dadosIdioma) {
    try {
        let result = await prisma.$executeRaw`
            UPDATE tbl_idioma SET nome = ${dadosIdioma.nome} WHERE id = ${dadosIdioma.id}
        `;
        return !!result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Função para excluir um idioma do banco de dados
const setDeleteIdioma = async function (id) {
    try {
        let result = await prisma.$executeRaw`
            DELETE FROM tbl_idioma WHERE id = ${id}
        `;
        return !!result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Função para retornar todos os idiomas do banco de dados
const getSelectAllIdiomas = async function () {
    try {
        let result = await prisma.$queryRaw`SELECT * FROM tbl_idioma ORDER BY nome ASC`;
        return result.length > 0 ? result : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Função para buscar um idioma pelo seu ID
const getSelectByIdIdioma = async function (id) {
    try {
        let result = await prisma.$queryRaw`SELECT * FROM tbl_idioma WHERE id = ${id}`;
        return result.length > 0 ? result : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Função para retornar o último ID inserido na tabela de idiomas
const getSelectLastID = async function () {
    try {
        let sql = `select id from tbl_idioma order by id desc limit 1`;
        let result = await prisma.$queryRawUnsafe(sql);

        if (result && result.length > 0) {
            return Number(result[0].id); 
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    setInsertIdioma,
    setUpdateIdioma,
    setDeleteIdioma,
    getSelectAllIdiomas,
    getSelectByIdIdioma,
    getSelectLastID,
};
