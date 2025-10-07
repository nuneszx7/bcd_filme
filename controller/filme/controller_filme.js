/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de filmes
* Data: 07/10/2025
* Autor: Marcel
* Versão: 1.0
****************************************************************************************************/

//Import da model do DAO do filme
const filmeDAO = require('../../model/DAO/filme.js')

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js')

//Função que retorna uma lista de todos os filmes
const listarFilmes = async function(){
    //Chama a função do DAO para retornar a lista de filmes do Banco de Dados
    let resultFilmes = await filmeDAO.getSelectAllMovies()

    if(resultFilmes){
        if(resultFilmes.lenght > 0){
            MESSAGES.MESSAGE_HEADER.status             = MESSAGES.MESSAGE_REQUEST_SUCCESS.status
            MESSAGES.MESSAGE_HEADER.status_code        = MESSAGES.MESSAGE_REQUEST_SUCCESS.status_code
            MESSAGES.MESSAGE_HEADER.items.filmes       = resultFilmes

            return MESSAGES.MESSAGE_HEADER

        }
    }

}

//Função para buscar um filme pesquisando pelo seu ID
const buscarFilmeId = async function(){



}

//Função que insere um filme
const inserirFilme = async function(filme){



}

//Função para atualizar um filme buscando pelo ID
const atualizarFilme = async function(filme, id){



}

//Função para deletar um filme
const excluirFilme = async function(id){



}

module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme,
    atualizarFilme,
    excluirFilme

}