/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD de generos
* Data: 05/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
****************************************************************************************************/

//Import da model do DAO do genero
const generoDAO = require('../../model/DAO/genero.js')

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js')

//Função que retorna uma lista de todos os generos
const listarGeneros = async function () {
    //Chama a função do DAO para retornar a lista de generos do Banco de Dados
    let resultGenero = await generoDAO.getSelectAllGeneros()
    // Criando um objeto novo para as mensagens
    let generoJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    if (resultGenero) {
        if (resultGenero.length > 0) {
            generoJSON.status = MESSAGES.SUCESS_REQUEST.status
            generoJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
            generoJSON.items.generos = resultGenero
            generoJSON.items.quantidade = resultGenero.length

            return generoJSON
        } else {
            return MESSAGES.ERROR_NOT_FOUND // 404
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
    }
}

//Função para buscar um genero pesquisando pelo seu ID
const buscarGeneroId = async function (id) {

    try {

        //Criando um objeto novo para as mensagens
        let generoJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

        //se for ao contrario do falso, entra e continua o fluxo

        //Validação da chegada do ID
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultGenero = await generoDAO.getSelectByIdGenero(Number(id))

            if (resultGenero) {
                if (resultGenero.length > 0) {
                    generoJSON.status = MESSAGES.SUCESS_REQUEST.status
                    generoJSON.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    generoJSON.items.genero = resultGenero

                    return generoJSON; //200
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

//Função que insere um genero
const inserirGenero = async function (genero, contentType) {

    //Criando um objeto novo para as mensagens
    let generoJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    try {

        //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do genero
            let validar = await validarDadosGenero(genero)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo genero no Banco de dados
                let resultGenero = await generoDAO.setInsertGenero(genero)

                if (resultGenero) {
                    generoJSON.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                    generoJSON.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                    generoJSON.message = MESSAGES.SUCCESS_CREATED_ITEM.message

                    return generoJSON; //201
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

//Função para atualizar um genero buscando pelo ID
const atualizarGenero = async function (genero, id, contentType) {

    //Criando um objeto novo para as mensagens
    let generoJSON = JSON.parse(JSON.stringify(MESSAGES))

    try {

        //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Validação de ID válido, chama a função da controller que verifica no banco de dados se o ID existe e valida o ID
            let validarID = await buscarGeneroId(id)


            //Chama a função de validar todos os dados do genero
            let validar = await validarDadosGenero(genero)

            if (!validar) {

                //Validação do ID, se caso ele existir no BD


                if (validarID.status_code == 200) {

                    //Adiciona o ID do genero no JSON de dados para ser encaminhado ao DAO
                    genero.id = Number(id)
                    
                    //Chama a função para inserir um novo genero no Banco de dados
                    let resultGenero = await generoDAO.setUpdateGenero(genero)

                    if (resultGenero) {
                        // console.log(generoJSON.SUCCESS_UPDATED_ITEM)
                        generoJSON.DEFAULT_HEADER.status          = generoJSON.SUCCESS_UPDATED_ITEM.status
                        generoJSON.DEFAULT_HEADER.status_code     = generoJSON.SUCCESS_UPDATED_ITEM.status_code
                        generoJSON.DEFAULT_HEADER.message         = generoJSON.SUCCESS_UPDATED_ITEM.message
                        generoJSON.DEFAULT_HEADER.items.genero    = genero


                        return generoJSON.DEFAULT_HEADER //200
                    } else {
                        return generoJSON.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarID //A função buscargeneroID poderá retornar (400 ou 404 ou 500)
                }

            } else {
                return validar //400 referente a validação dos Dados
            }

        } else {
            return generoJSON.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        // console.log(error)
        return generoJSON.ERROR_INTERNAL_SERVER_CONTROLLER //500
    } 

}

//Função para deletar um genero
const excluirGenero = async function (id) {

    try {
        // Validação de ID válido
        let validarID = await buscarGeneroId(id);

        if (validarID.status_code == 200) {
            // Chama a função do DAO para deletar o genero
            let resultGenero = await generoDAO.setDeleteGenero(id);

            if (resultGenero) {
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

//Validação dos dados de cadastro e atualização do genero
const validarDadosGenero = async function (genero) {

    //Criando um objeto novo para as mensagens
    let generoJSON = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
    if (genero.nome == '' || genero.nome == undefined || genero.nome == null || genero.nome.length > 100) {

        generoJSON.ERROR_REQUIRED_FIELDS.message += ' [Nome incorreto]'
        return generoJSON.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }
}



module.exports = {

    listarGeneros,
    buscarGeneroId,
    inserirGenero,
    atualizarGenero,
    excluirGenero,

}