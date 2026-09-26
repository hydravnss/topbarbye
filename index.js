/* TopBarBye — Hide/show SillyTavern's top bar with a fade */
(() => {
    "use strict";

    const BUTTON_ID = "topbarbye-toggle";
    const HIDDEN_CLASS = "topbarbye-hidden";
    const SELECTORS = ["#top-bar", "#topbar"];

    let topBar = null;
    let toggleButton = null;
    let observer = null;

    function findTopBar() {
        for (const selector of SELECTORS) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    function setHidden(hidden) {
        topBar = findTopBar() || topBar;
        if (!topBar) return;

        topBar.classList.toggle(HIDDEN_CLASS, hidden);

        toggleButton?.classList.toggle(
            "topbarbye-is-hidden",
            hidden
        );

        toggleButton?.setAttribute(
            "aria-pressed",
            String(hidden)
        );

        toggleButton?.setAttribute(
            "aria-label",
            hidden
                ? "Afficher la barre supérieure"
                : "Masquer la barre supérieure"
        );

        toggleButton?.setAttribute(
            "title",
            hidden
                ? "Afficher la barre supérieure"
                : "Masquer la barre supérieure"
        );
    }

    function createButton() {
        if (document.getElementById(BUTTON_ID)) {
            toggleButton = document.getElementById(BUTTON_ID);
            return;
        }

        toggleButton = document.createElement("button");

        toggleButton.id = BUTTON_ID;
        toggleButton.type = "button";
        toggleButton.textContent = "👀";

        toggleButton.setAttribute(
            "aria-label",
            "Afficher la barre supérieure"
        );

        toggleButton.setAttribute(
            "title",
            "Afficher la barre supérieure"
        );

        toggleButton.setAttribute("aria-pressed", "true");

        toggleButton.addEventListener("click", () => {
            topBar = findTopBar() || topBar;

            if (!topBar) return;

            const isHidden =
                topBar.classList.contains(HIDDEN_CLASS);

            setHidden(!isHidden);
        });

        document.body.appendChild(toggleButton);
    }

    function initialize() {
        topBar = findTopBar();

        if (!topBar) return false;

        createButton();

        // Hide the top bar on startup.
        requestAnimationFrame(() => setHidden(true));

        return true;
    }

    function start() {
        if (initialize()) return;

        observer = new MutationObserver(() => {
            if (initialize()) {
                observer?.disconnect();
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