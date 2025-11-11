/*********************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente aos relacionamentos entre filmes e generos
* Data: 05/11/2025
* Autor: João Pedro Teodoro Nunes Correia
* Versão: 1.0
************************************************************************************************/

//Import da dependência do Prisma que permite a execução de script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')
//Cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient();


//Função para retornar uma lista contendo todos os filmes e generos no banco de dados
const getSelectAllFilmesGeneros = async function () {

    try {
        //Script SQL
        // Usando o método seguro $queryRaw com template literals
        let result = await prisma.$queryRaw`SELECT * FROM tbl_filme_genero ORDER BY id DESC`
 
        // O prisma.$queryRaw já retorna um array, então a verificação é mais simples
 
        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Função para retornar um genero filtrando pelo ID no banco de dados
const getSelectByIdFilmeGenero = async function (id) {

    try {

        //Script SQL
        // Usando o método seguro $queryRaw com template literals e passando o 'id' como parâmetro
        let result = await prisma.$queryRaw`SELECT * FROM tbl_filme_genero WHERE id = ${id}`

        
        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        // console.log(error)
        return false
    }

}

//Retorna uma lista de generos filtrando pelo id do filme
const getSelectGenerosByIdFilmes = async function (id_filme) {

    try {

        //Script SQL
        // Usando o método seguro $queryRaw com template literals e passando o 'id' como parâmetro
        let result = await prisma.$queryRaw`SELECT tbl_genero.id, tbl_genero.nome 
                                            FROM tbl_filme 
                                                    INNER JOIN tbl_filme_genero 
                                                        ON tbl_filme.id = tbl_filme_genero.id_filme
                                                    INNER JOIN tbl_genero
                                                        ON tbl_genero.id = tbl_filme_genero.id_genero
                                            WHERE tbl_filme.id = ${id_filme}`

        
        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        // console.log(error)
        return false
    }

}

//Retorna uma lista de filmes filtrando pelo id do genero
const getSelectFilmesByIdGeneros = async function (id_genero) {

    try {

        //Script SQL
        // Usando o método seguro $queryRaw com template literals e passando o 'id' como parâmetro
        let result = await prisma.$queryRaw`SELECT tbl_filme.id, tbl_filme.nome 
                                            FROM tbl_filme 
                                                    INNER JOIN tbl_filme_genero 
                                                        ON tbl_filme.id = tbl_filme_genero.id_filme
                                                    INNER JOIN tbl_genero
                                                        ON tbl_genero.id = tbl_filme_genero.id_genero
                                            WHERE tbl_genero.id = ${id_genero}`

        
        if (result.length > 0)
            return result
        else
            return false

    } catch (error) {
        // console.log(error)
        return false
    }

}

//Função que retorna o ultimo ID gerado no BD
const getSelectLastID = async function (){

    try {
        //Script para retornar somente o ultimo ID
        let sql = `select id from tbl_filme_genero order by id desc limit 1`

        //Encaminha para o BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return Number(result[0].id)
        else
            return false


    } catch (error) {
        return false
    }

}

//Insere um genero novo no banco de dados
const setInsertFilmeGenero = async function (filmeGenero) {

    try {
        // Usando o método seguro $executeRaw com template literals para evitar SQL Injection
        let result = await prisma.$executeRaw`
        INSERT INTO tbl_filme_genero (

            id_filme,
            id_genero

        ) VALUES (
            ${filmeGenero.id_filme}, ${filmeGenero.id_genero}
        )`;

    if (result)
        return true
    else
        return false

    } catch (error) {
        console.log(error)
        return false
    }


}

//Altera um genero no banco de dados
const setUpdateFilmeGenero = async function (filmeGenero) {

    try {
        
        let sql =`
        UPDATE tbl_filme_genero SET
            id.filme            =   ${filmeGenero.id_filme},
            id.genero           =   ${filmeGenero.id_genero},

        where id = ${filmeGenero.id}`

        //executeRawUnsafe() -> executa o script q n tem retorno de valores
        let result = await prisma.$executeRawUnsafe(sql)



    if (result)
        return true
    else
        return false

    } catch (error) {
        console.log(error)
        return false
    }

}

//Deleta um genero pelo ID no banco de dados
const setDeleteFilmeGenero = async function (id) {

    try {
        // Usando o método seguro $executeRaw para DELETE
        let result = await prisma.$executeRaw`DELETE FROM tbl_filme_genero WHERE id = ${id}`;

        if (result)
            return true
        else
            return false
    
        } catch (error) {
            console.log(error)
            return false
        }

}

//Deleta um genero pelo ID do filme no banco de dados
// const setDeleteFilmeGeneroByFilmeId = async function (idFilme) {

//     try {
//         // Usando o método seguro $executeRaw para DELETE
//         let result = await prisma.$executeRaw`DELETE FROM tbl_filme_genero WHERE id_filme = ${idFilme}`;

//         if (result)
//             return true
//         else
//             return false
    
//         } catch (error) {
//             console.log(error)
//             return false
//         }

// }








module.exports = {

    getSelectAllFilmesGeneros,
    getSelectByIdFilmeGenero,
    getSelectGenerosByIdFilmes,
    getSelectFilmesByIdGeneros,
    getSelectLastID,
    setInsertFilmeGenero,
    setUpdateFilmeGenero,
    setDeleteFilmeGenero,
    // setDeleteFilmeGeneroByFilmeId

}