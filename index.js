(() => {
    "use strict";

    const BUTTON_ID = "topbarbye-toggle";
    const HIDDEN_CLASS = "topbarbye-hidden";

    // Barre supérieure de SillyTavern et solutions de repli.
    const SELECTORS = [
        "#top-bar",
        "#topbar",
        ".top-bar"
    ];

    let bar = null;
    let button = null;
    let hidden = true;

    // Injecte le CSS directement pour ne pas dépendre
    // du chargement du fichier style.css.
    function injectStyles() {
        if (document.getElementById("topbarbye-styles")) return;

        const style = document.createElement("style");
        style.id = "topbarbye-styles";

        style.textContent = `
            #${BUTTON_ID} {
                position: fixed !important;
                top: max(8px, env(safe-area-inset-top)) !important;
                right: max(8px, env(safe-area-inset-right)) !important;
                z-index: 2147483647 !important;

                display: flex !important;
                align-items: center !important;
                justify-content: center !important;

                width: 42px !important;
                height: 38px !important;
                padding: 0 !important;

                border: 1px solid rgba(255,255,255,.15) !important;
                border-radius: 12px !important;
                background: rgba(25,25,28,.85) !important;

                color: white !important;
                font-size: 22px !important;
                line-height: 1 !important;
                cursor: pointer !important;

                -webkit-tap-highlight-color: transparent;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);

                opacity: 1 !important;
                visibility: visible !important;
            }

            .topbarbye-target {
                overflow: hidden !important;
                transition:
                    opacity .3s ease,
                    max-height .3s ease,
                    padding .3s ease,
                    margin .3s ease !important;
            }

            .topbarbye-target.${HIDDEN_CLASS} {
                opacity: 0 !important;
                max-height: 0 !important;
                min-height: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
                border-top-width: 0 !important;
                border-bottom-width: 0 !important;
                pointer-events: none !important;
            }

            @media (prefers-reduced-motion: reduce) {
                .topbarbye-target {
                    transition: none !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function findBar() {
        for (const selector of SELECTORS) {
            const element = document.querySelector(selector);
            if (element) return element;
        }

        return null;
    }

    function applyState() {
        if (!bar || !button) return;

        bar.classList.add("topbarbye-target");
        bar.classList.toggle(HIDDEN_CLASS, hidden);

        button.textContent = "👀";
        button.setAttribute("aria-pressed", String(hidden));
        button.setAttribute(
            "aria-label",
            hidden
                ? "Afficher la barre supérieure"
                : "Masquer la barre supérieure"
        );

        button.title = hidden
            ? "Afficher la barre supérieure"
            : "Masquer la barre supérieure";
    }

    function createButton() {
        button = document.getElementById(BUTTON_ID);

        if (button) return;

        button = document.createElement("button");
        button.id = BUTTON_ID;
        button.type = "button";

        button.addEventListener("click", () => {
            hidden = !hidden;
            applyState();
        });

        document.body.appendChild(button);
    }

    function init() {
        injectStyles();

        bar = findBar();

        if (!bar) {
            console.warn(
                "[TopBarBye] Barre introuvable. Sélecteurs testés :",
                SELECTORS.join(", ")
            );
            return false;
        }

        createButton();
        applyState();

        console.log("[TopBarBye] Barre détectée :", bar);

        return true;
    }

    function start() {
        if (init()) return;

        // Attend que SillyTavern ait terminé de construire son interface.
        const observer = new MutationObserver(() => {
            if (init()) {
                observer.disconnect();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, {
            once: true
        });
    } else {
        start();
    }
})();