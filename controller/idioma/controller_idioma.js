/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a MODEL para o CRUD de idiomas
* Data: 17/12/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0.0
****************************************************************************************************/

const idiomaDAO = require('../../model/DAO/idioma.js');
const MESSAGES = require('../modulo/config_messages.js');

const listarIdiomas = async function () {
    let resultIdiomas = await idiomaDAO.getSelectAllIdiomas();
    let idiomasJSON = {};

    if (resultIdiomas) {
        if (resultIdiomas.length > 0) {
            idiomasJSON.status = MESSAGES.SUCESS_REQUEST.status;
            idiomasJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code;
            idiomasJSON.quantidade = resultIdiomas.length;
            idiomasJSON.idiomas = resultIdiomas;
            return idiomasJSON;
        } else {
            return MESSAGES.ERROR_NOT_FOUND;
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
    }
};

const buscarIdiomaId = async function (id) {
    if (!id || isNaN(id) || id <= 0) {
        return MESSAGES.ERROR_INVALID_ID;
    }

    let resultIdioma = await idiomaDAO.getSelectByIdIdioma(id);
    let idiomaJSON = {};

    if (resultIdioma) {
        if (resultIdioma.length > 0) {
            idiomaJSON.status = MESSAGES.SUCESS_REQUEST.status;
            idiomaJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code;
            idiomaJSON.idioma = resultIdioma[0];
            return idiomaJSON;
        } else {
            return MESSAGES.ERROR_NOT_FOUND;
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
    }
};

const inserirIdioma = async function (dadosIdioma, contentType) {
    if (String(contentType).toLowerCase() !== 'application/json') {
        return MESSAGES.ERROR_CONTENT_TYPE;
    }

    if (!dadosIdioma.nome || dadosIdioma.nome.trim() === '' || dadosIdioma.nome.length > 50) {
        return MESSAGES.ERROR_REQUIRED_FIELDS;
    }

    let resultNovoIdioma = await idiomaDAO.setInsertIdioma(dadosIdioma);

    if (resultNovoIdioma) {
        let lastId = await idiomaDAO.getSelectLastID();
        if (lastId) {
            let novoIdiomaJSON = {
                status: MESSAGES.SUCCESS_CREATED_ITEM.status,
                status_code: MESSAGES.SUCCESS_CREATED_ITEM.status_code,
                message: MESSAGES.SUCCESS_CREATED_ITEM.message,
                idioma: {
                    id: lastId,
                    ...dadosIdioma
                }
            };
            return novoIdiomaJSON;
        }
    }
    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
};

const atualizarIdioma = async function (id, dadosIdioma, contentType) {
    if (String(contentType).toLowerCase() !== 'application/json') {
        return MESSAGES.ERROR_CONTENT_TYPE;
    }

    if (!id || isNaN(id) || id <= 0) {
        return MESSAGES.ERROR_INVALID_ID;
    }

    if (!dadosIdioma.nome || dadosIdioma.nome.trim() === '' || dadosIdioma.nome.length > 50) {
        return MESSAGES.ERROR_REQUIRED_FIELDS;
    }

    // Verifica se o idioma existe antes de atualizar
    const idiomaExistente = await idiomaDAO.getSelectByIdIdioma(id);
    if (!idiomaExistente) {
        return MESSAGES.ERROR_NOT_FOUND;
    }

    dadosIdioma.id = id;
    let resultUpdate = await idiomaDAO.setUpdateIdioma(dadosIdioma);

    if (resultUpdate) {
        let idiomaAtualizadoJSON = {
            status: MESSAGES.SUCCESS_UPDATED_ITEM.status,
            status_code: MESSAGES.SUCCESS_UPDATED_ITEM.status_code,
            message: MESSAGES.SUCCESS_UPDATED_ITEM.message,
            idioma: dadosIdioma
        };
        return idiomaAtualizadoJSON;
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
    }
};

const excluirIdioma = async function (id) {
    if (!id || isNaN(id) || id <= 0) {
        return MESSAGES.ERROR_INVALID_ID;
    }

    // Verifica se o idioma existe antes de excluir
    const idiomaExistente = await idiomaDAO.getSelectByIdIdioma(id);
    if (!idiomaExistente) {
        return MESSAGES.ERROR_NOT_FOUND;
    }

    let resultDelete = await idiomaDAO.setDeleteIdioma(id);

    if (resultDelete) {
        return MESSAGES.SUCCESS_DELETED_ITEM;
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
    }
};

module.exports = {
    listarIdiomas,
    buscarIdiomaId,
    inserirIdioma,
    atualizarIdioma,
    excluirIdioma
};
