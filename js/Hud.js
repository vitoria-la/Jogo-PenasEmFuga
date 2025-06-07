class Hud {
  constructor() {
    this.hotbarContainerElement = [];
    this.taskListIconElement = null;
    this.taskListPanelElement = null;
  }

  update() {

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
      console.warn("HUD container foi adicionado ao body.");
    }

    this.taskListIconElement = document.createElement("div");
    this.taskListIconElement.classList.add("task-list-icon");
    if (gameContainerElement) {
      gameContainerElement.appendChild(this.taskListIconElement);
    } else {
      document.body.appendChild(this.taskListIconElement);
      console.warn("Ícone da lista de tarefas foi adicionado ao body.");
    }

    this.taskListPanelElement = document.createElement("div");
    this.taskListPanelElement.classList.add("task-list-panel");

    this.taskListPanelElement.innerHTML = `
            <h3>Minhas tarefas</h3>
            <ul>
              <li>Encontrar item X</li>
              <li>Falar com galinha Y</li>
              <li>Plantar trigo</li>
              <li>Colher milho</li>
            </ul>
            <button class="task-list-close-button">Fechar</button>
    `;
    
    if(gameContainerElement){
      gameContainerElement.appendChild(this.taskListPanelElement);
    } else {
      document.body.appendChild(this.taskListPanelElement);
      console.warn("Painel da lista de tarefa foi adicionado ao body.");
    }

    this.taskListIconElement.addEventListener('click', () => {
      this.taskListPanelElement.classList.toggle('visible');
    });

    const closeButton = this.taskListPanelElement.querySelector('.task-list-close-button');
      if(closeButton){
        closeButton.addEventListener('click', () => {
        this.taskListPanelElement.classList.remove('visible');
      })
    }

  }
}
