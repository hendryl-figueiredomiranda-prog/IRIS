document.addEventListener("DOMContentLoaded", () => {
    const CHAVE_PERGUNTAS = "irisPerguntas";
    const CHAVE_ADMIN = "irisAdmin";

    const nomesCategorias = {
        FISICA: "Violência física",
        PSICOLOGICA: "Violência psicológica",
        SEXUAL: "Violência sexual",
        PATRIMONIAL: "Violência patrimonial",
        MORAL: "Violência moral"
    };

    const nomesGravidades = {
        BAIXA: "Baixa",
        MEDIA: "Média",
        ALTA: "Alta",
        CRITICA: "Crítica"
    };

    let perguntas = [];
    let perguntaEmExclusao = null;
    let notificacaoTimeout = null;

    const elementos = {
        lista: document.getElementById("perguntas-lista"),
        template: document.getElementById("template-pergunta"),

        total: document.getElementById("total-perguntas"),
        totalAtivas: document.getElementById("total-perguntas-ativas"),
        totalInativas: document.getElementById("total-perguntas-inativas"),
        quantidade: document.getElementById("listagem-quantidade"),

        estadoVazio: document.getElementById("estado-vazio"),
        estadoSemResultados: document.getElementById(
            "estado-sem-resultados"
        ),

        busca: document.getElementById("busca-pergunta"),
        filtroStatus: document.getElementById("filtro-status"),

        modalPergunta: document.getElementById("modal-pergunta"),
        modalExclusao: document.getElementById("modal-exclusao"),

        formulario: document.getElementById("formulario-pergunta"),
        modalTitulo: document.getElementById("modal-titulo"),

        perguntaId: document.getElementById("pergunta-id"),
        perguntaTexto: document.getElementById("pergunta-texto"),
        perguntaCategoria: document.getElementById(
            "pergunta-categoria"
        ),
        perguntaGravidade: document.getElementById(
            "pergunta-gravidade"
        ),
        perguntaAtiva: document.getElementById("pergunta-ativa"),

        erroTexto: document.getElementById("erro-pergunta-texto"),
        erroCategoria: document.getElementById(
            "erro-pergunta-categoria"
        ),
        erroGravidade: document.getElementById(
            "erro-pergunta-gravidade"
        ),
        formularioMensagem: document.getElementById(
            "formulario-mensagem"
        ),
        contador: document.getElementById("contador-caracteres"),

        botaoNova: document.getElementById("botao-nova-pergunta"),
        botaoPrimeira: document.getElementById(
            "botao-primeira-pergunta"
        ),
        botaoFecharModal: document.getElementById(
            "botao-fechar-modal"
        ),
        botaoCancelar: document.getElementById(
            "botao-cancelar-pergunta"
        ),

        botaoCancelarExclusao: document.getElementById(
            "botao-cancelar-exclusao"
        ),
        botaoConfirmarExclusao: document.getElementById(
            "botao-confirmar-exclusao"
        ),

        botaoSair: document.getElementById("botao-sair-admin"),

        notificacao: document.getElementById("notificacao"),
        notificacaoTexto: document.getElementById(
            "notificacao-texto"
        )
    };

    verificarAutenticacao();
    carregarPerguntas();
    configurarEventos();
    renderizarPainel();

    function verificarAutenticacao() {
        const sessaoSalva = sessionStorage.getItem(CHAVE_ADMIN);

        if (!sessaoSalva) {
            window.location.href = "login.html";
            return;
        }

        try {
            const sessao = JSON.parse(sessaoSalva);

            if (sessao.autenticado !== true) {
                window.location.href = "login.html";
            }
        } catch (erro) {
            sessionStorage.removeItem(CHAVE_ADMIN);
            window.location.href = "login.html";
        }
    }

    function carregarPerguntas() {
        const perguntasSalvas = sessionStorage.getItem(
            CHAVE_PERGUNTAS
        );

        if (perguntasSalvas) {
            try {
                perguntas = JSON.parse(perguntasSalvas);
                return;
            } catch (erro) {
                console.error(
                    "Não foi possível carregar as perguntas:",
                    erro
                );
            }
        }

        perguntas = (window.IRIS_PERGUNTAS_INICIAIS || []).map(
            (pergunta) => ({
                ...pergunta,
                ativa: pergunta.ativa !== false,
                gravidade: pergunta.gravidade || "MEDIA"
            })
        );

        salvarPerguntas();
    }

    function salvarPerguntas() {
        sessionStorage.setItem(
            CHAVE_PERGUNTAS,
            JSON.stringify(perguntas)
        );
    }

    function configurarEventos() {
        elementos.botaoNova?.addEventListener(
            "click",
            abrirModalNovaPergunta
        );

        elementos.botaoPrimeira?.addEventListener(
            "click",
            abrirModalNovaPergunta
        );

        elementos.botaoFecharModal?.addEventListener(
            "click",
            fecharModalPergunta
        );

        elementos.botaoCancelar?.addEventListener(
            "click",
            fecharModalPergunta
        );

        elementos.formulario?.addEventListener(
            "submit",
            salvarFormulario
        );

        elementos.perguntaTexto?.addEventListener(
            "input",
            atualizarContador
        );

        elementos.busca?.addEventListener(
            "input",
            renderizarPerguntas
        );

        elementos.filtroStatus?.addEventListener(
            "change",
            renderizarPerguntas
        );

        elementos.lista?.addEventListener(
            "click",
            tratarAcaoPergunta
        );

        elementos.botaoCancelarExclusao?.addEventListener(
            "click",
            fecharModalExclusao
        );

        elementos.botaoConfirmarExclusao?.addEventListener(
            "click",
            confirmarExclusao
        );

        elementos.botaoSair?.addEventListener("click", sairDoPainel);

        document
            .querySelectorAll("[data-fechar-modal]")
            .forEach((elemento) => {
                elemento.addEventListener(
                    "click",
                    fecharModalPergunta
                );
            });

        document
            .querySelectorAll("[data-fechar-exclusao]")
            .forEach((elemento) => {
                elemento.addEventListener(
                    "click",
                    fecharModalExclusao
                );
            });

        document.addEventListener("keydown", (evento) => {
            if (evento.key !== "Escape") {
                return;
            }

            if (!elementos.modalPergunta.hidden) {
                fecharModalPergunta();
            }

            if (!elementos.modalExclusao.hidden) {
                fecharModalExclusao();
            }
        });
    }

    function renderizarPainel() {
        atualizarResumo();
        renderizarPerguntas();
    }

    function atualizarResumo() {
        const total = perguntas.length;

        const ativas = perguntas.filter(
            (pergunta) => pergunta.ativa
        ).length;

        const inativas = total - ativas;

        elementos.total.textContent = total;
        elementos.totalAtivas.textContent = ativas;
        elementos.totalInativas.textContent = inativas;
    }

    function obterPerguntasFiltradas() {
        const termo = elementos.busca.value
            .trim()
            .toLocaleLowerCase("pt-BR");

        const status = elementos.filtroStatus.value;

        return perguntas.filter((pergunta) => {
            const texto = pergunta.texto
                .toLocaleLowerCase("pt-BR");

            const categoria =
                nomesCategorias[pergunta.categoria] ||
                pergunta.categoria ||
                "";

            const categoriaNormalizada =
                categoria.toLocaleLowerCase("pt-BR");

            const correspondeBusca =
                texto.includes(termo) ||
                categoriaNormalizada.includes(termo);

            let correspondeStatus = true;

            if (status === "ATIVAS") {
                correspondeStatus = pergunta.ativa === true;
            }

            if (status === "INATIVAS") {
                correspondeStatus = pergunta.ativa === false;
            }

            return correspondeBusca && correspondeStatus;
        });
    }

    function renderizarPerguntas() {
        const perguntasFiltradas = obterPerguntasFiltradas();

        elementos.lista.innerHTML = "";

        perguntasFiltradas.forEach((pergunta) => {
            const fragmento =
                elementos.template.content.cloneNode(true);

            const item = fragmento.querySelector(".pergunta-item");

            const categoria = fragmento.querySelector(
                ".pergunta-categoria"
            );

            const gravidade = fragmento.querySelector(
                ".pergunta-gravidade"
            );

            const status = fragmento.querySelector(
                ".pergunta-status"
            );

            const identificador = fragmento.querySelector(
                ".pergunta-identificador"
            );

            const texto = fragmento.querySelector(
                ".pergunta-item-texto"
            );

            const botaoStatus = fragmento.querySelector(
                '[data-acao="alternar-status"]'
            );

            item.dataset.perguntaId = pergunta.id;

            categoria.textContent =
                nomesCategorias[pergunta.categoria] ||
                pergunta.categoria;

            categoria.dataset.categoria = pergunta.categoria;

            gravidade.textContent =
                nomesGravidades[pergunta.gravidade] ||
                pergunta.gravidade;

            status.textContent = pergunta.ativa
                ? "Ativa"
                : "Inativa";

            status.classList.toggle(
                "inativa",
                !pergunta.ativa
            );

            identificador.textContent = `#${ pergunta.id } `;

            texto.textContent = pergunta.texto;

            botaoStatus.textContent = pergunta.ativa
                ? "Desativar"
                : "Ativar";

            elementos.lista.appendChild(fragmento);
        });

        atualizarEstadosDaLista(perguntasFiltradas.length);
    }

    function atualizarEstadosDaLista(quantidadeFiltrada) {
        const possuiPerguntas = perguntas.length > 0;
        const possuiResultado = quantidadeFiltrada > 0;

        elementos.estadoVazio.hidden = possuiPerguntas;

        elementos.estadoSemResultados.hidden =
            !possuiPerguntas || possuiResultado;

        elementos.lista.hidden = !possuiResultado;

        elementos.quantidade.textContent =
            quantidadeFiltrada === 1
                ? "1 item"
                : `${ quantidadeFiltrada } itens`;
    }

    function tratarAcaoPergunta(evento) {
        const botao = evento.target.closest("[data-acao]");

        if (!botao) {
            return;
        }

        const item = botao.closest(".pergunta-item");
        const perguntaId = Number(item.dataset.perguntaId);
        const acao = botao.dataset.acao;

        if (acao === "editar") {
            abrirModalEdicao(perguntaId);
        }

        if (acao === "excluir") {
            abrirModalExclusao(perguntaId);
        }

        if (acao === "alternar-status") {
            alternarStatus(perguntaId);
        }
    }

    function abrirModalNovaPergunta() {
        limparFormulario();

        elementos.modalTitulo.textContent = "Nova pergunta";
        elementos.perguntaAtiva.checked = true;
        elementos.modalPergunta.hidden = false;

        bloquearRolagem(true);

        setTimeout(() => {
            elementos.perguntaTexto.focus();
        }, 50);
    }

    function abrirModalEdicao(perguntaId) {
        const pergunta = perguntas.find(
            (item) => item.id === perguntaId
        );

        if (!pergunta) {
            mostrarNotificacao(
                "Não foi possível encontrar a pergunta.",
                "erro"
            );

            return;
        }

        limparErros();

        elementos.modalTitulo.textContent = "Editar pergunta";
        elementos.perguntaId.value = pergunta.id;
        elementos.perguntaTexto.value = pergunta.texto;
        elementos.perguntaCategoria.value = pergunta.categoria;
        elementos.perguntaGravidade.value = pergunta.gravidade;
        elementos.perguntaAtiva.checked = pergunta.ativa;

        atualizarContador();

        elementos.modalPergunta.hidden = false;
        bloquearRolagem(true);
    }

    function fecharModalPergunta() {
        elementos.modalPergunta.hidden = true;
        bloquearRolagem(false);
        limparFormulario();
    }

    function salvarFormulario(evento) {
        evento.preventDefault();

        limparErros();

        const id = Number(elementos.perguntaId.value);

        const texto = elementos.perguntaTexto.value.trim();
        const categoria = elementos.perguntaCategoria.value;
        const gravidade = elementos.perguntaGravidade.value;
        const ativa = elementos.perguntaAtiva.checked;

        let formularioValido = true;

        if (texto.length < 10) {
            elementos.erroTexto.textContent =
                "Digite uma pergunta com pelo menos 10 caracteres.";

            formularioValido = false;
        }

        if (!categoria) {
            elementos.erroCategoria.textContent =
                "Selecione o tipo de violência.";

            formularioValido = false;
        }

        if (!gravidade) {
            elementos.erroGravidade.textContent =
                "Selecione o nível de gravidade.";

            formularioValido = false;
        }

        if (!formularioValido) {
            elementos.formularioMensagem.textContent =
                "Confira os campos indicados antes de salvar.";

            return;
        }

        if (id) {
            editarPergunta({
                id,
                texto,
                categoria,
                gravidade,
                ativa
            });
        } else {
            adicionarPergunta({
                texto,
                categoria,
                gravidade,
                ativa
            });
        }

        salvarPerguntas();
        renderizarPainel();
        fecharModalPergunta();

        mostrarNotificacao(
            id
                ? "Pergunta atualizada com sucesso."
                : "Pergunta cadastrada com sucesso.",
            "sucesso"
        );
    }

    function adicionarPergunta(dados) {
        perguntas.push({
            id: gerarProximoId(),
            ...dados
        });
    }

    function editarPergunta(dados) {
        const indice = perguntas.findIndex(
            (pergunta) => pergunta.id === dados.id
        );

        if (indice === -1) {
            return;
        }

        perguntas[indice] = {
            ...perguntas[indice],
            ...dados
        };
    }

    function gerarProximoId() {
        if (perguntas.length === 0) {
            return 1;
        }

        const maiorId = Math.max(
            ...perguntas.map((pergunta) => Number(pergunta.id))
        );

        return maiorId + 1;
    }

    function alternarStatus(perguntaId) {
        const pergunta = perguntas.find(
            (item) => item.id === perguntaId
        );

        if (!pergunta) {
            return;
        }

        pergunta.ativa = !pergunta.ativa;

        salvarPerguntas();
        renderizarPainel();

        mostrarNotificacao(
            pergunta.ativa
                ? "Pergunta ativada."
                : "Pergunta desativada.",
            "sucesso"
        );
    }

    function abrirModalExclusao(perguntaId) {
        perguntaEmExclusao = perguntaId;

        elementos.modalExclusao.hidden = false;
        bloquearRolagem(true);
    }

    function fecharModalExclusao() {
        elementos.modalExclusao.hidden = true;
        perguntaEmExclusao = null;
        bloquearRolagem(false);
    }

    function confirmarExclusao() {
        if (perguntaEmExclusao === null) {
            return;
        }

        perguntas = perguntas.filter(
            (pergunta) => pergunta.id !== perguntaEmExclusao
        );

        salvarPerguntas();
        renderizarPainel();
        fecharModalExclusao();

        mostrarNotificacao(
            "Pergunta excluída com sucesso.",
            "sucesso"
        );
    }

    function atualizarContador() {
        const quantidade = elementos.perguntaTexto.value.length;

        elementos.contador.textContent = `${ quantidade }/300`;
    }

function limparFormulario() {
    elementos.formulario.reset();
    elementos.perguntaId.value = "";
    elementos.perguntaAtiva.checked = true;

    limparErros();
    atualizarContador();
}

function limparErros() {
    elementos.erroTexto.textContent = "";
    elementos.erroCategoria.textContent = "";
    elementos.erroGravidade.textContent = "";
    elementos.formularioMensagem.textContent = "";
}

function bloquearRolagem(bloquear) {
    document.body.style.overflow = bloquear ? "hidden" : "";
}

function mostrarNotificacao(mensagem, tipo = "sucesso") {
    clearTimeout(notificacaoTimeout);

    elementos.notificacaoTexto.textContent = mensagem;
    elementos.notificacao.className =
        `notificacao ${tipo}`;

    elementos.notificacao.hidden = false;

    notificacaoTimeout = setTimeout(() => {
        elementos.notificacao.hidden = true;
    }, 3000);
}

function sairDoPainel() {
    sessionStorage.removeItem(CHAVE_ADMIN);
    window.location.href = "login.html";
}
});
