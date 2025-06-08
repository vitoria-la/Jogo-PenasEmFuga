class Hud {
  constructor() {
    this.hotbarContainerElement = [];
    this.taskListIconElement = null;
    this.taskListPanelElement = null;
    this.coinContainerElement = null;
    this.coinTextElement = null;
    this.levelContainerElement = null;
    this.levelTextElement = null;
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

    // Medidor de moedas
    this.coinContainerElement = document.createElement("div");
    this.coinContainerElement.classList.add("coin-container");

    //cria o ícone da moeda
    const coinIcon = document.createElement("div");
    coinIcon.classList.add("coin-icon");

    // Cria o texto para contagem das moedas
    this.coinTextElement = document.createElement("div");
    this.coinTextElement.classList.add("coin-text");
    this.coinTextElement.innerText = "0"; // Valor inicial

    // Adiciona o ícone e o texto ao contêiner de moedas
    this.coinContainerElement.appendChild(coinIcon);
    this.coinContainerElement.appendChild(this.coinTextElement);
    
    // Adiciona o contêiner de moedas ao contêiner principal do jogo
    gameContainerElement.appendChild(this.coinContainerElement);

    // --- CRIAÇÃO DO MEDIDOR DE NÍVEL ---
    this.levelContainerElement = document.createElement("div");
    this.levelContainerElement.classList.add("level-container");
    
    // Cria o ícone do nível (reutilizando a classe do ícone de moeda para estilo)
    const levelIcon = document.createElement("div");
    levelIcon.classList.add("level-icon");

    // Cria o texto para a contagem de nível
    this.levelTextElement = document.createElement("div");
    this.levelTextElement.classList.add("level-text");
    this.levelTextElement.innerText = "1"; // Nível inicial

    // Adiciona o ícone e o texto ao contêiner de nível
    this.levelContainerElement.appendChild(levelIcon);
    this.levelContainerElement.appendChild(this.levelTextElement);
    
    // Adiciona o contêiner de nível ao contêiner principal do jogo
    gameContainerElement.appendChild(this.levelContainerElement);

  }

  updateCoins(count){
    this.coinTextElement.innerHTML = count;
  }

  updateLevel(count) {
    this.levelTextElement.innerText = count;
  }

}
