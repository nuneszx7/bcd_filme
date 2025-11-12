/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de classificação do filme
* Data: 12/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
****************************************************************************************************/

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js')

//Import da model do DAO do filme
const classificacaoDAO = require('../../model/DAO/classificacao.js')

//Função para listar todas as classificações disponiveis
const listarClassificacoes = async function (){

    //Chama a função do DAO para retornar a lista de classificações no banco de dados
    let resultClassificacoes = await classificacaoDAO.getSelectAllClassificacoes()
    //Criando um obejto novo para as mensagens
    let MESSAGES_RESULT = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    try {
        if(resultClassificacoes){
            if(resultClassificacoes.length > 0){

                MESSAGES_RESULT.status = MESSAGES.SUCESS_REQUEST.status
                MESSAGES_RESULT.status_code = MESSAGES.SUCESS_REQUEST.status_code
                MESSAGES_RESULT.items.classificacoes = resultClassificacoes

                return MESSAGES_RESULT
            } else {
                return MESSAGES.ERROR_NOT_FOUND //404
            }

        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

module.exports = {

    listarClassificacoes

}