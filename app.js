/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelas requisições da API da locadora de filmes
* Data: 07/10/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

const express           = require('express')
const cors              = require('cors')
const bodyParser        = require('body-parser')

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON    = bodyParser.json()

//Retorna a porta do servidor atual ou colocamos uma porta local
const PORT = process.env.PORT || 8080

//Criando uma instancia do express
const app = express()

//Configuração de permissões 
app.use((request, response, next)=>{
    response.header('Access-Control-Allow-Origin', '*') //Servidor de origem da API
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') //Verbos permitidos
    //Carrega as configurações no CORS da API
    app.use(cors())
    next()  //Próximo, carregar os próximos EndPoints
})

//Import das controllers
const controller_filme = require('./controller/filme/controller_filme.js')



//EndPoints para a rota de Filme
app.get('/v1/locadora/filme', cors(), async function (request, response){
    //Chama a função para listar os filmes do banco de dados
    let filme = await controller_filme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)

})

app.get('/v1/locadora/filme/:id', cors(), async function (request, response) {

    //Recebe o ID encaminhado via parametro na requisição
    let idFilme = request.params.id


    //Chama a função para listar os filmes do BD
    let filme = await controller_filme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response) {

    //Recebe os dados do body (corpo) da requisição (caso vc utilizar o bodyParser, é obrigatório ter no EndPoint)
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filme = await controller_filme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)

})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))