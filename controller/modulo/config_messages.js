/************************************************************************************************************************************************* 
* Objetivo: Arquivo responsável pelos padrões de mensagens que o projeto irá realizar, sempre no formato JSON (Mensagens de erro, sucesso, etc)
* Data: 07/10/2025
* Autor: Marcel
* Versão: 1.0
*************************************************************************************************************************************************/
/**********************************************************   MENSAGENS PADRONIZADAS   ******************************************************/
const MESSAGE_HEADER    =   {development: 'João Pedro Teodoro Nunes Correia',
                            api_description: 'API para manipular dados de Filmes',
                            // A data e hora devem ser geradas no momento da requisição
                            status: Boolean,
                            status_code: Number,
                            items: {}
                            }




/**********************************************************   MENSAGENS DE SUCESSO   ******************************************************/
const MESSAGE_REQUEST_SUCCESS   =   {status: true,
                                    status_code: 200,
                                    message: 'Requisição bem sucedida!!'
                                    }




/**********************************************************   MENSAGENS DE ERRO   ******************************************************/













module.exports = {
    MESSAGE_HEADER,
    MESSAGE_REQUEST_SUCCESS
}