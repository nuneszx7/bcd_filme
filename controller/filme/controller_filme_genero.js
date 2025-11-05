/***************************************************************************************************** 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e MODEL para o CRUD na relação entre filme e generos
* Data: 05/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
****************************************************************************************************/

//Import da model do DAO do genero
const filmeGeneroDAO = require('../../model/DAO/filme_genero.js')

//Import do arquivo de mensagens
const MESSAGES = require('../modulo/config_messages.js')

//Função que retorna uma lista de todos os generos
const listarFilmesGeneros = async function () {
    //Chama a função do DAO para retornar a lista de generos do Banco de Dados
    let resultFilmesGeneros = await filmeGeneroDAO.getSelectAllFilmesGeneros()
    // Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    if (resultFilmesGeneros) {
        if (resultGenero.length > 0) {
            MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
            MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
            MESSAGES.DEFAULT_HEADER.items.filmes_generos = resultFilmesGeneros

            return MESSAGES.DEFAULT_HEADER //200
        } else {
            return MESSAGES.ERROR_NOT_FOUND // 404
        }
    } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
    }
}

//Função para buscar um genero pesquisando pelo seu ID
const buscarFilmeGeneroId = async function (id) {

    try {

        //Criando um objeto novo para as mensagens
        let MESSAGES = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

        //se for ao contrario do falso, entra e continua o fluxo

        //Validação da chegada do ID
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultFilmesGeneros = await generoDAO.getSelectByIdFilmeGenero(Number(id))

            if (resultFilmesGeneros) {
                if (resultGenero.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    MMESSAGES.DEFAULT_HEADER.items.filme_genero = resultFilmesGeneros

                    return MESSAGES; //200
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
const inserirFilmeGenero = async function (filmeGenero, contentType) {

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    try {

        //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do genero
            let validar = await validarDadosFilmeGenero(filmeGenero)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo genero no Banco de dados
                let resultFilmesGeneros = await filmeGeneroDAO.setInsertFilmeGenero(filmeGenero)

                if (resultFilmesGeneros) {

                    let lastID = await filmeGeneroDAO.getSelectLastID()

                    if(lastID){

                        filmeGenero.id = lastID

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items.filme_genero.id = lastID
    
                        return MESSAGES //201
                    }
                    else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                    }
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
const atualizarFilmeGenero = async function (filmeGenero, id, contentType) {

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(MESSAGES))

    try {

        //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Validação de ID valido, chama a função da controller que verifica no banco de dados se o ID existe e valida o ID
            let validarID = await buscarFilmeGeneroId(id)


            //Chama a função de validar todos os dados do genero
            let validar = await validarDadosFilmeGenero(filmeGenero)

            if (!validar) {

                //Validação do ID, se caso ele existir no BD


                if (validarID.status_code == 200) {

                    //Adiciona o ID do genero no JSON de dados para ser encaminhado ao DAO
                    filmeGenero.id = Number(id)
                    
                    //Chama a função para inserir um novo genero no Banco de dados
                    let resultFilmesGeneros = await generoDAO.setUpdateFilmeGenero(filmeGenero)

                    if (resultFilmesGeneros) {
                        
                        MESSAGES.DEFAULT_HEADER.status               = MESSAGES.SUCCESS_UPDATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code          = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message              = MESSAGES.SUCCESS_UPDATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items.filme_genero   = resultFilmesGeneros

                        return MESSAGES.DEFAULT_HEADER //200
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarID //A função buscargeneroID poderá retornar (400 ou 404 ou 500)
                }

            } else {
                return validar //400 referente a validação dos Dados
            }

        } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        // console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    } 

}

//Função para deletar um genero
const excluirFilmeGenero = async function (id) {

    try {
        // Validação de ID válido
        let validarID = await buscarFilmeGeneroId(id)

        if (validarID.status_code == 200) {
            // Chama a função do DAO para deletar o genero
            let resultGenero = await generoDAO.setDeleteFilmeGenero(id)

            if (resultGenero) {
                // Retorna a mensagem de sucesso
                return MESSAGES.SUCCESS_DELETED_ITEM // 200
            } else {
                // Retorna erro se o DAO falhar
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        } else {
            // Retorna o erro se o ID não for encontrado ou for inválido
            return validarID
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }


}

//Validação dos dados de cadastro e atualização do genero
const validarDadosFilmeGenero = async function (filmeGenero) {

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(MESSAGES.DEFAULT_HEADER))

    //Validação do tipo de conteúdo da requisição obrigatório ser em jSON, em maiusculo como string
    if(filmeGenero.id_filme <=0 || isNaN(filmeGenero.id_filme == '' || filmeGenero.id_filme == undefined || filmeGenero.id_filme == null || filmeGenero.id_filme.length > 100)) {

        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_filme incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS //400

    } else if(filmeGenero.id_genero <=0 || isNaN(filmeGenero.id_genero == '' || filmeGenero.id_genero == undefined || filmeGenero.id_genero == null || filmeGenero.id_genero.length > 100)) {

        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_genero incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS //400
        
    } else {
        return false
    }
}



module.exports = {

    listarFilmesGeneros,
    buscarFilmeGeneroId,
    inserirFilmeGenero,
    atualizarFilmeGenero,
    excluirFilmeGenero,
    validarDadosFilmeGenero

}