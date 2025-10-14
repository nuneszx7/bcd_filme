/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de filmes
* Data: 07/10/2025
* Autor: João Pedro Teodoro Nunes Correia
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
    // Criando um objeto novo para as mensagens
    let filmesJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    if(resultFilmes){
        if(resultFilmes.length > 0){
            filmesJSON.status             = MESSAGES.SUCESS_REQUEST.status
            filmesJSON.status_code        = MESSAGES.SUCESS_REQUEST.status_code
            filmesJSON.items.filmes       = resultFilmes
            filmesJSON.items.quantidade   = resultFilmes.length

            return filmesJSON
        } else {
            return MESSAGES.ERROR_NOT_FOUND; // 404
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
    }
}

//Função para buscar um filme pesquisando pelo seu ID
const buscarFilmeId = async function(id){
    
    try {

        //Criando um objeto novo para as mensagens
        let filmeJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

        //se for ao contrario do falso, entra e continua o fluxo
        
        //Validação da chegada do ID
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultFilme = await filmeDAO.getSelectByIdMovies(Number(id))

            if (resultFilme) {
                if (resultFilme.length > 0) {
                    filmeJSON.status = MESSAGES.SUCESS_REQUEST.status
                    filmeJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    filmeJSON.items.filme = resultFilme

                    return filmeJSON; //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }

        } else {
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Função que insere um filme
const inserirFilme = async function(filme, contentType){
    //Criando um objeto novo para as mensagens
    let filmeJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    try {

        //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            if(filme.nome == '' || filme.nome == undefined || filme.nome == null || filme.nome.length > 100){

                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Nome incorreto]'
                return MESSAGES.ERROR_REQUIRED_FIELDS //400
    
    
            //Validação de todas as entradas de dados
            }else if(filme.sinopse == undefined){
    
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Sinopse incorreta]'
                return MESSAGES.ERROR_REQUIRED_FIELDS //400
    
            }else if(filme.data_lancamento == undefined || filme.data_lancamento.length != 10){
    
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Data de lançamento incorreta]'
                return MESSAGES.ERROR_REQUIRED_FIELDS //400
    
            }else if(filme.duracao == '' || filme.duracao == undefined || filme.duracao == null || filme.duracao.length > 8){
    
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Duração incorreta]'
                return MESSAGES.ERROR_REQUIRED_FIELDS //400
    
            }else if(filme.orcamento == undefined || filme.orcamento == null || filme.orcamento.length > 100 || isNaN(filme.orcamento)){
    
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Orçamento incorreto]'
                return MESSAGES.ERROR_REQUIRED_FIELDS //400
    
            }else if(filme.trailer == undefined || filme.trailer.length > 200){
    
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Trailer incorreto]'
                return MESSAGES.ERROR_REQUIRED_FIELDS //400
    
            }else if(filme.capa == '' || filme.capa == undefined || filme.capa == null || filme.capa.length > 200){
    
                MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Capa incorreta]'
                return MESSAGES.ERROR_REQUIRED_FIELDS //400
            }else{
                //Processamento
                //Chama a função para inserir um novo filme no Banco de dados
                let resultFilme = await filmeDAO.setInsertMovies(filme)
    
                if(resultFilme){
                    filmeJSON.status      = MESSAGES.SUCCESS_CREATED_ITEM.status
                    filmeJSON.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                    filmeJSON.message     = MESSAGES.SUCCESS_CREATED_ITEM.message
    
                    return filmeJSON; //201
                }else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
            
        }else{
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }
       
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

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