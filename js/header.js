document.addEventListener("DOMContentLoaded", carregarHeader);

async function carregarHeader() {
    const headerContainer = document.getElementById("header-container");

    if (!headerContainer) {
        return;
    }

    try {
        const scriptHeader = document.querySelector(
            'script[src$="header.js"]'
        );

        if (!scriptHeader) {
            throw new Error("Não foi possível localizar o header.js.");
        }

        const headerUrl = new URL(
            "../components/header.html",
            scriptHeader.src
        );

        const response = await fetch(headerUrl);

        if (!response.ok) {
            throw new Error(
                `Erro ao carregar o header: ${response.status}`
            );
        }

        headerContainer.innerHTML = await response.text();

        configurarLinksHeader(scriptHeader.src);
        iniciarEventosHeader();
    } catch (error) {
        console.error("Erro ao carregar o header:", error);
    }
}

function configurarLinksHeader(scriptUrl) {
    const raizProjeto = new URL("../", scriptUrl);

    const links = document.querySelectorAll("[data-header-link]");

    links.forEach((link) => {
        const caminho = link.dataset.headerLink;

        if (caminho) {
            link.href = new URL(caminho, raizProjeto).href;
        }
    });

    const logo = document.querySelector("[data-header-home]");

    if (logo) {
        logo.href = new URL("home.html", raizProjeto).href;
    }
}

function iniciarEventosHeader() {
    const mobileButton = document.getElementById("header-mobile-button");
    const mobileNavigation = document.getElementById("header-navigation");
    const mobileLinks = document.querySelectorAll(
        ".header-mobile-navigation a"
    );
    const quickExitButton = document.querySelector(".header-quick-exit");

    function fecharMenuMobile() {
        if (!mobileButton || !mobileNavigation) {
            return;
        }

        mobileNavigation.classList.remove("active");
        mobileButton.classList.remove("active");
        mobileButton.setAttribute("aria-expanded", "false");
        mobileButton.setAttribute(
            "aria-label",
            "Abrir menu de navegação"
        );
    }

    if (mobileButton && mobileNavigation) {
        mobileButton.addEventListener("click", () => {
            const aberto = mobileNavigation.classList.toggle("active");

            mobileButton.classList.toggle("active", aberto);
            mobileButton.setAttribute(
                "aria-expanded",
                String(aberto)
            );

            mobileButton.setAttribute(
                "aria-label",
                aberto
                    ? "Fechar menu de navegação"
                    : "Abrir menu de navegação"
            );
        });

        mobileLinks.forEach((link) => {
            link.addEventListener("click", fecharMenuMobile);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                fecharMenuMobile();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                fecharMenuMobile();
            }
        });
    }

    if (quickExitButton) {
        quickExitButton.addEventListener("click", (event) => {
            event.preventDefault();

            sessionStorage.clear();
            window.location.replace("https://www.google.com");
        });
    }
}