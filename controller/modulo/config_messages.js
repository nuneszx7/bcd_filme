/************************************************************************************************************************************************* 
* Objetivo: Arquivo responsável pelos padrões de mensagens que o projeto irá realizar, sempre no formato JSON (Mensagens de erro, sucesso, etc)
* Data: 07/10/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
*************************************************************************************************************************************************/
/**********************************************************   MENSAGENS PADRONIZADAS   ******************************************************/

const data_atual = new Date()


const DEFAULT_HEADER    =   {development: 'João Pedro Teodoro Nunes Correia',
                            api_description: 'API para manipular dados de Filmes',
                            // A data e hora devem ser geradas no momento da requisição
                            status: Boolean,
                            status_code: Number,
                            request_date: data_atual.toString(),
                            items: {}
                            }


/****************************MENSAGENS DE SUCESSO************** */
const SUCESS_REQUEST = {status: true, status_code: 200, message: 'Requisição bem sucedida'}
const SUCCESS_CREATED_ITEM = {status: true, status_code: 201, message: 'Item criado com sucesso!!'}

/************************MENSAGENS DE ERR0******************** */

const ERROR_NOT_FOUND = {
    status: false,
    status_code: 404,
    message: 'Não foram encontrados dados de retorno!',
}

const ERROR_CONTENT_TYPE = {
    status: false,
    status_code: 415,
    message: 'Não foi possível processar a requisição, pois o tipo de dados enviado no corpo deve ser JSON!!'
}

const ERROR_INTERNAL_SERVER_MODEL = {
    status: false,
    status_code: 500,
    message: 'Não foi possível processar a requisição devido a um erro interno do servidor! (Model)',
}

const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: false,
    status_code: 500,
    message: 'Não foi possível processar a requisição devido a um erro interno do servidor! (Controller)',
}

const ERROR_REQUIRED_FIELDS = {
    status: false,
    status_code: 400,
    message: 'Não foi possível processar a requisição pois existem campos obrigatórios que devem ser encaminhados ou estão incorretos!'
}

module.exports = {
    DEFAULT_HEADER,
    SUCESS_REQUEST,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_REQUIRED_FIELDS,
    SUCCESS_CREATED_ITEM,
    ERROR_CONTENT_TYPE
}   