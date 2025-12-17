/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a MODEL para o CRUD de diretor_filme
* Data: 17/12/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0.0
****************************************************************************************************/

const diretorFilmeDAO = require('../../model/DAO/diretor_filme.js');
const MESSAGES = require('../modulo/config_messages.js');

const inserirDiretorFilme = async function (dados, contentType) {
    if (String(contentType).toLowerCase() !== 'application/json') {
        return MESSAGES.ERROR_CONTENT_TYPE;
    }

    if (!dados.id_diretor || !dados.id_filme) {
        return MESSAGES.ERROR_REQUIRED_FIELDS;
    }

    let result = await diretorFilmeDAO.setInsertDiretorFilme(dados);

    if (result) {
        return {
            status: MESSAGES.SUCCESS_CREATED_ITEM.status,
            status_code: MESSAGES.SUCCESS_CREATED_ITEM.status_code,
            message: MESSAGES.SUCCESS_CREATED_ITEM.message,
            item: dados
        };
    }
    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
};

const excluirDiretorFilmePorFilme = async function (idFilme) {
    if (!idFilme || isNaN(idFilme)) {
        return MESSAGES.ERROR_INVALID_ID;
    }

    let result = await diretorFilmeDAO.setDeleteDiretorFilmeByFilmeId(idFilme);

    if (result) {
        return MESSAGES.SUCCESS_DELETED_ITEM;
    }
    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
};

const listarDiretoresPorFilme = async function (idFilme) {
    if (!idFilme || isNaN(idFilme)) {
        return MESSAGES.ERROR_INVALID_ID;
    }

    let resultDiretores = await diretorFilmeDAO.getSelectDiretoresByFilme(idFilme);
    let diretoresJSON = {};

    if (resultDiretores) {
        if (resultDiretores.length > 0) {
            diretoresJSON.status = MESSAGES.SUCESS_REQUEST.status;
            diretoresJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code;
            diretoresJSON.quantidade = resultDiretores.length;
            diretoresJSON.diretores = resultDiretores;
            return diretoresJSON;
        } else {
            return MESSAGES.ERROR_NOT_FOUND;
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
    }
};

module.exports = {
    inserirDiretorFilme,
    excluirDiretorFilmePorFilme,
    listarDiretoresPorFilme
};