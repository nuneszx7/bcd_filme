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

//Import da controller de relação entre filme e diretor
const controllerDiretorFilme = require('../../model/DAO/controller_diretor_filme.js');

//Import da controller de classificação
const controllerClassificacao = require('../classificação/controller_classificacao.js');

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js')

//Função que retorna uma lista de todos os filmes
const listarFilmes = async function () {
    //Chama a função do DAO para retornar a lista de filmes do Banco de Dados
    let resultFilmes = await filmeDAO.getSelectAllMovies()
    let filmesJSON = {}

    try {
        if (resultFilmes) {
            if (resultFilmes.length > 0) {

                for (let filme of resultFilmes) {
                    // Adiciona gêneros
                    let resultGeneros = await controllerFilmeGenero.listarGenerosIdFilme(filme.id);
                    if (resultGeneros.status_code == 200) {
                        filme.genero = resultGeneros.items.filme_genero;
                    }

                    // Adiciona diretores
                    let resultDiretores = await controllerDiretorFilme.listarDiretoresPorFilme(filme.id);
                    if (resultDiretores.status_code == 200) {
                        filme.diretor = resultDiretores.diretores;
                    }

                    // Adiciona classificação
                    if (filme.id_classificacao) {
                        let resultClassificacao = await controllerClassificacao.buscarClassificacaoId(filme.id_classificacao);
                        if (resultClassificacao.status_code == 200) {
                            filme.classificacao = resultClassificacao.classificacao;
                        }
                    }
                }

                filmesJSON.status = MESSAGES.SUCESS_REQUEST.status
                filmesJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
                filmesJSON.filmes = resultFilmes

                return filmesJSON
            } else {
                return MESSAGES.ERROR_NOT_FOUND // 404
            }
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }


}

//Função para buscar um filme pesquisando pelo seu ID
const buscarFilmeId = async function (id) {

    try {

        //Validação da chegada do ID
        if (id && !isNaN(id) && id > 0) {
            let resultFilme = await filmeDAO.getSelectByIdMovies(Number(id))

            if (resultFilme) {
                if (resultFilme.length > 0) {
                    let filme = resultFilme[0];

                    // Adiciona gêneros
                    let resultGeneros = await controllerFilmeGenero.listarGenerosIdFilme(filme.id);
                    if (resultGeneros.status_code == 200) {
                        filme.genero = resultGeneros.items.filme_genero;
                    }

                    // Adiciona diretores
                    let resultDiretores = await controllerDiretorFilme.listarDiretoresPorFilme(filme.id);
                    if (resultDiretores.status_code == 200) {
                        filme.diretor = resultDiretores.diretores;
                    }

                    // Adiciona classificação
                    if (filme.id_classificacao) {
                        let resultClassificacao = await controllerClassificacao.buscarClassificacaoId(filme.id_classificacao);
                        if (resultClassificacao.status_code == 200) {
                            filme.classificacao = resultClassificacao.classificacao;
                        }
                    }

                    let filmeJSON = {};
                    filmeJSON.status = MESSAGES.SUCESS_REQUEST.status
                    filmeJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    filmeJSON.filme = filme

                    return filmeJSON; //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }

        } else {
            return MESSAGES.ERROR_INVALID_ID; //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Função que insere um filme
const inserirFilme = async function (filme, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return MESSAGES.ERROR_CONTENT_TYPE; //415
        }

        //Chama a função de validar todos os dados do filme
        let validar = await validarDadosFilme(filme)

        if (!validar) {

            //Processamento
            //Chama a função para inserir um novo filme no Banco de dados
            let resultFilme = await filmeDAO.setInsertMovies(filme)

            if (resultFilme) { // Verifica se a inserção do filme principal funcionou

                //chama a função para receber o ID gerado no BD
                let lastID = await filmeDAO.getSelectLastID()

                if (lastID) {

                    // Processar a inserção dos dados na tabela de relação entre filme e genero
                    if (filme.genero && filme.genero.length > 0) {
                        for (let genero of filme.genero) {
                            //Cria o JSON com o ID do filme e o ID do genero
                            let filmeGenero = { id_filme: lastID, id_genero: genero.id }

                            //Encaminha o JSON com o ID do filme e do genero para a controller FilmeGenero
                            let resultFilmeGenero = await controllerFilmeGenero.inserirFilmeGenero(filmeGenero, contentType)
                            // console.log(resultFilmeGenero)

                            if (resultFilmeGenero.status_code != 201) {
                                return MESSAGES.ERROR_RELATIONAL_INSERTION //500
                            }
                        }
                    }

                    // Processar a inserção dos dados na tabela de relação entre filme e diretor
                    if (filme.diretor && filme.diretor.length > 0) {
                        for (let diretor of filme.diretor) {
                            let diretorFilme = { id_filme: lastID, id_diretor: diretor.id };
                            let resultDiretorFilme = await controllerDiretorFilme.inserirDiretorFilme(diretorFilme, contentType);
                            if (resultDiretorFilme.status_code != 201) {
                                return MESSAGES.ERROR_RELATIONAL_INSERTION; //500
                            }
                        }
                    }

                    let filmeJSON = {};
                    //Adiciona o ID no JSON com os dados do filme
                    filme.id = lastID
                    filmeJSON.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                    filmeJSON.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                    filmeJSON.message = MESSAGES.SUCCESS_CREATED_ITEM.message

                    //Adicionar no JSON dados do GENERO
                    //Apaga o atributo genero apenas com os ids que foram enviados no post
                    delete filme.genero

                    //pesquisa no BD todos os generos que foram associados ao filme
                    let resultDadosGeneros = await controllerFilmeGenero.listarGenerosIdFilme(lastID)

                    //cria novamente o atributo genero e coloca o resultado 
                    filme.genero = resultDadosGeneros.items.filmeGenero

                    // Adicionar no JSON dados do DIRETOR
                    delete filme.diretor;
                    let resultDadosDiretores = await controllerDiretorFilme.listarDiretoresPorFilme(lastID);
                    if (resultDadosDiretores.status_code === 200) {
                        filme.diretor = resultDadosDiretores.diretores;
                    }

                    // Adicionar no JSON dados da CLASSIFICAÇÃO
                    if (filme.id_classificacao) {
                        let resultDadosClassificacao = await controllerClassificacao.buscarClassificacaoId(filme.id_classificacao);
                        if (resultDadosClassificacao.status_code === 200) {
                            filme.classificacao = resultDadosClassificacao.classificacao;
                        }
                    }

                    filmeJSON.filme = filme

                    return filmeJSON //201

                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }

            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500 
            }
        } else {
            return validar; //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para atualizar um filme buscando pelo ID
const atualizarFilme = async function (filme, id, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return MESSAGES.ERROR_CONTENT_TYPE; //415
        }

        if (!id || isNaN(id) || id <= 0) {
            return MESSAGES.ERROR_INVALID_ID;
        }

        let validarID = await filmeDAO.getSelectByIdMovies(id);
        if (!validarID || validarID.length === 0) {
            return MESSAGES.ERROR_NOT_FOUND; //404
        }

        let validar = await validarDadosFilme(filme);
        if (validar) {
            return validar; //400
        }

        filme.id = Number(id);

        // Atualiza os dados do filme
        let resultFilme = await filmeDAO.setUpdateMovies(filme);

        if (resultFilme) {
            // Atualiza gêneros
            await controllerFilmeGenero.excluirFilmeGeneroPorFilme(id);
            if (filme.genero && filme.genero.length > 0) {
                for (let genero of filme.genero) {
                    let filmeGenero = { id_filme: id, id_genero: genero.id };
                    await controllerFilmeGenero.inserirFilmeGenero(filmeGenero, contentType);
                }
            }

            // Atualiza diretores
            await controllerDiretorFilme.excluirDiretorFilmePorFilme(id);
            if (filme.diretor && filme.diretor.length > 0) {
                for (let diretor of filme.diretor) {
                    let diretorFilme = { id_filme: id, id_diretor: diretor.id };
                    await controllerDiretorFilme.inserirDiretorFilme(diretorFilme, contentType);
                }
            }

            // Busca o filme atualizado para retornar
            let filmeAtualizado = await buscarFilmeId(id);

            let filmeJSON = {
                status: MESSAGES.SUCCESS_UPDATED_ITEM.status,
                status_code: MESSAGES.SUCCESS_UPDATED_ITEM.status_code,
                message: MESSAGES.SUCCESS_UPDATED_ITEM.message,
                filme: filmeAtualizado.filme
            };

            return filmeJSON; //200
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }

    } catch (error) {
        // console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Função para deletar um filme
const excluirFilme = async function (id) {

    try {
        // Validação de ID válido
        let validarID = await buscarFilmeId(id);

        if (validarID.status_code == 200) {
            // Primeiro, deleta todas as relações na tabela filme_genero
            const resultFilmeGenero = await controllerFilmeGenero.excluirFilmeGeneroPorFilme(id);

            // Deleta todas as relações na tabela diretor_filme
            await controllerDiretorFilme.excluirDiretorFilmePorFilme(id);

            // Verifica se as relações foram deletadas ou se não existiam
            if (resultFilmeGenero) {
                // Agora, chama a função do DAO para deletar o filme
                let resultFilme = await filmeDAO.setDeleteMovies(id);

                if (resultFilme) {
                    // Retorna a mensagem de sucesso
                    return MESSAGES.SUCCESS_DELETED_ITEM; // 200
                } else {
                    // Retorna erro se o DAO do filme falhar
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
                }
            } else {
                // Retorna erro se a exclusão das relações falhar
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500 
            }
        } else {
            // Retorna o erro se o ID não for encontrado ou for inválido
            return validarID;
        }

    } catch (error) {
        console.log(error);
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