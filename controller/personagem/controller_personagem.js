/*********************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de personagens
* Data: 04/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

//Import da model do DAO de personagem
const personagemDAO = require('../model/DAO/personagem.js')

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js')

//Função que retorna uma lista de todos os personagens
const listarPersonagens = async function () {

    // Chama a função do DAO para retornar a lista de personagens do Banco de Dados
    let resultPersonagens = await personagemDAO.getSelectAllCharacters()
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
    }else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
    }

}









module.exports = {
    listarPersonagens,

}