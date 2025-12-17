/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de atores
* Data: 12/11/2025
* Autor: João Pedro Teodoro Nunes Correia
*****************************************************************************************************
* Versão: 1.0 (CRUD de atores com relação com a tabela filme)
****************************************************************************************************/

//Import da model do DAO do ator
const atorDAO = require('../../model/DAO/ator.js');

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js');

//Função que retorna uma lista de todos os atores
const listarAtores = async function () {
    // Chama a função do DAO para retornar a lista de atores do Banco de Dados
    let resultAtores = await atorDAO.getSelectAllAtores();
    // Criando um objeto novo para as mensagens
    let atorJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER));

    if (resultAtores) {
        if (resultAtores.length > 0) {
            atorJSON.status = MESSAGES.SUCESS_REQUEST.status;
            atorJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code;
            atorJSON.items.atores = resultAtores;
            atorJSON.items.quantidade = resultAtores.length;

            return atorJSON;
        } else {
            return MESSAGES.ERROR_NOT_FOUND; // 404
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
    }
}

//Função para buscar um ator pesquisando por seu ID
const buscarAtorId = async function (id) {

    try {
        //Criando um objeto novo para as mensagens
        let atorJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER));

        //Validação da chegada do ID
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultAtor = await atorDAO.getSelectByIdAtor(Number(id));

            if (resultAtor) {
                if (resultAtor.length > 0) {
                    atorJSON.status = MESSAGES.SUCESS_REQUEST.status;
                    atorJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code;
                    atorJSON.items.ator = resultAtor;

                    return atorJSON; //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND; //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
            }

        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID Inválido]';
            return MESSAGES.ERROR_REQUIRED_FIELDS; //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
}

//Função que insere um ator
const inserirAtor = async function (ator, contentType) {

    //Criando um objeto novo para as mensagens
    let atorJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER));

    try {
        //Validação do tipo de conteúdo da requisição
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do ator
            let validar = await validarDadosAtor(ator);

            if (!validar) {
                //Chama a função para inserir um novo ator no Banco de dados
                let resultAtor = await atorDAO.setInsertAtor(ator);

                if (resultAtor) {
                    let lastID = await atorDAO.getSelectLastID();
                    if (lastID) {
                        ator.id = lastID;
                        atorJSON.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                        atorJSON.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                        atorJSON.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
                        atorJSON.items.ator = ator;
                        return atorJSON; // 201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
                    }
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
                }
            } else {
                return validar; //400
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE; //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
}

//Função para atualizar um ator buscando pelo ID
const atualizarAtor = async function (ator, id, contentType) {

    //Criando um objeto novo para as mensagens
    let atorJSON = JSON.parse(JSON.stringify(MESSAGES));

    try {
        //Validação do tipo de conteúdo da requisição
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Validação de ID válido
            let validarID = await buscarAtorId(id);

            //Chama a função de validar todos os dados do ator
            let validar = await validarDadosAtor(ator);

            if (!validar) {
                //Validação do ID, se caso ele existir no BD
                if (validarID.status_code == 200) {

                    //Adiciona o ID do ator no JSON de dados
                    ator.id = Number(id);

                    //Chama a função para atualizar o ator
                    let resultAtor = await atorDAO.setUpdateAtor(ator);

                    if (resultAtor) {
                        atorJSON.DEFAULT_HEADER.status = atorJSON.SUCCESS_UPDATED_ITEM.status;
                        atorJSON.DEFAULT_HEADER.status_code = atorJSON.SUCCESS_UPDATED_ITEM.status_code;
                        atorJSON.DEFAULT_HEADER.message = atorJSON.SUCCESS_UPDATED_ITEM.message;
                        atorJSON.DEFAULT_HEADER.items.ator = ator;

                        return atorJSON.DEFAULT_HEADER; //200
                    } else {
                        return atorJSON.ERROR_INTERNAL_SERVER_MODEL; //500
                    }
                } else {
                    return validarID; //Poderá retornar (400, 404 ou 500)
                }
            } else {
                return validar; //400 referente a validação dos Dados
            }
        } else {
            return atorJSON.ERROR_CONTENT_TYPE; //415
        }
    } catch (error) {
        return atorJSON.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
}

//Função para deletar um ator
const excluirAtor = async function (id) {

    try {
        // Validação de ID válido
        let validarID = await buscarAtorId(id);

        if (validarID.status_code == 200) {
            // Chama a função do DAO para deletar o ator
            let resultAtor = await atorDAO.setDeleteAtor(id);

            if (resultAtor) {
                // Retorna a mensagem de sucesso
                return MESSAGES.SUCCESS_DELETED_ITEM; // 200
            } else {
                // Retorna erro se o DAO falhar
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
            }
        } else {
            // Retorna o erro se o ID não for encontrado ou for inválido
            return validarID;
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
}

//Validação dos dados de cadastro e atualização do ator
const validarDadosAtor = async function (ator) {

    let erro = JSON.parse(JSON.stringify(MESSAGES.ERROR_REQUIRED_FIELDS));

    if (ator.nome == '' || ator.nome == undefined || ator.nome == null || ator.nome.length > 100) {
        erro.message += ' [Nome incorreto]';
        return erro; //400
    } else if (ator.data_nascimento == undefined || ator.data_nascimento.length != 10) {
        erro.message += ' [Data de nascimento incorreta]';
        return erro; //400
    } else if (ator.biografia == undefined) {
        erro.message += ' [Biografia incorreta]';
        return erro; //400
    } else if (ator.id_sexo == undefined || isNaN(ator.id_sexo) || ator.id_sexo <= 0) {
        erro.message += ' [ID do sexo incorreto]';
        return erro; //400
    } else {
        return false;
    }
}

module.exports = {
    listarAtores,
    buscarAtorId,
    inserirAtor,
    atualizarAtor,
    excluirAtor
};
