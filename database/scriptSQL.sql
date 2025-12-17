create database db_locadora_filme_ds2m_25_2;

use db_locadora_filme_ds2m_25_2;

CREATE TABLE tbl_sexo (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(1) NOT NULL,
    nome VARCHAR(20) NOT NULL,
    UNIQUE KEY (id)
);

CREATE TABLE tbl_classificacao (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(5) NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    icone VARCHAR(255),
    UNIQUE KEY (id)
);

CREATE TABLE tbl_genero (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    UNIQUE KEY (id)
);

CREATE TABLE tbl_ator (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    biografia TEXT,
    foto VARCHAR(255),
    id_sexo INT NOT NULL,
    FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id),
    UNIQUE KEY (id)
);

CREATE TABLE tbl_diretor (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    biografia TEXT,
    foto VARCHAR(255),
    id_sexo INT NOT NULL,
    FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id),
    UNIQUE KEY (id)
);

CREATE TABLE tbl_filme (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sinopse TEXT NOT NULL,
    data_lancamento DATE NOT NULL,
    duracao TIME NOT NULL,
    orcamento DECIMAL(15, 2),
    trailer VARCHAR(255),
    capa VARCHAR(255),
    id_classificacao INT,
    FOREIGN KEY (id_classificacao) REFERENCES tbl_classificacao(id),
    UNIQUE KEY (id)
);

CREATE TABLE tbl_personagem (
    id_personagem INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_personagem VARCHAR(100) NOT NULL,
    descricao TEXT,
    objetivo TEXT,
    id_filme INT NOT NULL,
    id_ator INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES tbl_filme(id),
    FOREIGN KEY (id_ator) REFERENCES tbl_ator(id),
    UNIQUE KEY (id_personagem)
);

CREATE TABLE tbl_filme_genero (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_filme INT NOT NULL,
    id_genero INT NOT NULL,
    FOREIGN KEY (id_filme) REFERENCES tbl_filme(id),
    FOREIGN KEY (id_genero) REFERENCES tbl_genero(id),
    UNIQUE KEY (id)
);

CREATE TABLE tbl_diretor_filme (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_diretor INT NOT NULL,
    id_filme INT NOT NULL,
    FOREIGN KEY (id_diretor) REFERENCES tbl_diretor(id),
    FOREIGN KEY (id_filme) REFERENCES tbl_filme(id),
    UNIQUE KEY (id)
);

INSERT INTO tbl_sexo (sigla, nome) VALUES 
('M', 'Masculino'),
('F', 'Feminino'),
('O', 'Outro');

INSERT INTO tbl_classificacao (sigla, descricao, icone) VALUES
('L', 'Livre para todos os públicos', 'url_icone_livre.png'),
('10', 'Não recomendado para menores de 10 anos', 'url_icone_10.png'),
('12', 'Não recomendado para menores de 12 anos', 'url_icone_12.png'),
('14', 'Não recomendado para menores de 14 anos', 'url_icone_14.png'),
('16', 'Não recomendado para menores de 16 anos', 'url_icone_16.png'),
('18', 'Não recomendado para menores de 18 anos', 'url_icone_18.png');
