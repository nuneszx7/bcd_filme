/************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de recebimento, tratamento e retorno de dados *
 * entre a API e a model de Diretor                                                             *
 * Autor: João Pedro Teodoro                                                                    *
 * Data de criação: 15/12/2025                                                                  *
 * Versão: 1.0.0                                                                                *
 ************************************************************************************************/

// Import do arquivo de configuração do projeto
const message = require('../module/config.js')

// Import do arquivo DAO para manipular dados do BD
const diretorDAO = require('../model/DAO/diretor.js')

// Função para inserir um novo diretor
const setNovoDiretor = async function (dadosDiretor, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoDiretorJson = {}
            if (dadosDiretor.nome == '' || dadosDiretor.nome == undefined || dadosDiretor.nome == null || dadosDiretor.nome.length > 100 ||
                dadosDiretor.data_nascimento == '' || dadosDiretor.data_nascimento == undefined || dadosDiretor.data_nascimento == null || dadosDiretor.data_nascimento.length != 10 ||
                dadosDiretor.biografia == '' || dadosDiretor.biografia == undefined || dadosDiretor.biografia == null ||
                dadosDiretor.id_sexo == '' || dadosDiretor.id_sexo == undefined || dadosDiretor.id_sexo == null || isNaN(dadosDiretor.id_sexo)
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let validateStatus = true

                if (validateStatus) {
                    let novoDiretor = await diretorDAO.insertDiretor(dadosDiretor)

                    if (novoDiretor) {
                        let idDiretor = await diretorDAO.selectLastId()
                        dadosDiretor.id = Number(idDiretor[0].id)
                        novoDiretorJson.diretor = dadosDiretor
                        novoDiretorJson.status_code = message.SUCCESS_CREATED_ITEM.status_code // 201
                        novoDiretorJson.status = message.SUCCESS_CREATED_ITEM.status
                        novoDiretorJson.message = message.SUCCESS_CREATED_ITEM.message

                        return novoDiretorJson
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB // 500
                    }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500
    }
}

// Função para atualizar um diretor existente
const setAtualizarDiretor = async function (id, dadosDiretor, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let idDiretor = id
            if (idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)) {
                return message.ERROR_INVALID_ID
            } else {
                let diretor = await diretorDAO.selectByIdDiretor(idDiretor)
                if (diretor) {
                    let atualizarDiretorJson = {}
                    if (dadosDiretor.nome == '' || dadosDiretor.nome == undefined || dadosDiretor.nome == null || dadosDiretor.nome.length > 100 ||
                        dadosDiretor.data_nascimento == '' || dadosDiretor.data_nascimento == undefined || dadosDiretor.data_nascimento == null || dadosDiretor.data_nascimento.length != 10 ||
                        dadosDiretor.biografia == '' || dadosDiretor.biografia == undefined || dadosDiretor.biografia == null ||
                        dadosDiretor.id_sexo == '' || dadosDiretor.id_sexo == undefined || dadosDiretor.id_sexo == null || isNaN(dadosDiretor.id_sexo)
                    ) {
                        return message.ERROR_REQUIRED_FIELDS // 400
                    } else {
                        let validateStatus = true

                        if (validateStatus) {
                            let dados = {
                                id: idDiretor,
                                ...dadosDiretor
                            }
                            let diretorAtualizado = await diretorDAO.updateDiretor(dados)

                            if (diretorAtualizado) {
                                atualizarDiretorJson.diretor = dados
                                atualizarDiretorJson.status_code = message.SUCCESS_UPDATED_ITEM.status_code // 200
                                atualizarDiretorJson.status = message.SUCCESS_UPDATED_ITEM.status
                                atualizarDiretorJson.message = message.SUCCESS_UPDATED_ITEM.message

                                return atualizarDiretorJson
                            } else {
                                return message.ERROR_INTERNAL_SERVER_DB // 500
                            }
                        }
                    }
                } else {
                    return message.ERROR_NOT_FOUND // 404
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500
    }
}

// Função para excluir um diretor
const setExcluirDiretor = async function (id) {
    try {
        let idDiretor = id

        if (idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)) {
            return message.ERROR_INVALID_ID
        } else {
            let diretor = await diretorDAO.selectByIdDiretor(idDiretor)

            if (diretor) {
                let result = await diretorDAO.deleteDiretor(idDiretor)

                if (result) {
                    return message.SUCCESS_DELETED_ITEM // 200
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            } else {
                return message.ERROR_NOT_FOUND // 404
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500
    }
}

// Função para listar todos os diretores
const getListarDiretores = async function () {
    try {
        let diretoresJson = {}
        let dadosDiretores = await diretorDAO.selectAllDiretores()

        if (dadosDiretores) {
            if (dadosDiretores.length > 0) {
                diretoresJson.diretores = dadosDiretores
                diretoresJson.quantidade = dadosDiretores.length
                diretoresJson.status_code = 200
                return diretoresJson
            } else {
                return message.ERROR_NOT_FOUND // 404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500
    }
}

// Função para buscar um diretor pelo ID
const getBuscarDiretor = async function (id) {
    try {
        let idDiretor = id
        let diretorJson = {}

        if (idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)) {
            return message.ERROR_INVALID_ID // 400
        } else {
            let dadosDiretor = await diretorDAO.selectByIdDiretor(idDiretor)

            if (dadosDiretor) {
                if (dadosDiretor.length > 0) {
                    diretorJson.diretor = dadosDiretor
                    diretorJson.status_code = 200
                    return diretorJson
                } else {
                    return message.ERROR_NOT_FOUND // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500
    }
}

// Função para buscar diretores de um filme
const getDiretoresByFilme = async function (idFilme) {
    try {
        let id = idFilme
        let diretoresJson = {}

        if (id == '' || id == undefined || isNaN(id)) {
            return message.ERROR_INVALID_ID // 400
        } else {
            let dadosDiretores = await diretorDAO.selectDiretoresByFilme(id)

            if (dadosDiretores) {
                if (dadosDiretores.length > 0) {
                    diretoresJson.diretores = dadosDiretores
                    diretoresJson.status_code = 200
                    return diretoresJson
                } else {
                    return message.ERROR_NOT_FOUND // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500
    }
}

module.exports = {
    setNovoDiretor,
    setAtualizarDiretor,
    setExcluirDiretor,
    getListarDiretores,
    getBuscarDiretor,
    getDiretoresByFilme
}