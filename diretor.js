/************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados com o BD (insert, update, delete,    *
 * select) da tabela de Diretores                                                               *
 * Autor: João Pedro Teodoro                                                                    *
 * Data de criação: 15/12/2025                                                                  *
 * Versão: 1.0.0                                                                                *
 ************************************************************************************************/

// Import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client')

// Instância da classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir um novo diretor no BD
const insertDiretor = async function (dadosDiretor) {
    try {
        const sql = `
            insert into tbl_diretor (
                nome,
                data_nascimento,
                biografia,
                id_sexo
            ) values (
                '${dadosDiretor.nome}',
                '${dadosDiretor.data_nascimento}',
                '${dadosDiretor.biografia}',
                ${dadosDiretor.id_sexo}
            )
        `
        let result = await prisma.$executeRawUnsafe(sql)
        return !!result
    } catch (error) {
        return false
    }
}

// Função para atualizar um diretor no BD
const updateDiretor = async function (dadosDiretor) {
    try {
        const sql = `
            update tbl_diretor set
                nome = '${dadosDiretor.nome}',
                data_nascimento = '${dadosDiretor.data_nascimento}',
                biografia = '${dadosDiretor.biografia}',
                id_sexo = ${dadosDiretor.id_sexo}
            where id = ${dadosDiretor.id}
        `
        let result = await prisma.$executeRawUnsafe(sql)
        return !!result
    } catch (error) {
        return false
    }
}

// Função para excluir um diretor do BD
const deleteDiretor = async function (id) {
    try {
        // Exclui primeiro os registros na tabela de relacionamento
        await prisma.$executeRawUnsafe(`delete from tbl_diretor_filme where id_diretor = ${id}`)
        // Depois exclui o diretor
        const sql = `delete from tbl_diretor where id = ${id}`
        let result = await prisma.$executeRawUnsafe(sql)
        return !!result
    } catch (error) {
        return false
    }
}

// Função para listar todos os diretores do BD
const selectAllDiretores = async function () {
    try {
        const sql = `
            select  d.id, 
                    d.nome, 
                    d.data_nascimento, 
                    d.biografia, 
                    s.sigla as sexo
            from tbl_diretor d
            join tbl_sexo s on d.id_sexo = s.id
        `
        let rsDiretores = await prisma.$queryRawUnsafe(sql)
        return rsDiretores
    } catch (error) {
        return false
    }
}

// Função para buscar um diretor do BD pelo ID
const selectByIdDiretor = async function (id) {
    try {
        const sql = `
            select  d.id, 
                    d.nome, 
                    d.data_nascimento, 
                    d.biografia, 
                    s.sigla as sexo
            from tbl_diretor d
            join tbl_sexo s on d.id_sexo = s.id
            where d.id = ${id}
        `
        let rsDiretor = await prisma.$queryRawUnsafe(sql)
        return rsDiretor
    } catch (error) {
        return false
    }
}

// Função para buscar o último ID inserido
const selectLastId = async function () {
    try {
        const sql = `select cast(last_insert_id() as decimal) as id from tbl_diretor limit 1`
        let rsId = await prisma.$queryRawUnsafe(sql)
        return rsId
    } catch (error) {
        return false
    }
}

// Função para buscar diretores de um filme
const selectDiretoresByFilme = async function (idFilme) {
    try {
        const sql = `
            select d.id, d.nome, d.data_nascimento, d.biografia, s.sigla as sexo
            from tbl_diretor_filme df
            join tbl_diretor d on d.id = df.id_diretor
            join tbl_sexo s on d.id_sexo = s.id
            where df.id_filme = ${idFilme}
        `
        let rsDiretores = await prisma.$queryRawUnsafe(sql)
        return rsDiretores
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
    selectLastId,
    selectDiretoresByFilme
}