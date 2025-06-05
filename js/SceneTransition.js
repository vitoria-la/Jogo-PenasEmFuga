class SceneTransition { // Classe responsável pela transição ao mudar de mapas
    constructor() {
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("sceneTransition");
    }

    fadeOut() {
        this.element.classList.add("fade-out"); // Ativa a classe fade-out no css 

        this.element.addEventListener("animationend", () => { 
            this.element.remove();// Caso acabe o fade-out, remove o elemento;
        }, {once: true})
    }

    init(container, callback) {
        this.createElement();
        container.appendChild(this.element);

        this.element.addEventListener("animationend", () => { 
            callback(); // Caso acabe o fade-in, chama de novo para o fade-out
        }, {once: true}) // Só acontece uma vez
    }

}