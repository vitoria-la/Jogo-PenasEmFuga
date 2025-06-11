class Hud {
  constructor() {
    //this.hotbarContainerElement = [];
    this.hotbarSlots = [];
    this.taskListIconElement = null;
    this.taskListPanelElement = null;
    this.coinContainerElement = null;
    this.coinTextElement = null;
    this.levelContainerElement = null;
    this.levelTextElement = null;
    this.easterEggIconElement = null;
    this.easterEggPanelElement = null;
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

      this.hotbarSlots.push(singleHotbar);
    }
    gameContainerElement.appendChild(this.hotbarContainerElement);

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

    const taskCloseButton  = this.taskListPanelElement.querySelector('.task-list-close-button');
      if(taskCloseButton){
        taskCloseButton.addEventListener('click', () => {
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

    // Cria o ícone de easter egg
    this.easterEggIconElement = document.createElement("div");
    this.easterEggIconElement.classList.add("easter-egg-icon");
    gameContainerElement.appendChild(this.easterEggIconElement);

    // Cria o painel de easter egg
    this.easterEggPanelElement = document.createElement("div");
    this.easterEggPanelElement.classList.add("easter-egg-panel");
    this.easterEggPanelElement.innerHTML = `
      <h3>Segredos Encontrados</h3>
      <ul class="easter-egg-list">
        <li>Nenhum segredo encontrado ainda...</li>
      </ul>
      <button class="easter-egg-close-button">Fechar</button>
    `;
    gameContainerElement.appendChild(this.easterEggPanelElement);

    // Adiciona o evento para abrir/fechar o painel ao clicar no ícone
    this.easterEggIconElement.addEventListener('click', () => {
      this.easterEggPanelElement.classList.toggle('visible');
    });

    // Adiciona o evento para o botão de fechar
    const easterEggCloseButton = this.easterEggPanelElement.querySelector('.easter-egg-close-button');
    if (easterEggCloseButton) {
      easterEggCloseButton.addEventListener('click', () => {
        this.easterEggPanelElement.classList.remove('visible');
      });
    }

  }

  updateEasterEggs(foundEggs) {
    const listElement = this.easterEggPanelElement.querySelector(".easter-egg-list");
    
    // Limpa a lista atual
    listElement.innerHTML = "";

    // Se não houver easter eggs, mostra uma mensagem padrão
    if (foundEggs.length === 0) {
      listElement.innerHTML = `<li>Nenhum segredo encontrado ainda...</li>`;
      return;
    }
    
    // Para cada easter egg encontrado, cria um item na lista
    foundEggs.forEach(eggId => {
      const li = document.createElement("li");
      li.textContent = `Descoberta: ${eggId}`; // Exemplo de texto
      listElement.appendChild(li);
    });
  }

  updateCoins(count){
    this.coinTextElement.innerHTML = count;
  }

  updateLevel(count) {
    this.levelTextElement.innerText = count;
  }

  updateHotbarSlot(slotIndex, item) {
    const slotElement = this.hotbarSlots[slotIndex];
    if (!slotElement) {
      return; // Sai se o slot não existir
    }

    // Limpa o conteúdo anterior do slot
    slotElement.innerHTML = "";

    // Se não houver item, o slot fica vazio
    if (!item) {
      return;
    }

    // Cria e adiciona a imagem do item
    const itemImage = document.createElement("img");
    itemImage.src = item.src;
    itemImage.alt = item.name || "Item";
    slotElement.appendChild(itemImage);

    // Cria e adiciona o texto da quantidade, se a quantidade for maior que 1
    if (item.quantity > 1) {
      const quantityText = document.createElement("span");
      quantityText.classList.add("item-quantity");
      quantityText.innerText = item.quantity;
      slotElement.appendChild(quantityText);
    }
  }
}
