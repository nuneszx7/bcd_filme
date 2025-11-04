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


//EndPoint para a rota de Filme
app.get('/v1/locadora/filme', cors(), async function (request, response) {
    //Chama a função para listar os filmes do banco de dados
    let filme = await controller_filme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)

})

//EndPoint para localizar um filme pelo seu ID
app.get('/v1/locadora/filme/:id', cors(), async function (request, response) {

    //Recebe o ID encaminhado via parametro na requisição
    let idFilme = request.params.id


    //Chama a função para listar os filmes do BD
    let filme = await controller_filme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

//Endpoint para inserir um novo filme na tabela
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response) {

    //Recebe os dados do body (corpo) da requisição (caso vc utilizar o bodyParser, é obrigatório ter no EndPoint)
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filme = await controller_filme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)

})

//Endpoint para atualizar um filme na tabela
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

//EndPoint para deletar um filme na tabela
app.delete('/v1/locadora/filme/:id', cors(), async function (request, response){

    //receber o id do filme
    let idFilme = request.params.id

    //Chama a função para deletar o filme
    let filme = await controller_filme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)

})

// listar todos os personagens (ok)
app.get('/v1/locadora/personagem', cors(), async function (request, response) {

    let personagem = await controller_personagem.listarPersonagens()

    response.status(personagem.status_code)
    response.json(personagem)

})

//Buscar personagem pelo id (ok)
app.get('/v1/locadora/personagem/:id', cors(), async function (request, response) {

    //Recebe o ID encaminhado via parametro na requisição
    let idPersonagem = request.params.id
    //Chama a função para listar os personagens do BD
    let personagem = await controller_personagem.buscarPersonagemId(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

//Inserir personagem (ok)
app.post('/v1/locadora/personagem', cors(), bodyParserJSON, async function (request, response) {

    let dadosBody = request.body
    let contentType = request.headers['content-type']
    let personagem = await controller_personagem.inserirPersonagem(dadosBody, contentType)

    response.status(personagem.status_code)
    response.json(personagem)

})

//Função para atualizar personagem (tambem buscando pelo id dele) (OK)
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

//Função para deletar personagem
app.delete('/v1/locadora/personagem/:id', cors(), async function (request, response) {

    //Receber o id do personagem
    let idPersonagem = request.params.id
    //chama a função que deleta o personagem
    let personagem = await controller_personagem.excluirPersonagem(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})



app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))