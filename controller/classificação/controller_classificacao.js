/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de classificação do filme
* Data: 12/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
****************************************************************************************************/

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js');

//Import da model do DAO do filme
const classificacaoDAO = require('../../model/DAO/classificacao.js');

//Função para listar todas as classificações disponiveis
const listarClassificacoes = async function (){

    //Chama a função do DAO para retornar a lista de classificações no banco de dados
    let resultClassificacoes = await classificacaoDAO.getSelectAllClassificacoes();
    //Criando um obejto novo para as mensagens
    let classificacaoJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER));

    if (resultClassificacoes) {
        if (resultClassificacoes.length > 0) {
            classificacaoJSON.status = MESSAGES.SUCESS_REQUEST.status;
            classificacaoJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code;
            classificacaoJSON.items.classificacoes = resultClassificacoes;
            classificacaoJSON.items.quantidade = resultClassificacoes.length;

            return classificacaoJSON;
        } else {
            return MESSAGES.ERROR_NOT_FOUND; // 404
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
    }
}

//Função para buscar uma classificação pelo ID
const buscarClassificacaoId = async function (id) {
    try {
        let classificacaoJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER));

        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultClassificacao = await classificacaoDAO.getSelectByIdClassificacao(Number(id));

            if (resultClassificacao) {
                if (resultClassificacao.length > 0) {
                    classificacaoJSON.status = MESSAGES.SUCESS_REQUEST.status;
                    classificacaoJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code;
                    classificacaoJSON.items.classificacao = resultClassificacao;

                    return classificacaoJSON; // 200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND; // 404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
            }
        } else {
            let errorMsg = JSON.parse(JSON.stringify(MESSAGES.ERROR_REQUIRED_FIELDS));
            errorMsg.message += ' [ID Inválido]';
            return errorMsg; // 400
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
}

//Função para inserir uma nova classificação
const inserirClassificacao = async function (classificacao, contentType) {
    let classificacaoJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER));

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let erroValidacao = await validarDadosClassificacao(classificacao);

            if (!erroValidacao) {
                let resultClassificacao = await classificacaoDAO.setInsertClassificacao(classificacao);

                if (resultClassificacao) {
                    let lastID = await classificacaoDAO.getSelectLastID();
                    if (lastID) {
                        classificacao.id = lastID;
                        classificacaoJSON.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                        classificacaoJSON.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                        classificacaoJSON.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
                        classificacaoJSON.items.classificacao = classificacao;
                        return classificacaoJSON; // 201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
                    }
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
                }
            } else {
                return erroValidacao; // 400
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
}

//Função para atualizar uma classificação
const atualizarClassificacao = async function (classificacao, id, contentType) {
    let classificacaoJSON = JSON.parse(JSON.stringify(MESSAGES));

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validarID = await buscarClassificacaoId(id);
            let erroValidacao = await validarDadosClassificacao(classificacao);

            if (!erroValidacao) {
                if (validarID.status_code == 200) {
                    classificacao.id = Number(id);
                    let resultClassificacao = await classificacaoDAO.setUpdateClassificacao(classificacao);

                    if (resultClassificacao) {
                        classificacaoJSON.DEFAULT_HEADER.status = classificacaoJSON.SUCCESS_UPDATED_ITEM.status;
                        classificacaoJSON.DEFAULT_HEADER.status_code = classificacaoJSON.SUCCESS_UPDATED_ITEM.status_code;
                        classificacaoJSON.DEFAULT_HEADER.message = classificacaoJSON.SUCCESS_UPDATED_ITEM.message;
                        classificacaoJSON.DEFAULT_HEADER.items.classificacao = classificacao;

                        return classificacaoJSON.DEFAULT_HEADER; // 200
                    } else {
                        return classificacaoJSON.ERROR_INTERNAL_SERVER_MODEL; // 500
                    }
                } else {
                    return validarID;
                }
            } else {
                return erroValidacao; // 400
            }
        } else {
            return classificacaoJSON.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        return classificacaoJSON.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
}

//Função para excluir uma classificação
const excluirClassificacao = async function (id) {
    try {
        let validarID = await buscarClassificacaoId(id);

        if (validarID.status_code == 200) {
            let resultClassificacao = await classificacaoDAO.setDeleteClassificacao(id);

            if (resultClassificacao) {
                return MESSAGES.SUCCESS_DELETED_ITEM; // 200
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
            }
        } else {
            return validarID;
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
}

//Função para validar os dados recebidos
const validarDadosClassificacao = async function (classificacao) {
    let classificacaoJSON = JSON.parse(JSON.stringify(MESSAGES.ERROR_REQUIRED_FIELDS));
    let hasError = false;

    if (classificacao.sigla == '' || classificacao.sigla == undefined || classificacao.sigla == null || classificacao.sigla.length > 5) {
        classificacaoJSON.message += ' [Sigla incorreta]';
        hasError = true;
    }
    if (classificacao.descricao == '' || classificacao.descricao == undefined || classificacao.descricao == null || classificacao.descricao.length > 100) {
        classificacaoJSON.message += ' [Descrição incorreta]';
        hasError = true;
    }
    if (classificacao.icone == '' || classificacao.icone == undefined || classificacao.icone == null || classificacao.icone.length > 200) {
        classificacaoJSON.message += ' [Ícone incorreto]';
        hasError = true;
    }

    if (hasError) {
        return classificacaoJSON; // 400
    } else {
        return false;
    }
}

module.exports = {
    listarClassificacoes,
    buscarClassificacaoId,
    inserirClassificacao,
    atualizarClassificacao,
    excluirClassificacao
};