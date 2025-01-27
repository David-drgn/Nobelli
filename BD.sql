CREATE TYPE tipo_section AS ENUM ('servico', 'produto', 'estoque');

CREATE TYPE genero AS ENUM ('Masculino', 'Feminino', 'Outro');

CREATE TYPE dias_semana AS ENUM (
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
);

create table cliente(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    genero genero NOT NULL DEFAULT "Outro",
    endereco TEXT,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table funcionario(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table section(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    tipo tipo_section NOT NULL,
);

create table servico(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    valor DECIMAL(10, 2) NOT NULL,
    duracao DECIMAL (2, 2) NOT NULL,
    CONSTRAINT fk_servico_section FOREIGN KEY (section_id) REFERENCES section(id)
);

create table produto(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    valorCusto DECIMAL(10, 2) NOT NULL,
    valorVenda DECIMAL(10, 2) NOT NULL,
    qtd INT NOT NULL,
    CONSTRAINT fk_produto_section FOREIGN KEY (section_id) REFERENCES section(id)
);

create table estoque(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    valorCusto DECIMAL(10, 2) NOT NULL,
    qtd INT NOT NULL,
    CONSTRAINT fk_estoque_section FOREIGN KEY (section_id) REFERENCES section(id)
);

create table venda(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL,
    funcionario_id UUID NOT NULL,
    valorTotal DECIMAL(10, 2) NOT NULL,
    produtos JSON NOT NULL,
    CONSTRAINT fk_venda_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    CONSTRAINT fk_venda_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
);

create table eventos(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL,
    funcionario_id UUID NOT NULL,
    servico_id UUID NOT NULL,
    horario TIME NOT NULL,
    dataInicio DATE NOT NULL,
    dataFim DATE,
    generos dias_semana [],
    CONSTRAINT fk_eventos_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    CONSTRAINT fk_eventos_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionario(id),
    CONSTRAINT fk_eventos_servico FOREIGN KEY (servico_id) REFERENCES servico(id)
);