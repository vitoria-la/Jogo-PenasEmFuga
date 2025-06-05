class Hud {
    constructor() {
        this.hotbarContainerElement = [];
        this.task = null;
    }

    update() {
        // Aqui você pode atualizar os itens da hotbar futuramente
    }

    createElement() {
        this.hotbarElement = document.createElement("div");
        this.hotbarElement.classList.add("hotbar");
    }

    init(gameContainerElement) {
        // Cria o contêiner principal que vai segurar todas as hotbars
    this.hotbarContainerElement = document.createElement("div");
    this.hotbarContainerElement.classList.add("hotbar-container");

    // Cria 5 hotbars individuais
    for (let i = 0; i < 6; i++) {
      const singleHotbar = document.createElement("div");
      singleHotbar.classList.add("hotbar"); // Usa a mesma classe que você já tem
      // Você pode adicionar um ID ou data-attribute se precisar diferenciar no futuro
      // singleHotbar.id = `hotbar-item-${i + 1}`;
      this.hotbarContainerElement.appendChild(singleHotbar); // Adiciona a hotbar ao contêiner
    }

    // Adiciona o contêiner principal (com todas as hotbars dentro) ao contêiner do jogo
    if (gameContainerElement) {
      gameContainerElement.appendChild(this.hotbarContainerElement);
    } else {
      // Fallback se o gameContainerElement não for passado corretamente
      document.body.appendChild(this.hotbarContainerElement);
      console.warn("HUD container foi adicionado ao body. Verifique se gameContainerElement está sendo passado para Hud.init().");
    }
  }
}
