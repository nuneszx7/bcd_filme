create database db_locadora_filme_ds2m_25_2;

use db_locadora_filme_ds2m_25_2;

create table tbl_filme (
	id 					int not null auto_increment primary key,
    nome 				varchar(100) not null,
	sinopse 			text,
    data_lancamento 	date,
    duracao 			time not null,
    orcamento 			decimal(11,2) not null,
    trailer 			varchar(200),
    capa 				varchar(200) not null

);

insert into tbl_filme (
	nome,
    sinopse,
    data_lancamento,
    duracao,
    orcamento,
    trailer,
    capa)
    values('Top Gun: Maverick',
			'Após mais de trinta anos de serviço como um dos melhores aviadores da Marinha, Pete Mitchell está onde pertence, ultrapassando os limites como um piloto de teste intrépido e evitando a promoção de posto que o manteria em terra.',
            '2022-05-26',
            '02:11:00',
            '170000000.00',
            'https://www.youtube.com/watch?v=qSqVVswa420',
            'https://ingresso-a.akamaihd.net/prd/img/movie/top-gun-maverick/5e534635-127b-4121-a89f-19c47f5ba2a8.jpg'
            );
insert into tbl_filme (
	nome,
    sinopse,
    data_lancamento,
    duracao,
    orcamento,
    trailer,
    capa)
            values('F1: O Filme',
			'Um piloto de Fórmula 1 sai da aposentadoria para orientar e formar equipe com um piloto mais jovem.',
            '2025-06-26',
            '02:35:00',
            '200000000.00',
            'https://www.youtube.com/watch?v=ZiDphkXCZsQ',
            'https://m.media-amazon.com/images/M/MV5BNDkwNjc2OTEtYWNkNS00Mjc1LWJmMDYtYWVhNDA1MjBiYjU4XkEyXkFqcGc@._V1_.jpg'
			);
            
select * from tbl_filme

