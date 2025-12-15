const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./app.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "API Locadora de Filmes",
        description: "API para gerenciar dados de uma locadora de filmes, incluindo filmes, atores, gêneros, personagens e classificações.",
        contact: {
            name: "João Pedro Teodoro Nunes Correia"
        }
    },
    host: "localhost:8080",
    basePath: "/v1/locadora",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Filme",
            "description": "Endpoints para gerenciar Filmes"
        },
        {
            "name": "Ator",
            "description": "Endpoints para gerenciar Atores"
        },
        {
            "name": "Personagem",
            "description": "Endpoints para gerenciar Personagens"
        },
        {
            "name": "Gênero",
            "description": "Endpoints para gerenciar Gêneros"
        },
        {
            "name": "Classificação",
            "description": "Endpoints para gerenciar Classificações"
        }
    ],
    definitions: {
        Filme: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "O Segredo do Vale" },
            sinopse: { type: "string", example: "Uma aventura misteriosa em um vale escondido." },
            data_lancamento: { type: "string", format: "date", example: "2023-10-26" },
            duracao: { type: "string", example: "02:15:00" },
            orcamento: { type: "number", format: "float", example: 50000000.00 },
            trailer: { type: "string", example: "http://youtube.com/watch?v=trailer" },
            capa: { type: "string", example: "http://example.com/capa.jpg" },
            genero: {
                type: "array",
                items: { $ref: "#/definitions/Genero" }
            }
        },
        Ator: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Tom Holland" },
            data_nascimento: { type: "string", format: "date", example: "1996-06-01" },
            biografia: { type: "string", example: "Ator britânico conhecido por seu papel como Homem-Aranha." },
            id_sexo: { type: "integer", example: 1 }
        },
        Personagem: {
            id_personagem: { type: "integer", example: 1 },
            nome_personagem: { type: "string", example: "Peter Parker" },
            descricao: { type: "string", example: "Um jovem com super-poderes de aranha." },
            objetivo: { type: "string", example: "Proteger a cidade de Nova York." },
            id_ator: { type: "integer", example: 1 }
        },
        Genero: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Aventura" }
        },
        Classificacao: {
            id: { type: "integer", example: 1 },
            sigla: { type: "string", example: "L" },
            descricao: { type: "string", example: "Livre para todos os públicos" },
            icone: { type: "string", example: "http://example.com/livre.png" }
        },
        Error: {
            status: { type: "boolean", example: false },
            status_code: { type: "integer", example: 404 },
            message: { type: "string", example: "Não foram encontrados dados de retorno!" }
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Documentação do Swagger gerada com sucesso!")
    // Inicia o servidor após gerar a documentação
    require('./app.js')
})