/* =========================================================
   TOPBARBYE — SILLYTAVERN
   Masquer toute la barre supérieure
   Bouton 👀 pour afficher / masquer
   ========================================================= */

(() => {
    "use strict";

    const BUTTON_ID = "topbarbye-toggle";
    const STYLE_ID = "topbarbye-styles";

    const SELECTORS = [
        "#top-bar",
        "#top-settings-holder"
    ];

    let bar = null;
    let button = null;
    let observer = null;
    let hidden = true;
    let animationTimer = null;

    function findBar() {
        // Priorité au conteneur global.
        const topBar = document.querySelector("#top-bar");

        if (topBar) {
            return topBar;
        }

        // Solution de repli si le thème utilise
        // uniquement le conteneur des paramètres.
        return document.querySelector("#top-settings-holder");
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        const style = document.createElement("style");

        style.id = STYLE_ID;

        style.textContent = `
            /* Barre supérieure */

            .topbarbye-target {
                overflow: hidden !important;
                opacity: 1;
                visibility: visible;

                transition:
                    opacity 300ms ease,
                    max-height 350ms ease,
                    margin 350ms ease,
                    padding 350ms ease !important;
            }

            .topbarbye-target.topbarbye-hidden {
                opacity: 0 !important;
                pointer-events: none !important;
            }

            /* Bouton 👀 indépendant de la barre */

            #topbarbye-toggle {
                position: fixed !important;

                top: max(8px, env(safe-area-inset-top)) !important;
                right: max(8px, env(safe-area-inset-right)) !important;

                z-index: 2147483647 !important;

                display: flex !important;
                align-items: center !important;
                justify-content: center !important;

                width: 42px !important;
                height: 38px !important;

                min-width: 42px !important;
                min-height: 38px !important;

                margin: 0 !important;
                padding: 0 !important;

                border: 1px solid rgba(255,255,255,.15) !important;
                border-radius: 12px !important;

                background: rgba(25,25,28,.88) !important;
                color: white !important;

                font-size: 22px !important;
                line-height: 1 !important;

                cursor: pointer !important;
                pointer-events: auto !important;

                opacity: 1 !important;
                visibility: visible !important;

                -webkit-appearance: none !important;
                appearance: none !important;
                -webkit-tap-highlight-color: transparent;

                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);

                box-shadow: 0 3px 12px rgba(0,0,0,.2);

                transition:
                    background 180ms ease,
                    transform 180ms ease !important;
            }

            #topbarbye-toggle:active {
                transform: scale(.92);
            }

            #topbarbye-toggle:hover {
                background: rgba(55,55,60,.95) !important;
            }

            #topbarbye-toggle:focus-visible {
                outline: 2px solid
                    var(--SmartThemeQuoteColor, #7aa2f7);
                outline-offset: 3px;
            }

            @media (prefers-reduced-motion: reduce) {
                .topbarbye-target,
                #topbarbye-toggle {
                    transition: none !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function updateButton() {
        if (!button) {
            return;
        }

        button.textContent = "👀";

        button.setAttribute(
            "aria-pressed",
            String(hidden)
        );

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

    function hideBar() {
        if (!bar) {
            return;
        }

        clearTimeout(animationTimer);

        // Mesure la hauteur actuelle avant de lancer le fondu.
        const height = bar.scrollHeight;

        bar.style.maxHeight = height + "px";
        bar.style.visibility = "visible";

        // Force le navigateur à appliquer la hauteur initiale.
        void bar.offsetHeight;

        bar.classList.add("topbarbye-hidden");

        requestAnimationFrame(() => {
            if (!bar) {
                return;
            }

            bar.style.maxHeight = "0px";
            bar.style.marginTop = "0px";
            bar.style.marginBottom = "0px";
            bar.style.paddingTop = "0px";
            bar.style.paddingBottom = "0px";
        });

        animationTimer = setTimeout(() => {
            if (!bar || !hidden) {
                return;
            }

            bar.style.visibility = "hidden";
        }, 360);

        hidden = true;
        updateButton();
    }

    function showBar() {
        if (!bar) {
            return;
        }

        clearTimeout(animationTimer);

        // Rend la barre visible avant de lancer le fade-in.
        bar.style.visibility = "visible";
        bar.style.marginTop = "";
        bar.style.marginBottom = "";
        bar.style.paddingTop = "";
        bar.style.paddingBottom = "";

        bar.classList.remove("topbarbye-hidden");

        const height = bar.scrollHeight;

        bar.style.maxHeight = "0px";

        void bar.offsetHeight;

        requestAnimationFrame(() => {
            if (!bar) {
                return;
            }

            bar.style.maxHeight = height + "px";
        });

        animationTimer = setTimeout(() => {
            if (!bar || hidden) {
                return;
            }

            // Laisse la barre reprendre sa hauteur naturelle.
            bar.style.maxHeight = "none";
        }, 380);

        hidden = false;
        updateButton();
    }

    function toggleBar() {
        bar = findBar();

        if (!bar) {
            console.error(
                "[TopBarBye] Barre supérieure introuvable."
            );
            return;
        }

        if (hidden) {
            showBar();
        } else {
            hideBar();
        }
    }

    function createButton() {
        button = document.getElementById(BUTTON_ID);

        if (button) {
            return;
        }

        button = document.createElement("button");

        button.id = BUTTON_ID;
        button.type = "button";
        button.textContent = "👀";

        button.addEventListener("click", toggleBar);

        document.body.appendChild(button);

        updateButton();
    }

    function initialize() {
        injectStyles();

        bar = findBar();

        if (!bar) {
            return false;
        }

        bar.classList.add("topbarbye-target");

        createButton();

        // Masquer la barre dès le chargement.
        hideBar();

        console.info(
            "[TopBarBye] Barre détectée :",
            bar.id || bar.className
        );

        return true;
    }

    function start() {
        if (initialize()) {
            return;
        }

        observer = new MutationObserver(() => {
            if (initialize()) {
                observer.disconnect();
                observer = null;
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            start,
            { once: true }
        );
    } else {
        start();
    }
})();