/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente ao relacionamento entre diretor e filme
* Data: 17/12/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

// insere um novo relacionamento entre diretor e filme
const setInsertDiretorFilme = async function (dados) {
    try {
        let result = await prisma.$executeRaw`
            INSERT INTO tbl_diretor_filme (id_diretor, id_filme) VALUES (${dados.id_diretor}, ${dados.id_filme})
        `;
        return !!result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// deleta os relacionamentos de um filme pelo ID do filme
const setDeleteDiretorFilmeByFilmeId = async function (idFilme) {
    try {
        let result = await prisma.$executeRaw`DELETE FROM tbl_diretor_filme WHERE id_filme = ${idFilme}`;
        return !!result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Retorna os diretores de um filme específico
const getSelectDiretoresByFilme = async function (idFilme) {
    try {
        const result = await prisma.$queryRaw`
            SELECT d.id, d.nome, d.data_nascimento, d.biografia, s.sigla AS sexo
            FROM tbl_diretor_filme AS df
            JOIN tbl_diretor AS d ON d.id = df.id_diretor
            JOIN tbl_sexo AS s ON d.id_sexo = s.id
            WHERE df.id_filme = ${idFilme}
        `;
        return result.length > 0 ? result : false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    setInsertDiretorFilme,
    setDeleteDiretorFilmeByFilmeId,
    getSelectDiretoresByFilme
};