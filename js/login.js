document.addEventListener("DOMContentLoaded", () => {
    const formularioLogin = document.getElementById("formulario-login");
    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");

    const erroEmail = document.getElementById("erro-email");
    const erroSenha = document.getElementById("erro-senha");

    const mensagemLogin = document.getElementById("login-mensagem");
    const botaoLogin = document.getElementById("login-botao");
    const botaoMostrarSenha = document.getElementById(
        "botao-mostrar-senha"
    );

    const ADMIN_MOCK = {
        email: "admin@email.com",
        senha: "12345678"
    };

    /**
     * Mostra ou esconde a senha.
     */
    function alternarVisibilidadeSenha() {
        const senhaVisivel = campoSenha.type === "text";

        campoSenha.type = senhaVisivel ? "password" : "text";

        botaoMostrarSenha.textContent = senhaVisivel
            ? "Mostrar"
            : "Ocultar";

        botaoMostrarSenha.setAttribute(
            "aria-label",
            senhaVisivel ? "Mostrar senha" : "Ocultar senha"
        );

        botaoMostrarSenha.setAttribute(
            "aria-pressed",
            String(!senhaVisivel)
        );
    }

    /**
     * Limpa mensagens anteriores.
     */
    function limparMensagens() {
        erroEmail.textContent = "";
        erroSenha.textContent = "";

        campoEmail.removeAttribute("aria-invalid");
        campoSenha.removeAttribute("aria-invalid");

        mensagemLogin.textContent = "";
        mensagemLogin.className = "login-mensagem";
    }

    /**
     * Exibe erro em um campo.
     */
    function exibirErroCampo(campo, elementoErro, mensagem) {
        campo.setAttribute("aria-invalid", "true");
        elementoErro.textContent = mensagem;
    }

    /**
     * Exibe uma mensagem geral no formulário.
     */
    function exibirMensagem(tipo, mensagem) {
        mensagemLogin.textContent = mensagem;
        mensagemLogin.className = `login-mensagem ${tipo}`;
    }

    /**
     * Valida o formato básico do e-mail.
     */
    function emailValido(email) {
        const expressaoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return expressaoEmail.test(email);
    }

    /**
     * Valida os campos antes de testar o login.
     */
    function validarFormulario(email, senha) {
        let formularioValido = true;

        if (!email) {
            exibirErroCampo(
                campoEmail,
                erroEmail,
                "Informe o e-mail."
            );

            formularioValido = false;
        } else if (!emailValido(email)) {
            exibirErroCampo(
                campoEmail,
                erroEmail,
                "Informe um e-mail válido."
            );

            formularioValido = false;
        }

        if (!senha) {
            exibirErroCampo(
                campoSenha,
                erroSenha,
                "Informe a senha."
            );

            formularioValido = false;
        } else if (senha.length < 8) {
            exibirErroCampo(
                campoSenha,
                erroSenha,
                "A senha deve possuir pelo menos 8 caracteres."
            );

            formularioValido = false;
        }

        return formularioValido;
    }

    /**
     * Simula o login administrativo.
     */
    function realizarLoginMockado(email, senha) {
        return (
            email === ADMIN_MOCK.email &&
            senha === ADMIN_MOCK.senha
        );
    }

    /**
     * Salva uma identificação temporária da sessão.
     *
     * Isso serve apenas para testar o front-end.
     * Não representa autenticação segura.
     */
    function salvarSessaoMockada(email) {
        const sessaoAdmin = {
            autenticado: true,
            email,
            dataLogin: new Date().toISOString()
        };

        sessionStorage.setItem(
            "irisAdmin",
            JSON.stringify(sessaoAdmin)
        );
    }

    /**
     * Envia e valida o formulário.
     */
    function enviarFormulario(event) {
        event.preventDefault();

        limparMensagens();

        const email = campoEmail.value.trim().toLowerCase();
        const senha = campoSenha.value;

        if (!validarFormulario(email, senha)) {
            return;
        }

        botaoLogin.disabled = true;
        botaoLogin.textContent = "Entrando...";

        const loginValido = realizarLoginMockado(email, senha);

        if (!loginValido) {
            exibirMensagem(
                "erro",
                "E-mail ou senha incorretos."
            );

            botaoLogin.disabled = false;
            botaoLogin.textContent = "Entrar";

            campoSenha.value = "";
            campoSenha.focus();

            return;
        }

        salvarSessaoMockada(email);

        exibirMensagem(
            "sucesso",
            "Login realizado com sucesso."
        );

        window.location.href = "painel.html";
    }

    /**
     * Remove o erro do campo quando o usuário volta a digitar.
     */
    campoEmail.addEventListener("input", () => {
        erroEmail.textContent = "";
        campoEmail.removeAttribute("aria-invalid");
    });

    campoSenha.addEventListener("input", () => {
        erroSenha.textContent = "";
        campoSenha.removeAttribute("aria-invalid");
    });

    botaoMostrarSenha.addEventListener(
        "click",
        alternarVisibilidadeSenha
    );

    formularioLogin.addEventListener(
        "submit",
        enviarFormulario
    );
});