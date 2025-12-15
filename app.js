/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelas requisições da API da locadora de filmes
* Data: 07/10/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON = bodyParser.json()

//Retorna a porta do servidor atual ou colocamos uma porta local
const PORT = process.env.PORT || 8080

//Criando uma instancia do express
const app = express()

//Configuração de permissões 
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*') //Servidor de origem da API
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') //Verbos permitidos
    //Carrega as configurações no CORS da API
    app.use(cors())
    next()  //Próximo, carregar os próximos EndPoints
})

//Import das controllers
const controller_filme = require('./controller/filme/controller_filme.js')
const controller_personagem = require('./controller/personagem/controller_personagem.js');
const controller_genero = require('./controller/genero/controller_genero.js')
const controller_filme_genero = require('./controller/filme/controller_filme_genero.js')
const controller_ator = require('./controller/ator/controller_ator.js')
const controller_classificacao = require('./controller/classificação/controller_classificacao.js')

// Import para o Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')

// Endpoint para a documentação
app.use('/v1/locadora/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))


//EndPoints para a rota de Filme
// retorna todos os filmes do banco de dados
app.get('/v1/locadora/filme', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Filme']
        #swagger.summary = 'Listar todos os filmes'
        #swagger.description = 'Endpoint para listar todos os filmes cadastrados.'
        #swagger.responses[200] = {
            description: 'Sucesso',
            schema: [{ $ref: '#/definitions/Filme' }]
        }
        #swagger.responses[404] = { description: 'Não encontrado', schema: { $ref: '#/definitions/Error' } }
        #swagger.responses[500] = { description: 'Erro interno', schema: { $ref: '#/definitions/Error' } }
    */

    //Chama a função para listar os filmes do banco de dados
    let filme = await controller_filme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)

})

// retorna um filme filtrando pelo seu ID
app.get('/v1/locadora/filme/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Filme']
        #swagger.summary = 'Buscar filme por ID'
        #swagger.description = 'Endpoint para buscar um filme pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID do filme', type: 'integer', required: true }
        #swagger.responses[200] = {
            description: 'Sucesso',
            schema: { $ref: '#/definitions/Filme' }
        }
        #swagger.responses[400] = { description: 'ID inválido', schema: { $ref: '#/definitions/Error' } }
        #swagger.responses[404] = { description: 'Não encontrado', schema: { $ref: '#/definitions/Error' } }
    */

    //Recebe o ID encaminhado via parametro na requisição
    let idFilme = request.params.id


    //Chama a função para listar os filmes do BD
    let filme = await controller_filme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

// insere um novo filme no banco de dados
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Filme']
        #swagger.summary = 'Inserir um novo filme'
        #swagger.description = 'Endpoint para cadastrar um novo filme.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados do filme',
            required: true,
            schema: { $ref: '#/definitions/Filme' }
        }
        #swagger.responses[201] = { description: 'Criado com sucesso', schema: { $ref: '#/definitions/Filme' } }
    */

    //Recebe os dados do body (corpo) da requisição (caso vc utilizar o bodyParser, é obrigatório ter no EndPoint)
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filme = await controller_filme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)

})

// atualiza um filme existente no banco de dados
app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Filme']
        #swagger.summary = 'Atualizar um filme'
        #swagger.description = 'Endpoint para atualizar os dados de um filme existente.'
        #swagger.parameters['id'] = { description: 'ID do filme', type: 'integer', required: true }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados para atualização',
            required: true,
            schema: { $ref: '#/definitions/Filme' }
        }
        #swagger.responses[200] = { description: 'Atualizado com sucesso', schema: { $ref: '#/definitions/Filme' } }
    */

    //Recebe o id do filme
    let idFilme = request.params.id

    //Recebe os dados a serem atualizados
    let dadosBody = request.body

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Chama a função para atualizar o filme, e encaminha os dados, o id e o contentType
    let filme = await controller_filme.atualizarFilme(dadosBody, idFilme, contentType)
    // console.log(filme)

    response.status(filme.status_code)
    response.json(filme)

})

// deleta um filme existente no banco de dados
app.delete('/v1/locadora/filme/:id', cors(), async function (request, response){
    /*
        #swagger.tags = ['Filme']
        #swagger.summary = 'Excluir um filme'
        #swagger.description = 'Endpoint para excluir um filme pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID do filme', type: 'integer', required: true }
        #swagger.responses[200] = { description: 'Excluído com sucesso' }
    */

    //receber o id do filme
    let idFilme = request.params.id

    //Chama a função para deletar o filme
    let filme = await controller_filme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)

})

//EndPoints para a rota de Personagem

// retorna todos os personagens do banco de dados
app.get('/v1/locadora/personagem', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Personagem']
        #swagger.summary = 'Listar todos os personagens'
        #swagger.description = 'Endpoint para listar todos os personagens.'
        #swagger.responses[200] = { schema: [{ $ref: '#/definitions/Personagem' }] }
    */

    let personagem = await controller_personagem.listarPersonagens()

    response.status(personagem.status_code)
    response.json(personagem)

})

// retorna um personagem filtrando pelo seu ID
app.get('/v1/locadora/personagem/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Personagem']
        #swagger.summary = 'Buscar personagem por ID'
        #swagger.description = 'Endpoint para buscar um personagem pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID do personagem', type: 'integer', required: true }
        #swagger.responses[200] = { schema: { $ref: '#/definitions/Personagem' } }
    */

    //Recebe o ID encaminhado via parametro na requisição
    let idPersonagem = request.params.id
    //Chama a função para listar os personagens do BD
    let personagem = await controller_personagem.buscarPersonagemId(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

// insere um novo personagem no banco de dados
app.post('/v1/locadora/personagem', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Personagem']
        #swagger.summary = 'Inserir um novo personagem'
        #swagger.description = 'Endpoint para cadastrar um novo personagem.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados do personagem',
            required: true,
            schema: { $ref: '#/definitions/Personagem' }
        }
    */

    let dadosBody = request.body
    let contentType = request.headers['content-type']
    let personagem = await controller_personagem.inserirPersonagem(dadosBody, contentType)

    response.status(personagem.status_code)
    response.json(personagem)

})

// atualiza um personagem existente no banco de dados
app.put('/v1/locadora/personagem/:id', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Personagem']
        #swagger.summary = 'Atualizar um personagem'
        #swagger.description = 'Endpoint para atualizar os dados de um personagem.'
        #swagger.parameters['id'] = { description: 'ID do personagem', type: 'integer', required: true }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados para atualização',
            required: true,
            schema: { $ref: '#/definitions/Personagem' }
        }
    */

    //recebe o id do personagem
    let idPersonagem = request.params.id
    //Recebe os dados a serem atualizados
    let dadosBody = request.body
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //chama a funçao que atualiza o personagem
    let personagem = await controller_personagem.atualizarPersonagem(dadosBody, idPersonagem, contentType)

    response.status(personagem.status_code)
    response.json(personagem)
})

// deleta um personagem existente no banco de dados
app.delete('/v1/locadora/personagem/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Personagem']
        #swagger.summary = 'Excluir um personagem'
        #swagger.description = 'Endpoint para excluir um personagem pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID do personagem', type: 'integer', required: true }
        #swagger.responses[200] = { description: 'Excluído com sucesso' }
    */

    //Receber o id do personagem
    let idPersonagem = request.params.id
    //chama a função que deleta o personagem
    let personagem = await controller_personagem.excluirPersonagem(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

// retorna todos os generos do banco de dados
app.get('/v1/locadora/genero', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Gênero']
        #swagger.summary = 'Listar todos os gêneros'
        #swagger.description = 'Endpoint para listar todos os gêneros.'
        #swagger.responses[200] = { schema: [{ $ref: '#/definitions/Genero' }] }
    */
    //Chama a função para listar os generos do banco de dados
    let genero = await controller_genero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)

})

// retorna um genero filtrando pelo seu ID
app.get('/v1/locadora/genero/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Gênero']
        #swagger.summary = 'Buscar gênero por ID'
        #swagger.description = 'Endpoint para buscar um gênero pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID do gênero', type: 'integer', required: true }
        #swagger.responses[200] = { schema: { $ref: '#/definitions/Genero' } }
    */

    //Recebe o ID encaminhado via parametro na requisição
    let idGenero = request.params.id

    //Chama a função para buscar o genero pelo ID
    let genero = await controller_genero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

//retorna o(s) genero(s) do filme pesquisando pelo ID do filme
app.get('/v1/locadora/genero/filme/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Gênero']
        #swagger.summary = 'Listar gêneros de um filme específico'
        #swagger.description = 'Endpoint para listar todos os gêneros associados a um filme pelo ID do filme.'
        #swagger.parameters['id'] = { description: 'ID do filme', type: 'integer', required: true }
        #swagger.responses[200] = { schema: [{ $ref: '#/definitions/Genero' }] }
    */

    let idFilme = request.params.id

    let generos = await controller_filme_genero.listarGenerosIdFilme(idFilme)

    response.status(generos.status_code)
    response.json(generos)

})

// insere um novo genero no banco de dados
app.post('/v1/locadora/genero', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Gênero']
        #swagger.summary = 'Inserir um novo gênero'
        #swagger.description = 'Endpoint para cadastrar um novo gênero.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados do gênero',
            required: true,
            schema: { $ref: '#/definitions/Genero' }
        }
    */

    //Recebe os dados do body (corpo) da requisição
    let dadosBody = request.body

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Chama a função para inserir um novo genero
    let genero = await controller_genero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

// Atualiza um genero existente no banco de dados
app.put('/v1/locadora/genero/:id', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Gênero']
        #swagger.summary = 'Atualizar um gênero'
        #swagger.description = 'Endpoint para atualizar os dados de um gênero.'
        #swagger.parameters['id'] = { description: 'ID do gênero', type: 'integer', required: true }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados para atualização',
            required: true,
            schema: { $ref: '#/definitions/Genero' }
        }
    */

    //Recebe o id do genero
    let idGenero = request.params.id
    //Recebe os dados a serem atualizados
    let dadosBody = request.body
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //chama a funçao que atualiza o genero
    let genero = await controller_genero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)
})

//Deleta um genero existente no banco de dados
app.delete('/v1/locadora/genero/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Gênero']
        #swagger.summary = 'Excluir um gênero'
        #swagger.description = 'Endpoint para excluir um gênero pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID do gênero', type: 'integer', required: true }
        #swagger.responses[200] = { description: 'Excluído com sucesso' }
    */
    let idGenero = request.params.id
    let genero = await controller_genero.excluirGenero(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})

//EndPoints para a rota de Classificação

// Retorna todas as classificações
app.get('/v1/locadora/classificacao', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Classificação']
        #swagger.summary = 'Listar todas as classificações'
        #swagger.description = 'Endpoint para listar todas as classificações indicativas.'
        #swagger.responses[200] = { schema: [{ $ref: '#/definitions/Classificacao' }] }
    */

    let classificacao = await controller_classificacao.listarClassificacoes()

    response.status(classificacao.status_code)
    response.json(classificacao)

})

// Retorna uma classificação pelo ID
app.get('/v1/locadora/classificacao/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Classificação']
        #swagger.summary = 'Buscar classificação por ID'
        #swagger.description = 'Endpoint para buscar uma classificação pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID da classificação', type: 'integer', required: true }
        #swagger.responses[200] = { schema: { $ref: '#/definitions/Classificacao' } }
    */

    let idClassificacao = request.params.id
    let classificacao = await controller_classificacao.buscarClassificacaoId(idClassificacao)

    response.status(classificacao.status_code)
    response.json(classificacao)
})

// Insere uma nova classificação
app.post('/v1/locadora/classificacao', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Classificação']
        #swagger.summary = 'Inserir uma nova classificação'
        #swagger.description = 'Endpoint para cadastrar uma nova classificação.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados da classificação',
            required: true,
            schema: { $ref: '#/definitions/Classificacao' }
        }
    */

    let dadosBody = request.body
    let contentType = request.headers['content-type']
    let classificacao = await controller_classificacao.inserirClassificacao(dadosBody, contentType)

    response.status(classificacao.status_code)
    response.json(classificacao)
})

// Atualiza uma classificação existente
app.put('/v1/locadora/classificacao/:id', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Classificação']
        #swagger.summary = 'Atualizar uma classificação'
        #swagger.description = 'Endpoint para atualizar os dados de uma classificação.'
        #swagger.parameters['id'] = { description: 'ID da classificação', type: 'integer', required: true }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados para atualização',
            required: true,
            schema: { $ref: '#/definitions/Classificacao' }
        }
    */

    let idClassificacao = request.params.id
    let dadosBody = request.body
    let contentType = request.headers['content-type']
    let classificacao = await controller_classificacao.atualizarClassificacao(dadosBody, idClassificacao, contentType)

    response.status(classificacao.status_code)
    response.json(classificacao)
})

// Deleta uma classificação existente
app.delete('/v1/locadora/classificacao/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Classificação']
        #swagger.summary = 'Excluir uma classificação'
        #swagger.description = 'Endpoint para excluir uma classificação pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID da classificação', type: 'integer', required: true }
        #swagger.responses[200] = { description: 'Excluído com sucesso' }
    */

    let idClassificacao = request.params.id
    let classificacao = await controller_classificacao.excluirClassificacao(idClassificacao)

    response.status(classificacao.status_code)
    response.json(classificacao)

})
   
//EndPoints para a rota de Ator

// retorna todos os atores do banco de dados
app.get('/v1/locadora/ator', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Ator']
        #swagger.summary = 'Listar todos os atores'
        #swagger.description = 'Endpoint para listar todos os atores.'
        #swagger.responses[200] = { schema: [{ $ref: '#/definitions/Ator' }] }
    */

    let ator = await controller_ator.listarAtores()

    response.status(ator.status_code)
    response.json(ator)

})

// retorna um ator filtrando pelo seu ID
app.get('/v1/locadora/ator/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Ator']
        #swagger.summary = 'Buscar ator por ID'
        #swagger.description = 'Endpoint para buscar um ator pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID do ator', type: 'integer', required: true }
        #swagger.responses[200] = { schema: { $ref: '#/definitions/Ator' } }
    */

    //Recebe o ID encaminhado via parametro na requisição
    let idAtor = request.params.id
    //Chama a função para listar os atores do BD
    let ator = await controller_ator.buscarAtorId(idAtor)

    response.status(ator.status_code)
    response.json(ator)
})

// insere um novo ator no banco de dados
app.post('/v1/locadora/ator', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Ator']
        #swagger.summary = 'Inserir um novo ator'
        #swagger.description = 'Endpoint para cadastrar um novo ator.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados do ator',
            required: true,
            schema: { $ref: '#/definitions/Ator' }
        }
    */

    let dadosBody = request.body
    let contentType = request.headers['content-type']
    let ator = await controller_ator.inserirAtor(dadosBody, contentType)

    response.status(ator.status_code)
    response.json(ator)

})

// atualiza um ator existente no banco de dados
app.put('/v1/locadora/ator/:id', cors(), bodyParserJSON, async function (request, response) {
    /*
        #swagger.tags = ['Ator']
        #swagger.summary = 'Atualizar um ator'
        #swagger.description = 'Endpoint para atualizar os dados de um ator.'
        #swagger.parameters['id'] = { description: 'ID do ator', type: 'integer', required: true }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Dados para atualização',
            required: true,
            schema: { $ref: '#/definitions/Ator' }
        }
    */

    //recebe o id do ator
    let idAtor = request.params.id
    //Recebe os dados a serem atualizados
    let dadosBody = request.body
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //chama a funçao que atualiza o ator
    let ator = await controller_ator.atualizarAtor(dadosBody, idAtor, contentType)

    response.status(ator.status_code)
    response.json(ator)
})

// deleta um ator existente no banco de dados
app.delete('/v1/locadora/ator/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Ator']
        #swagger.summary = 'Excluir um ator'
        #swagger.description = 'Endpoint para excluir um ator pelo seu ID.'
        #swagger.parameters['id'] = { description: 'ID do ator', type: 'integer', required: true }
        #swagger.responses[200] = { description: 'Excluído com sucesso' }
    */

    //Receber o id do ator
    let idAtor = request.params.id
    //chama a função que deleta o ator
    let ator = await controller_ator.excluirAtor(idAtor)

    response.status(ator.status_code)
    response.json(ator)
})


app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))