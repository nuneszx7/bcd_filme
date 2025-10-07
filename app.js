/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelas requisições da API da locadora de filmes
* Data: 07/10/2025
* Autor: Marcel
* Versão: 1.0
************************************************************************************************/

const express           = require('express')
const cors              = require('cors')
const bodyParser        = require('body-parser')


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

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))