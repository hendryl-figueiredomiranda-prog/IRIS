document.addEventListener("DOMContentLoaded", carregarFooter);

async function carregarFooter() {
    const footerContainer = document.getElementById("footer-container");

    if (!footerContainer) {
        return;
    }

    try {
        const scriptFooter = document.querySelector(
            'script[src$="footer.js"]'
        );

        if (!scriptFooter) {
            throw new Error("Não foi possível localizar o footer.js.");
        }

        const footerUrl = new URL(
            "../components/footer.html",
            scriptFooter.src
        );

        const response = await fetch(footerUrl);

        if (!response.ok) {
            throw new Error(
                `Erro ao carregar o footer: ${response.status}`
            );
        }

        footerContainer.innerHTML = await response.text();

        configurarFooter(scriptFooter.src);
    } catch (error) {
        console.error("Erro ao carregar o footer:", error);
    }
}

function configurarFooter(scriptUrl) {
    const raizProjeto = new URL("../", scriptUrl);

    const ano = document.getElementById("footer-year");

    if (ano) {
        ano.textContent = new Date().getFullYear();
    }

    const links = document.querySelectorAll("[data-footer-link]");

    links.forEach((link) => {
        const caminho = link.dataset.footerLink;

        if (caminho) {
            link.href = new URL(caminho, raizProjeto).href;
        }
    });

    const logo = document.querySelector("[data-footer-home]");

    if (logo) {
        logo.href = new URL("home.html", raizProjeto).href;
    }
}