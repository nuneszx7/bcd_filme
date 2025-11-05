/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de filmes
* Data: 07/10/2025
* Autor: João Pedro Teodoro Nunes Correia
*****************************************************************************************************
* Versão: 1.0 (CRUD Básico do Filme, sem as relações com outras tabelas)
* Versão: 1.1 (CRUD do filme com relacionamento com a tabela gênero)
****************************************************************************************************/

//Import da model do DAO do filme
const filmeDAO = require('../../model/DAO/filme.js')

//Import da controller de relação entre filme e genero
const controllerFilmeGenero = require('./controller_filme_genero.js')

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js')

//Função que retorna uma lista de todos os filmes
const listarFilmes = async function () {
    //Chama a função do DAO para retornar a lista de filmes do Banco de Dados
    let resultFilmes = await filmeDAO.getSelectAllMovies()
    // Criando um objeto novo para as mensagens
    let filmesJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    if (resultFilmes) {
        if (resultFilmes.length > 0) {
            filmesJSON.status = MESSAGES.SUCESS_REQUEST.status
            filmesJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
            filmesJSON.items.filmes = resultFilmes
            filmesJSON.items.quantidade = resultFilmes.length

            return filmesJSON
        } else {
            return MESSAGES.ERROR_NOT_FOUND // 404
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
    }
}

//Função para buscar um filme pesquisando pelo seu ID
const buscarFilmeId = async function (id) {

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
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID Inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Função que insere um filme
const inserirFilme = async function (filme, contentType) {

    //Criando um objeto novo para as mensagens
    let filmeJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    try {

        //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do filme
            let validar = await validarDadosFilme(filme)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo filme no Banco de dados
                let resultFilme = await filmeDAO.setInsertMovies(filme)

                if (resultFilme) {

                    let lastID = await filmeDAO.getSelectLastID()

                    if (lastID) {

                        //Processar a inserção dos dados na tabela de relação entre filme e genero
                        filme.genero.forEach(function(genero){

                            let filmeGenero = {id_filme: lastID, id_genero: genero.id}

                        })

                        //Adiciona o ID no JSON com os dados do filme
                        filme.id = lastID
                        filmeJSON.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                        filmeJSON.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        filmeJSON.message = MESSAGES.SUCCESS_CREATED_ITEM.message

                    }return filmeJSON //201

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
            return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }

    }

//Função para atualizar um filme buscando pelo ID
const atualizarFilme = async function (filme, id, contentType) {

        //Criando um objeto novo para as mensagens
        let filmeJSON = JSON.parse(JSON.stringify(MESSAGES))

        try {

            //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
            if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

                //Validação de ID válido, chama a função da controller que verifica no banco de dados se o ID existe e valida o ID
                let validarID = await buscarFilmeId(id)


                //Chama a função de validar todos os dados do filme
                let validar = await validarDadosFilme(filme)

                if (!validar) {

                    //Validação do ID, se caso ele existir no BD


                    if (validarID.status_code == 200) {

                        //Adiciona o ID do filme no JSON de dados para ser encaminhado ao DAO
                        filme.id = Number(id)

                        //Chama a função para inserir um novo filme no Banco de dados
                        let resultFilme = await filmeDAO.setUpdateMovies(filme)

                        if (resultFilme) {
                            // console.log(filmeJSON.SUCCESS_UPDATED_ITEM)
                            filmeJSON.DEFAULT_HEADER.status = filmeJSON.SUCCESS_UPDATED_ITEM.status
                            filmeJSON.DEFAULT_HEADER.status_code = filmeJSON.SUCCESS_UPDATED_ITEM.status_code
                            filmeJSON.DEFAULT_HEADER.message = filmeJSON.SUCCESS_UPDATED_ITEM.message
                            filmeJSON.DEFAULT_HEADER.items.filme = filme


                            return filmeJSON.DEFAULT_HEADER //200
                        } else {
                            return filmeJSON.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    } else {
                        return validarID //A função buscarFilmeID poderá retornar (400 ou 404 ou 500)
                    }

                } else {
                    return validar //400 referente a validação dos Dados
                }

            } else {
                return filmeJSON.ERROR_CONTENT_TYPE //415
            }

        } catch (error) {
            // console.log(error)
            return filmeJSON.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }

    }

    //Função para deletar um filme
    const excluirFilme = async function (id) {

        try {
            // Validação de ID válido
            let validarID = await buscarFilmeId(id);

            if (validarID.status_code == 200) {
                // Chama a função do DAO para deletar o filme
                let resultFilme = await filmeDAO.setDeleteMovies(id);

                if (resultFilme) {
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

    //Validação dos dados de cadastro e atualização do filme
    const validarDadosFilme = async function (filme) {

        //Criando um objeto novo para as mensagens
        let filmeJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

        //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
        if (filme.nome == '' || filme.nome == undefined || filme.nome == null || filme.nome.length > 100) {

            filmeJSON.ERROR_REQUIRED_FIELDS.message += ' [Nome incorreto]'
            return filmeJSON.ERROR_REQUIRED_FIELDS //400


            //Validação de todas as entradas de dados
        } else if (filme.sinopse == undefined) {

            filmeJSON.ERROR_REQUIRED_FIELDS.message += ' [Sinopse incorreta]'
            return filmeJSON.ERROR_REQUIRED_FIELDS //400

        } else if (filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {

            filmeJSON.ERROR_REQUIRED_FIELDS.message += ' [Data de lançamento incorreta]'
            return filmeJSON.ERROR_REQUIRED_FIELDS //400

        } else if (filme.duracao == '' || filme.duracao == undefined || filme.duracao == null || filme.duracao.length > 8) {

            filmeJSON.ERROR_REQUIRED_FIELDS.message += ' [Duração incorreta]'
            return filmeJSON.ERROR_REQUIRED_FIELDS //400

        } else if (filme.orcamento == undefined || filme.orcamento == null || filme.orcamento.length > 100 || isNaN(filme.orcamento)) {

            filmeJSON.ERROR_REQUIRED_FIELDS.message += ' [Orçamento incorreto]'
            return filmeJSON.ERROR_REQUIRED_FIELDS //400

        } else if (filme.trailer == undefined || filme.trailer.length > 200) {

            filmeJSON.ERROR_REQUIRED_FIELDS.message += ' [Trailer incorreto]'
            return filmeJSON.ERROR_REQUIRED_FIELDS //400

        } else if (filme.capa == '' || filme.capa == undefined || filme.capa == null || filme.capa.length > 200) {

            filmeJSON.ERROR_REQUIRED_FIELDS.message += ' [Capa incorreta]'
            return filmeJSON.ERROR_REQUIRED_FIELDS //400
        } else {
            return false
        }
    }



    module.exports = {
        listarFilmes,
        buscarFilmeId,
        inserirFilme,
        atualizarFilme,
        excluirFilme,
        validarDadosFilme

    }