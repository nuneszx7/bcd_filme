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
const controller_genero = require('./controller/genero/controller_genero.js');
const controller_filme_genero = require('./controller/filme/controller_filme_genero.js');
const controller_classificacao = require('./controller/classificação/controller_classificacao.js');


//EndPoints para a rota de Filme
// retorna todos os filmes do banco de dados
app.get('/v1/locadora/filme', cors(), async function (request, response) {
    //Chama a função para listar os filmes do banco de dados
    let filme = await controller_filme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)

})

// retorna um filme filtrando pelo seu ID
app.get('/v1/locadora/filme/:id', cors(), async function (request, response) {

    //Recebe o ID encaminhado via parametro na requisição
    let idFilme = request.params.id


    //Chama a função para listar os filmes do BD
    let filme = await controller_filme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

// insere um novo filme no banco de dados
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response) {

    //Recebe os dados do body (corpo) da requisição (caso vc utilizar o bodyParser, é obrigatório ter no EndPoint)
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filme = await controller_filme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)

})

// atualiza um filme existente no banco de dados
app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function (request, response) {

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

    let personagem = await controller_personagem.listarPersonagens()

    response.status(personagem.status_code)
    response.json(personagem)

})

// retorna um personagem filtrando pelo seu ID
app.get('/v1/locadora/personagem/:id', cors(), async function (request, response) {

    //Recebe o ID encaminhado via parametro na requisição
    let idPersonagem = request.params.id
    //Chama a função para listar os personagens do BD
    let personagem = await controller_personagem.buscarPersonagemId(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

// insere um novo personagem no banco de dados
app.post('/v1/locadora/personagem', cors(), bodyParserJSON, async function (request, response) {

    let dadosBody = request.body
    let contentType = request.headers['content-type']
    let personagem = await controller_personagem.inserirPersonagem(dadosBody, contentType)

    response.status(personagem.status_code)
    response.json(personagem)

})

// atualiza um personagem existente no banco de dados
app.put('/v1/locadora/personagem/:id', cors(), bodyParserJSON, async function (request, response) {

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

    //Receber o id do personagem
    let idPersonagem = request.params.id
    //chama a função que deleta o personagem
    let personagem = await controller_personagem.excluirPersonagem(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

// retorna todos os generos do banco de dados
app.get('/v1/locadora/genero', cors(), async function (request, response) {
    //Chama a função para listar os generos do banco de dados
    let genero = await controller_genero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)

})

// retorna um genero filtrando pelo seu ID
app.get('/v1/locadora/genero/:id', cors(), async function (request, response) {

    //Recebe o ID encaminhado via parametro na requisição
    let idGenero = request.params.id

    //Chama a função para buscar o genero pelo ID
    let genero = await controller_genero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

//retorna o(s) genero(s) do filme pesquisando pelo ID do filme
app.get('/v1/locadora/genero/filme/:id', cors(), async function (request, response) {

    let idFilme = request.params.id

    let generos = await controller_filme_genero.listarGenerosIdFilme(idFilme)

    response.status(generos.status_code)
    response.json(generos)

})

// insere um novo genero no banco de dados
app.post('/v1/locadora/genero', cors(), bodyParserJSON, async function (request, response) {

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
    let idGenero = request.params.id
    let genero = await controller_genero.excluirGenero(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})

// Listar todas as classificações
app.get('/v1/locadora/classificacao', cors(), async function (request, response) {

    let classificacao = await controller_classificacao.listarClassificacoes()

    response.status(classificacao.status_code)
    response.json(classificacao)

})
   


app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))