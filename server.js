const express = require("express");
const app = express();

// Middleware para processar dados enviados via formulário
app.use(express.urlencoded({ extended: true }));

// Função para gerar HTML do quiz
function gerarQuizHTML(titulo, perguntas, actionUrl) {
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${titulo}</title>
        </head>
        <body>
            <h1>${titulo}</h1>
            <form action="${actionUrl}" method="POST">
    `;

    perguntas.forEach((pergunta, index) => {
        html += `
            <div class="question">
                <label>${index + 1}. ${pergunta.texto}</label><br>
        `;

        pergunta.opcoes.forEach(opcao => {
            html += `
                <input type="radio" name="q${index + 1}" value="${opcao}" required> ${opcao}<br>
            `;
        });

        html += `</div>`;
    });

    html += `
                <button type="submit">Enviar</button>
            </form>
        </body>
        </html>
    `;
    return html;
}

// Dados dos quizzes
const quizzes = {
    "quiz-1": {
        titulo: "Quiz 1: Agricultura Sustentável",
        perguntas: [
            { texto: "Qual é a prática que ajuda a conservar a água e a melhorar a saúde do solo na agricultura?", opcoes: ["Monocultura", "Rotação de culturas", "Uso excessivo de pesticidas"] },
            { texto: "O que é uma agricultura sustentável?", opcoes: ["Uma agricultura que não usa tecnologias", "Uma agricultura que promove o uso responsável dos recursos naturais", "Uma agricultura que depende de agrotóxicos"] },
            { texto: "Qual é o principal benefício da agroecologia?", opcoes: ["Aumento da produtividade com o uso de produtos químicos", "Promoção da biodiversidade e redução de impactos ambientais", "Desenvolvimento de monoculturas de alto rendimento"] },
        ],
        respostas: ["Rotação de culturas", "Uma agricultura que promove o uso responsável dos recursos naturais", "Promoção da biodiversidade e redução de impactos ambientais"]
    },
    "quiz-2": {
        titulo: "Quiz 2: Fome Zero e Segurança Alimentar",
        perguntas: [
            { texto: "Qual é o principal objetivo da ODS Fome Zero?", opcoes: ["Erradicar a fome e garantir uma alimentação saudável", "Reduzir o desperdício de alimentos", "Aumentar a produção de alimentos industriais"] },
            { texto: "Como a agricultura sustentável contribui para a segurança alimentar?", opcoes: ["Aumenta o uso de fertilizantes químicos", "Promove a biodiversidade e melhora a qualidade do solo", "Depende de práticas agrícolas intensivas"] },
            { texto: "Quais são os impactos negativos do desperdício de alimentos?", opcoes: ["Aumenta a escassez de alimentos", "Reduz a disponibilidade de água potável e aumenta a emissão de gases de efeito estufa", "Melhora a qualidade do solo"] },
        ],
        respostas: ["Erradicar a fome e garantir uma alimentação saudável", "Promove a biodiversidade e melhora a qualidade do solo", "Reduz a disponibilidade de água potável e aumenta a emissão de gases de efeito estufa"]
    },
    "quiz-3": {
        titulo: "Quiz 3: Energia Acessível e Limpa",
        perguntas: [
            { texto: "Qual é uma das fontes de energia limpa?", opcoes: ["Carvão", "Solar", "Petróleo"] },
            { texto: "A energia solar é considerada limpa porque?", opcoes: ["Polui o meio ambiente", "Utiliza combustíveis fósseis", "Não emite gases de efeito estufa durante a produção de energia"] },
            { texto: "A energia eólica é gerada por qual recurso natural?", opcoes: ["Água", "Vento", "Fogo"] }
        ],
        respostas: ["Solar", "Não emite gases de efeito estufa durante a produção de energia", "Vento"]
    },
    "quiz-4": {
        titulo: "Quiz 4: Fontes de Energia Limpa",
        perguntas: [
            { texto: "Qual dessas opções é uma forma de energia renovável?", opcoes: ["Energia solar", "Energia nuclear", "Energia de carvão"] },
            { texto: "Qual é o principal benefício da energia limpa?", opcoes: ["Reduzir a poluição e as emissões de carbono", "Aumentar o custo da eletricidade", "Depender de recursos não renováveis"] },
            { texto: "O que é necessário para gerar energia a partir de turbinas eólicas?", opcoes: ["Luz do sol", "Vento", "Água"] },
        ],
        respostas: ["Energia solar", "Reduzir a poluição e as emissões de carbono", "Vento"]
    },
    "quiz-5": {
        titulo: "Quiz 5: Uso e Benefícios da Energia Limpa",
        perguntas: [
            { texto: "Qual dessas é uma vantagem da energia solar?", opcoes: ["Causa danos ao meio ambiente", "É acessível e pode ser utilizada em locais remotos", "Requer grandes quantidades de petróleo"] },
            { texto: "O que as fontes de energia renovável têm em comum?", opcoes: ["São baseadas em combustíveis fósseis", "Podem ser reabastecidas naturalmente", "Geram grandes quantidades de resíduos"] },
            { texto: "A energia hidroelétrica é gerada através de?", opcoes: ["Correntes de ar", "Água em movimento", "Radiação solar"] },
        ],
        respostas: ["É acessível e pode ser utilizada em locais remotos", "Podem ser reabastecidas naturalmente", "Água em movimento"]
    },
    "quiz-6": {
        titulo: "Quiz 6: Indústria, Inovação e Infraestrutura",
        perguntas: [
            { texto: "Qual é o principal objetivo da ODS Indústria, Inovação e Infraestrutura?", opcoes: ["Promover a industrialização sustentável", "Reduzir o uso de tecnologia", "Aumentar o consumo de recursos naturais"] },
            { texto: "Como a inovação pode ajudar a indústria a ser mais sustentável?", opcoes: ["Criando produtos com mais impacto ambiental", "Desenvolvendo novas tecnologias para reduzir desperdícios e poluição", "Aumentando a dependência de recursos naturais"] },
            { texto: "Qual infraestrutura é essencial para o desenvolvimento de cidades sustentáveis?", opcoes: ["Infraestrutura de transporte público eficiente", "Construção de mais fábricas", "Aumento de uso de energia não renovável"] },
        ],
        respostas: ["Promover a industrialização sustentável", "Desenvolvendo novas tecnologias para reduzir desperdícios e poluição", "Infraestrutura de transporte público eficiente"]
    },
    "quiz-7": {
        titulo: "Quiz 7: Desenvolvimento de Indústria e Infraestrutura",
        perguntas: [
            { texto: "O que a ODS Indústria, Inovação e Infraestrutura busca melhorar nas cidades?", opcoes: ["Aumentar a poluição", "Construir infraestrutura mais eficiente e sustentável", "Eliminar as indústrias locais"] },
            { texto: "A qual setor a inovação tecnológica contribui diretamente na ODS Indústria, Inovação e Infraestrutura?", opcoes: ["Agricultura", "Indústria", "Educação"] },
            { texto: "Como as indústrias podem contribuir para a ODS de Indústria, Inovação e Infraestrutura?", opcoes: ["Aumentando o uso de produtos descartáveis", "Adotando práticas mais ecológicas e desenvolvendo novas tecnologias", "Reduzindo o número de empregos na indústria"] },
        ],
        respostas: ["Construir infraestrutura mais eficiente e sustentável", "Indústria", "Adotando práticas mais ecológicas e desenvolvendo novas tecnologias"]
    },
};

// Rotas de quizzes
Object.keys(quizzes).forEach(quizId => {
    // Página do quiz
    app.get(`/${quizId}`, (req, res) => {
        const quiz = quizzes[quizId];
        const html = gerarQuizHTML(quiz.titulo, quiz.perguntas, `/${quizId}-result`);
        res.send(html);
    });

    // Processar resultado do quiz
    app.post(`/${quizId}-result`, (req, res) => {
        const quiz = quizzes[quizId];
        const respostasUsuario = req.body;
        let score = 0;
        let bonus = 0;

        // Calcular pontuação
        quiz.perguntas.forEach((_, index) => {
            const respostaCorreta = quiz.respostas[index];
            const respostaUsuario = respostasUsuario[`q${index + 1}`];
            if (respostaUsuario === respostaCorreta) {
                score++;
            }
        });

        // if (quizId === "/quiz-3") {
        //     bonus = 3; // Adiciona o bônus ao quiz-3
        // }

        // Exibir resultado
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${quiz.titulo} - Resultado</title>
            </head>
            <body>
                <h1>Resultado do ${quiz.titulo}</h1>
                <p>Você acertou ${score} de ${quiz.perguntas.length} perguntas!</p>
                <p>Você ganhou ${score} de recursos a sua escolha!</p>
                <a href="/${quizId}"><button>Voltar ao Quiz</button></a>
            </body>
            </html>
        `);
    });
});

// Rota inicial ##############################################################################
app.get("/", function (req, res) {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Missão Sustentável: ODS em Equipe</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f0f8ff;
                        color: #333;
                        text-align: center;
                    }
                    header {
                        background-color: #006400;
                        color: white;
                        padding: 20px 0;
                    }
                    main {
                        padding: 20px;
                    }
                    footer {
                        background-color: #006400;
                        color: white;
                        padding: 10px 0;
                        position: fixed;
                        width: 100%;
                        bottom: 0;
                    }
                    a {
                        color: #006400;
                        text-decoration: none;
                        font-weight: bold;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1>Missão Sustentável: ODS em Equipe</h1>
                </header>
                <main>
                    <p>Bem-vindo ao site oficial do jogo colaborativo que desafia você e sua equipe a alcançar os Objetivos de Desenvolvimento Sustentável!</p>
                    <p>Explore as seguintes seções:</p>
                    <ul>
                        <li><a href="/quizzes">Quizzes</a></li>
                        <li><a href="/desafios">Desafios</a></li>
                        <li><a href="/informacoes">Informações Adicionais</a></li>
                    </ul>
                </main>
                <footer>
                    <p>© 2024 Missão Sustentável. Todos os direitos reservados.</p>
                </footer>
            </body>
        </html>
    `);
});

// Rota informações ##############################################################################
app.get("/informacoes", function (req, res) {
    res.send(`
        <html>
            <head>
                <title>Informações sobre o Jogo</title>
                <style>
                    /* Resetando alguns estilos padrões */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        line-height: 1.6;
                        padding: 0;
                        margin: 0;
                        min-height: 100vh;
                    }

                    /* Estilo para o header */
                    header {
                        background-color: #2C3E50;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }

                    header h1 {
                        font-size: 2.5rem;
                        letter-spacing: 1px;
                        font-weight: 600;
                    }

                    /* Estilo para a seção principal */
                    main {
                        padding: 20px;
                        max-width: 900px;
                        margin: 0 auto;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        margin-top: 30px;
                    }

                    /* Títulos */
                    h2 {
                        color: #34495E;
                        font-size: 1.8rem;
                        margin-bottom: 15px;
                        font-weight: 500;
                    }

                    /* Parágrafos e listas */
                    p {
                        font-size: 1.1rem;
                        color: #555;
                        margin-bottom: 20px;
                    }

                    ul {
                        list-style-type: none;
                        padding: 0;
                        margin-bottom: 20px;
                    }

                    li {
                        padding: 8px 0;
                        font-size: 1.1rem;
                        color: #555;
                    }

                    li strong {
                        color: #2C3E50;
                    }

                    /* Estilo do botão de voltar */
                    button.voltar {
                        background-color: #3498DB; /* Cor de fundo azul */
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        font-size: 1.1rem;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: background-color 0.3s, transform 0.2s;
                        display: inline-block;
                        margin: 10px 0;
                    }

                    button.voltar:hover {
                        background-color: #2980B9; /* Cor de fundo ao passar o mouse */
                        transform: translateY(-3px); /* Efeito de "levitar" ao passar o mouse */
                    }

                    button.voltar:focus {
                        outline: none;
                    }

                    /* Estilo para o footer */
                    footer {
                        background-color: #2C3E50;
                        color: white;
                        text-align: center;
                        padding: 15px;
                        position: fixed;
                        bottom: 0;
                        width: 100%;
                        font-size: 1rem;
                        box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1>Missão Sustentável: ODS em Equipe</h1>
                </header>
                <main>
                <button class="voltar" onclick="history.back()">Voltar</button>
                    <h2>Sobre o Jogo</h2>
                    <p>
                        Missão Sustentável: ODS em Equipe é um jogo de cartas colaborativo, educativo e interativo, onde os jogadores devem trabalhar juntos para atingir os Objetivos de Desenvolvimento Sustentável (ODS) antes que o tempo ou os recursos acabem.
                    </p>
                    <h2>Como Jogar</h2>
                    <p>
                        O jogo é jogado por 2 a 4 jogadores, e cada um assume o papel de um personagem com habilidades especiais, como "Engenheiro" ou "Médico Comunitário". Cada jogador recebe cartas de ação, e todos devem colaborar para resolver desafios relacionados aos ODS.
                    </p>
                    <h2>Componentes do Jogo</h2>
                    <ul>
                        <li><strong>Cartas de Ação:</strong> Representam ações sustentáveis para alcançar os ODS, como "Construir poços artesianos" ou "Promover campanhas de vacinação".</li>
                        <li><strong>Cartas de Evento:</strong> Eventos inesperados, como desastres ou avanços tecnológicos, que podem ajudar ou prejudicar a equipe.</li>
                        <li><strong>Marcadores de Recursos:</strong> Recursos limitados, como dinheiro, energia e pesquisa, usados para executar ações.</li>
                        <li><strong>Cartas de Personagem:</strong> Cada jogador escolhe um personagem com uma habilidade única para facilitar as ações no jogo.</li>
                    </ul>
                    <h2>Objetivo</h2>
                    <p>
                        O objetivo do jogo é colaborar para resolver desafios relacionados aos ODS e completar todos os objetivos antes que os recursos se esgotem ou o tempo acabe.
                    </p>
                </main>
            </body>
        </html>
    `);
});



// Rota sobre serviços
app.get("/servicos", function (req, res) {
    res.send(`
        <html>
            <head>
                <title>Serviços</title>
            </head>
            <body>
                <h1>Nossos Serviços</h1>
                <ul>
                    <li>Desenvolvimento Web</li>
                    <li>Consultoria de TI</li>
                    <li>Suporte Técnico</li>
                </ul>
            </body>
        </html>
    `);
});

// Rota sobre contato
app.get("/contato", function (req, res) {
    res.send(`
        <html>
            <head>
                <title>Contato</title>
            </head>
            <body>
                <h1>Fale Conosco</h1>
                <p>Envie-nos uma mensagem para contato@meusite.com</p>
            </body>
        </html>
    `);
});

// Rota com parâmetro opcional (exemplo de consulta por nome)
app.get("/consulta/:nome?", function (req, res) {
    const nome = req.params.nome;
    if (nome) {
        res.send(`
            <html>
                <head>
                    <title>Consulta</title>
                </head>
                <body>
                    <h1>Resultado da consulta</h1>
                    <p>Nome consultado: ${nome}</p>
                </body>
            </html>
        `);
    } else {
        res.send(`
            <html>
                <head>
                    <title>Consulta</title>
                </head>
                <body>
                    <h1>Resultado da consulta</h1>
                    <p>Nenhum nome informado.</p>
                </body>
            </html>
        `);
    }
});

// Iniciar o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
