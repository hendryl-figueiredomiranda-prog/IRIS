document.addEventListener("DOMContentLoaded", () => {
    const CHAVE_PERGUNTAS = "irisPerguntas";

    function carregarPerguntas() {
        const perguntasSalvas = sessionStorage.getItem(CHAVE_PERGUNTAS);

        if (perguntasSalvas) {
            try {
                return JSON.parse(perguntasSalvas)
                    .filter((pergunta) => pergunta.ativa !== false);
            } catch (erro) {
                console.error("Erro ao carregar perguntas:", erro);
            }
        }

        const perguntasIniciais = window.IRIS_PERGUNTAS_INICIAIS || [];

        sessionStorage.setItem(
            CHAVE_PERGUNTAS,
            JSON.stringify(perguntasIniciais)
        );

        return perguntasIniciais.filter(
            (pergunta) => pergunta.ativa !== false
        );
    }

    const perguntasMockadas = carregarPerguntas();

    const introducao = document.getElementById("questionario-introducao");
    const secaoQuestionario = document.getElementById("secao-questionario");
    const secaoProcessamento = document.getElementById("secao-processamento");
    const secaoResultado = document.getElementById("secao-resultado");
    const secaoErro = document.getElementById("secao-erro-questionario");

    const botaoIniciar = document.getElementById("botao-iniciar-questionario");
    const botaoAnterior = document.getElementById("botao-pergunta-anterior");
    const botaoProxima = document.getElementById("botao-proxima-pergunta");
    const botaoRefazer = document.getElementById("botao-refazer-questionario");
    const botaoTentarNovamente = document.getElementById("botao-tentar-novamente");

    const perguntaCategoria = document.getElementById("pergunta-categoria");
    const perguntaNumero = document.getElementById("pergunta-numero");
    const perguntaTexto = document.getElementById("pergunta-texto");
    const perguntaMensagem = document.getElementById("pergunta-mensagem");

    const contador = document.getElementById("questionario-contador");
    const barraProgresso = document.getElementById("barra-progresso");
    const barraPreenchimento = document.getElementById(
        "barra-progresso-preenchimento"
    );

    const resultadoCard = document.getElementById("resultado-card");
    const resultadoBandeira = document.getElementById("resultado-bandeira");
    const resultadoTitulo = document.getElementById("resultado-titulo");
    const resultadoDescricao = document.getElementById("resultado-descricao");

    const camposResposta = document.querySelectorAll(
        'input[name="resposta"]'
    );

    let perguntas = [];
    let perguntaAtual = 0;
    let respostas = {};

    function ocultarTodasAsSecoes() {
        introducao.hidden = true;
        secaoQuestionario.hidden = true;
        secaoProcessamento.hidden = true;
        secaoResultado.hidden = true;
        secaoErro.hidden = true;
    }

    function mostrarSecao(secao) {
        ocultarTodasAsSecoes();
        secao.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function iniciarQuestionario() {
        perguntas = perguntasMockadas;
        perguntaAtual = 0;
        respostas = {};

        camposResposta.forEach((campo) => {
            campo.checked = false;
        });

        if (perguntas.length === 0) {
            mostrarSecao(secaoErro);
            return;
        }

        mostrarSecao(secaoQuestionario);
        exibirPerguntaAtual();
    }

    function exibirPerguntaAtual() {
        const pergunta = perguntas[perguntaAtual];

        if (!pergunta) {
            mostrarSecao(secaoErro);
            return;
        }

        perguntaCategoria.textContent =
            pergunta.categoria || "Relacionamento";

        perguntaNumero.textContent = String(
            perguntaAtual + 1
        ).padStart(2, "0");

        perguntaTexto.textContent = pergunta.texto;

        contador.textContent =
            `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;

        atualizarBarraProgresso();
        restaurarRespostaSalva();
        atualizarBotoes();

        perguntaMensagem.textContent = "";
    }

    function atualizarBarraProgresso() {
        const percentual =
            ((perguntaAtual + 1) / perguntas.length) * 100;

        barraPreenchimento.style.width = `${percentual}%`;

        barraProgresso.setAttribute(
            "aria-valuenow",
            String(Math.round(percentual))
        );
    }

    function obterRespostaSelecionada() {
        const selecionada = document.querySelector(
            'input[name="resposta"]:checked'
        );

        if (!selecionada) {
            return null;
        }

        return selecionada.value;
    }

    function salvarRespostaSelecionada() {
        const respostaSelecionada = obterRespostaSelecionada();

        if (!respostaSelecionada) {
            return false;
        }

        const pergunta = perguntas[perguntaAtual];

        respostas[pergunta.id] = {
            perguntaId: pergunta.id,
            resposta: respostaSelecionada
        };

        return true;
    }

    function restaurarRespostaSalva() {
        camposResposta.forEach((campo) => {
            campo.checked = false;
        });

        const pergunta = perguntas[perguntaAtual];
        const respostaSalva = respostas[pergunta.id];

        if (!respostaSalva) {
            return;
        }

        const campoSalvo = document.querySelector(
            `input[name="resposta"][value="${respostaSalva.resposta}"]`
        );

        if (campoSalvo) {
            campoSalvo.checked = true;
        }
    }

    function atualizarBotoes() {
        const respostaSelecionada = obterRespostaSelecionada();
        const ultimaPergunta =
            perguntaAtual === perguntas.length - 1;

        botaoAnterior.disabled = perguntaAtual === 0;
        botaoProxima.disabled = !respostaSelecionada;

        botaoProxima.textContent = ultimaPergunta
            ? "Ver resultado"
            : "Continuar";
    }

function avancarPergunta() {
    const respostaSelecionada = obterRespostaSelecionada();

    if (!respostaSelecionada) {
        perguntaMensagem.textContent =
            "Selecione uma resposta para continuar.";
        return;
    }

    const pergunta = perguntas[perguntaAtual];

    respostas[pergunta.id] = {
        perguntaId: pergunta.id,
        resposta: respostaSelecionada
    };

    const perguntaCritica =
        pergunta.gravidade === "CRITICA";

    const respostaDeAlerta =
        respostaSelecionada === "SEMPRE" ||
        respostaSelecionada === "AS_VEZES";

    if (perguntaCritica && respostaDeAlerta) {
        sessionStorage.setItem(
            "irisRespostasQuestionario",
            JSON.stringify(Object.values(respostas))
        );

        window.location.href = "alerta-vermelho.html";
        return;
    }

    const ultimaPergunta =
        perguntaAtual === perguntas.length - 1;

    if (ultimaPergunta) {
        finalizarQuestionario();
        return;
    }

    perguntaAtual += 1;
    exibirPerguntaAtual();
}



    function voltarPergunta() {
        if (perguntaAtual === 0) {
            return;
        }

        salvarRespostaSelecionada();

        perguntaAtual -= 1;
        exibirPerguntaAtual();
    }

    async function finalizarQuestionario() {
        mostrarSecao(secaoProcessamento);

        const dadosParaEnvio = {
            respostas: Object.values(respostas)
        };

        console.log(
            "JSON que será enviado ao backend:",
            dadosParaEnvio
        );

        try {
            const resultado = await simularResultadoBackend(
                dadosParaEnvio
            );

            exibirResultado(resultado);
        } catch (error) {
            console.error(
                "Erro ao finalizar questionário:",
                error
            );

            mostrarSecao(secaoErro);
        }
    }

    function simularResultadoBackend(dados) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let pontuacao = 0;
                let possuiRespostaGrave = false;

                dados.respostas.forEach((item) => {
                    if (item.resposta === "SEMPRE") {
                        pontuacao += 2;
                    }

                    if (item.resposta === "AS_VEZES") {
                        pontuacao += 1;
                    }

                    const pergunta = perguntas.find(
                        (registro) => registro.id === item.perguntaId
                    );

                    const categoriasGraves = [
                        "Ameaças",
                        "Consentimento"
                    ];

                    if (
                        pergunta &&
                        categoriasGraves.includes(pergunta.categoria) &&
                        item.resposta === "SEMPRE"
                    ) {
                        possuiRespostaGrave = true;
                    }
                });

                resolve(
                    calcularResultadoMockado(
                        pontuacao,
                        possuiRespostaGrave
                    )
                );
            }, 800);
        });
    }

    function calcularResultadoMockado(
        pontuacao,
        possuiRespostaGrave
    ) {
        if (possuiRespostaGrave || pontuacao >= 12) {
            return {
                nivel: "VERMELHO",
                bandeira: "Bandeira vermelha",
                titulo: "Possível situação de perigo",
                descricao:
                    "Algumas respostas indicam situações graves que podem colocar sua segurança em risco. Em caso de perigo imediato, procure um local seguro e acione o 190."
            };
        }

        if (pontuacao >= 7) {
            return {
                nivel: "LARANJA",
                bandeira: "Bandeira laranja",
                titulo: "Vários sinais de alerta",
                descricao:
                    "Foram identificados vários comportamentos relacionados a controle, abuso ou violência. Considere buscar apoio de alguém de confiança ou de um serviço especializado."
            };
        }

        if (pontuacao >= 1) {
            return {
                nivel: "AMARELO",
                bandeira: "Bandeira amarela",
                titulo: "Alguns sinais de alerta",
                descricao:
                    "Algumas respostas indicam comportamentos preocupantes, como controle, humilhação ou desrespeito aos seus limites. Observe essas situações e considere buscar orientação."
            };
        }

        return {
            nivel: "VERDE",
            bandeira: "Bandeira verde",
            titulo: "Nenhum sinal de alerta",
            descricao:
                "Não foram identificados sinais de alerta nas situações avaliadas. Suas respostas indicam respeito, liberdade e segurança no relacionamento."
        };
    }

    function exibirResultado(resultado) {
        resultadoCard.classList.remove(
            "resultado-verde",
            "resultado-amarelo",
            "resultado-laranja",
            "resultado-vermelho"
        );

        const classesResultado = {
            VERDE: "resultado-verde",
            AMARELO: "resultado-amarelo",
            LARANJA: "resultado-laranja",
            VERMELHO: "resultado-vermelho"
        };

        const classe =
            classesResultado[resultado.nivel] ||
            "resultado-amarelo";

        resultadoCard.classList.add(classe);

        resultadoBandeira.textContent =
            resultado.bandeira;

        resultadoTitulo.textContent =
            resultado.titulo;

        resultadoDescricao.textContent =
            resultado.descricao;

        mostrarSecao(secaoResultado);
    }

    function refazerQuestionario() {
        perguntaAtual = 0;
        respostas = {};

        camposResposta.forEach((campo) => {
            campo.checked = false;
        });

        mostrarSecao(introducao);
    }

    camposResposta.forEach((campo) => {
        campo.addEventListener("change", () => {
            perguntaMensagem.textContent = "";
            salvarRespostaSelecionada();
            atualizarBotoes();
        });
    });

    botaoIniciar.addEventListener(
        "click",
        iniciarQuestionario
    );

    botaoAnterior.addEventListener(
        "click",
        voltarPergunta
    );

    botaoProxima.addEventListener(
        "click",
        avancarPergunta
    );

    botaoRefazer.addEventListener(
        "click",
        refazerQuestionario
    );

    botaoTentarNovamente.addEventListener(
        "click",
        iniciarQuestionario
    );
});