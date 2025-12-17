/************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados com o BD (insert, update, delete,    *
 * select) da tabela de Diretores                                                               *
 * Autor: João Pedro Teodoro                                                                    *
 * Data de criação: 15/12/2025                                                                  *
 * Versão: 1.0.0                                                                                *
 ************************************************************************************************/

// Import da biblioteca do prisma client
const { PrismaClient } = require('./generated/prisma')

// Instância da classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir um novo diretor no BD
const insertDiretor = async function (dadosDiretor) {
    try {
        let result = await prisma.$executeRaw`
            INSERT INTO tbl_diretor (
                nome,
                data_nascimento,
                biografia,
                id_sexo
            ) values (
                ${dadosDiretor.nome},
                ${dadosDiretor.data_nascimento},
                ${dadosDiretor.biografia},
                ${dadosDiretor.id_sexo}
            )
        `;
        return !!result
    } catch (error) {
        return false
    }
}

// Função para atualizar um diretor no BD
const updateDiretor = async function (dadosDiretor) {
    try {
        let result = await prisma.$executeRaw`
            UPDATE tbl_diretor SET
                nome = ${dadosDiretor.nome},
                data_nascimento = ${dadosDiretor.data_nascimento},
                biografia = ${dadosDiretor.biografia},
                id_sexo = ${dadosDiretor.id_sexo}
            WHERE id = ${dadosDiretor.id}
        `;
        return !!result
    } catch (error) {
        return false
    }
}

// Função para excluir um diretor do BD
const deleteDiretor = async function (id) {
    try {
        // Exclui primeiro os registros na tabela de relacionamento
        await prisma.$executeRaw`DELETE FROM tbl_diretor_filme WHERE id_diretor = ${id}`;
        // Depois exclui o diretor
        let result = await prisma.$executeRaw`DELETE FROM tbl_diretor WHERE id = ${id}`;
        return !!result
    } catch (error) {
        return false
    }
}

// Função para listar todos os diretores do BD
const selectAllDiretores = async function () {
    try {
        let rsDiretores = await prisma.$queryRaw`
            SELECT  d.id, 
                    d.nome, 
                    d.data_nascimento, 
                    d.biografia, 
                    s.sigla AS sexo
            FROM tbl_diretor AS d
            JOIN tbl_sexo AS s ON d.id_sexo = s.id
        `;
        return rsDiretores
    } catch (error) {
        return false
    }
}

// Função para buscar um diretor do BD pelo ID
const selectByIdDiretor = async function (id) {
    try {
        let rsDiretor = await prisma.$queryRaw`
            SELECT  d.id, 
                    d.nome, 
                    d.data_nascimento, 
                    d.biografia, 
                    s.sigla AS sexo
            FROM tbl_diretor AS d
            JOIN tbl_sexo AS s ON d.id_sexo = s.id
            WHERE d.id = ${id}
        `;
        return rsDiretor
    } catch (error) {
        return false
    }
}

// Função para buscar o último ID inserido
const selectLastId = async function () {
    try {
        let sql = `select id from tbl_diretor order by id desc limit 1`;
        let rsId = await prisma.$queryRawUnsafe(sql);
        return rsId
    } catch (error) {
        return false
    }
}

module.exports = {
    insertDiretor,
    updateDiretor,
    deleteDiretor,
    selectAllDiretores,
    selectByIdDiretor,
    selectLastId
}