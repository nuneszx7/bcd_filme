/*********************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de personagens
* Data: 04/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

//Import da model do DAO de personagem
const personagemDAO = require('../../model/DAO/personagens.js') 

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js')

//Função que retorna uma lista de todos os personagens
const listarPersonagens = async function () {

    // Chama a função do DAO para retornar a lista de personagens do Banco de Dados
    let resultPersonagens = await personagemDAO.getSelectAllPersonagens()
    // Criando um objeto novo para as mensagens
    let personagemJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    if (resultPersonagens) {
        if (resultPersonagens.length > 0) {
            personagemJSON.status = MESSAGES.SUCESS_REQUEST.status
            personagemJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
            personagemJSON.items.personagens = resultPersonagens
            personagemJSON.items.quantidade = resultPersonagens.length

            return personagemJSON
        } else {
            return MESSAGES.ERROR_NOT_FOUND // 404
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
    }

}

//Função para buscar um personagem pesquisando por seu ID
const buscarPersonagemId = async function (id_personagem) {

    try {

        //Criando um objeto novo para as mensagens
        let personagemJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

        //se for ao contrario do falso, entra e continua o fluxo

        //Validação da chegada do ID
        if (!isNaN(id_personagem) && id_personagem != '' && id_personagem != null && id_personagem > 0) {
            let resultPersonagem = await personagemDAO.getPersonagemById(Number(id_personagem))

            if (resultPersonagem) {
                if (resultPersonagem.length > 0) {
                    personagemJSON.status = MESSAGES.SUCESS_REQUEST.status
                    personagemJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    personagemJSON.items.personagem = resultPersonagem

                    return personagemJSON; //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }

        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID Inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }
    
    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Função que insere personagem
const inserirPersonagem = async function (personagem, contentType) {

    //Criando um objeto novo para as mensagens
    let personagemJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    try {

        //Validação do tipo de conteúdo da requisição obrigatório ser em JSON, em maiusculo como string
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do personagem
            let validar = await validarDadosPersonagem(personagem)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo personagem no Banco de dados
                let resultPersonagem = await personagemDAO.setInsertPersonagem(personagem)

                if (resultPersonagem) {
                    let lastID = await personagemDAO.getSelectLastID();
                    if (lastID) {
                        personagem.id = lastID;
                        personagemJSON.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                        personagemJSON.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                        personagemJSON.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
                        personagemJSON.items.personagem = personagem;
                        return personagemJSON;
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
                    }

                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }

            } else {
                return validar //400

            }

        } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Função para atualizar um personagem buscando pelo ID
const atualizarPersonagem = async function (personagem, id_personagem, contentType) {

    //Criando um objeto novo para as mensagens
    let personagemJSON = JSON.parse(JSON.stringify(MESSAGES))

    try {

        //Validação do tipo de conteúdo da requisição obrigatório ser em JSON, em maiusculo como string
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Validação de ID válido
            let validarID = await buscarPersonagemId(id_personagem)

            //Chama a função de validar todos os dados do filme
            let validar = await validarDadosPersonagem(personagem)

            if (!validar) {

                //Validação do ID, se caso ele existir no BD

                if (validarID.status_code == 200) {

                    //Adiciona o ID do filme no JSON de dados)
                    personagem.id_personagem = Number(id_personagem)

                    //Chama a função para inserir um novo
                    let resultPersonagem = await personagemDAO.setUpdatePersonagem(personagem)

                    if (resultPersonagem) {
                        personagemJSON.DEFAULT_HEADER.status = personagemJSON.SUCCESS_UPDATED_ITEM.status
                        personagemJSON.DEFAULT_HEADER.status_code = personagemJSON.SUCCESS_UPDATED_ITEM.status_code
                        personagemJSON.DEFAULT_HEADER.message = personagemJSON.SUCCESS_UPDATED_ITEM.message
                        personagemJSON.DEFAULT_HEADER.items.personagem = personagem

                        return personagemJSON.DEFAULT_HEADER //200
                    } else {
                        return personagemJSON.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //A função buscarPersonagemID poderá retornar (400 ou 404 ou 500)
                }

            } else {
                return validar //400 referente a validação dos Dados
            }

        } else {
            return personagemJSON.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return personagemJSON.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }

}

//Função responsável por deletar um personagem do BD
const excluirPersonagem = async function (id_personagem) {

    try {
        //Validação de ID
        let validarID = await buscarPersonagemId(id_personagem)

        if (validarID.status_code == 200) {
            //Chama a função do DAO para deletar um personagem
            let resultPersonagem = await personagemDAO.setDeletePersonagens(id_personagem)

            if (resultPersonagem) {
                //Retorna a mensagem de sucesso
                return MESSAGES.SUCCES_DELETED_ITEM //200
            } else {
                //Retorna erro se o DAO falhar
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            //Retorna o erro se o ID não for encontrado ou for inválido
            return validarID
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const validarDadosPersonagem = async function (personagem) {

    //Criando um objeto novo para as mensagens
    let personagemJSON = JSON.parse(JSON.stringify(MESSAGES.ERROR_REQUIRED_FIELDS))

    //Validação do tipo de conteúdo da requisição obrigatório ser em JSON, em maiusculo como string
    if (personagem.nome_personagem == '' || personagem.nome_personagem == undefined || personagem.nome_personagem == null || personagem.nome_personagem.length > 100) {

        personagemJSON.message += ' [Nome incorreto]'
        return personagemJSON //400

    } else {
        return false
    }
}




module.exports = {

    listarPersonagens,
    buscarPersonagemId,
    inserirPersonagem,
    atualizarPersonagem,
    excluirPersonagem,
    validarDadosPersonagem

}