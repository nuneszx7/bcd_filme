/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a MODEL para o CRUD de diretores
* Data: 15/12/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0.0
****************************************************************************************************/

const diretorDAO = require('../../model/DAO/diretor.js')
const MESSAGES = require('../modulo/config_messages.js')

//Função que retorna uma lista de todos os diretores
const listarDiretores = async function () {
    let resultDiretores = await diretorDAO.selectAllDiretores()
    let diretoresJSON = {}

    if (resultDiretores) {
        if (resultDiretores.length > 0) {
            diretoresJSON.status = MESSAGES.SUCESS_REQUEST.status
            diretoresJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
            diretoresJSON.quantidade = resultDiretores.length
            diretoresJSON.diretores = resultDiretores
            return diretoresJSON
        } else {
            return MESSAGES.ERROR_NOT_FOUND
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
    }
}

//Função para buscar um diretor pesquisando pelo seu ID
const buscarDiretorId = async function (id) {
    if (!id || isNaN(id) || id <= 0) {
        return MESSAGES.ERROR_INVALID_ID
    }

    let resultDiretor = await diretorDAO.selectByIdDiretor(id)
    let diretorJSON = {}

    if (resultDiretor) {
        if (resultDiretor.length > 0) {
            diretorJSON.status = MESSAGES.SUCESS_REQUEST.status
            diretorJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
            diretorJSON.diretor = resultDiretor[0]
            return diretorJSON
        } else {
            return MESSAGES.ERROR_NOT_FOUND
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
    }
}

//Função que insere um novo diretor
const inserirDiretor = async function (dadosDiretor, contentType) {
    if (String(contentType).toLowerCase() !== 'application/json') {
        return MESSAGES.ERROR_CONTENT_TYPE
    }

    if (!dadosDiretor.nome || dadosDiretor.nome.trim() === '' || dadosDiretor.nome.length > 100 ||
        !dadosDiretor.data_nascimento || dadosDiretor.data_nascimento.length !== 10 ||
        !dadosDiretor.biografia ||
        !dadosDiretor.id_sexo || isNaN(dadosDiretor.id_sexo)) {
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }

    let resultNovoDiretor = await diretorDAO.insertDiretor(dadosDiretor)

    if (resultNovoDiretor) {
        let lastId = await diretorDAO.selectLastId()
        if (lastId) {
            let novoDiretorJSON = {
                status: MESSAGES.SUCCESS_CREATED_ITEM.status,
                status_code: MESSAGES.SUCCESS_CREATED_ITEM.status_code,
                message: MESSAGES.SUCCESS_CREATED_ITEM.message,
                diretor: { id: lastId, ...dadosDiretor }
            }
            return novoDiretorJSON
        }
    }
    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
}

//Função para atualizar um diretor buscando pelo ID
const atualizarDiretor = async function (dadosDiretor, id, contentType) {
    if (String(contentType).toLowerCase() !== 'application/json') {
        return MESSAGES.ERROR_CONTENT_TYPE
    }

    if (!id || isNaN(id) || id <= 0) {
        return MESSAGES.ERROR_INVALID_ID
    }

    if (!dadosDiretor.nome || dadosDiretor.nome.trim() === '' || dadosDiretor.nome.length > 100 ||
        !dadosDiretor.data_nascimento || dadosDiretor.data_nascimento.length !== 10 ||
        !dadosDiretor.biografia ||
        !dadosDiretor.id_sexo || isNaN(dadosDiretor.id_sexo)) {
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }

    const diretorExistente = await diretorDAO.selectByIdDiretor(id)
    if (!diretorExistente) {
        return MESSAGES.ERROR_NOT_FOUND
    }

    dadosDiretor.id = id
    let resultUpdate = await diretorDAO.updateDiretor(dadosDiretor)

    if (resultUpdate) {
        let diretorAtualizadoJSON = {
            status: MESSAGES.SUCCESS_UPDATED_ITEM.status,
            status_code: MESSAGES.SUCCESS_UPDATED_ITEM.status_code,
            message: MESSAGES.SUCCESS_UPDATED_ITEM.message,
            diretor: dadosDiretor
        }
        return diretorAtualizadoJSON
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
    }
}

//Função para deletar um diretor
const excluirDiretor = async function (id) {
    if (!id || isNaN(id) || id <= 0) {
        return MESSAGES.ERROR_INVALID_ID
    }

    const diretorExistente = await diretorDAO.selectByIdDiretor(id)
    if (!diretorExistente) {
        return MESSAGES.ERROR_NOT_FOUND
    }

    let resultDelete = await diretorDAO.deleteDiretor(id)

    if (resultDelete) {
        return MESSAGES.SUCCESS_DELETED_ITEM
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
    }
}

module.exports = {
    listarDiretores,
    buscarDiretorId,
    inserirDiretor,
    atualizarDiretor,
    excluirDiretor
}