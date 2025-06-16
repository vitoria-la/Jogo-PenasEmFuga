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

  init(gameContainerElement, overworld) {
    // --- HOTBAR ---
    this.hotbarContainerElement = document.createElement("div");
    this.hotbarContainerElement.classList.add("hotbar-container");
    for (let i = 0; i < 6; i++) {
      const singleHotbar = document.createElement("div");
      singleHotbar.classList.add("hotbar");
      this.hotbarContainerElement.appendChild(singleHotbar);
      this.hotbarSlots.push(singleHotbar);
    }
    gameContainerElement.appendChild(this.hotbarContainerElement);

    // --- PAINEL DE TAREFAS (CRIADO APENAS UMA VEZ) ---
    this.taskListIconElement = document.createElement("div");
    this.taskListIconElement.classList.add("task-list-icon");
    gameContainerElement.appendChild(this.taskListIconElement);

    this.taskListPanelElement = document.createElement("div");
    this.taskListPanelElement.classList.add("task-list-panel");
    this.taskListPanelElement.innerHTML = `
        <h3>Minhas tarefas</h3>
        <ul>
            </ul>
        <div class="debug-quest-container">
            <hr>
            <h4>Pular para Quest (Debug)</h4>
            <input type="text" id="quest-id-input" placeholder="ID da Quest (ex: Q5)">
            <button id="skip-quest-button">Pular</button>
        </div>
        <button class="task-list-close-button">Fechar</button>
    `;
    gameContainerElement.appendChild(this.taskListPanelElement);

    // --- MEDIDOR DE MOEDAS ---
    this.coinContainerElement = document.createElement("div");
    this.coinContainerElement.classList.add("coin-container");
    this.coinContainerElement.innerHTML = `
      <div class="coin-icon"></div>
      <div class="coin-text">0</div>
    `;
    this.coinTextElement = this.coinContainerElement.querySelector(".coin-text");
    gameContainerElement.appendChild(this.coinContainerElement);

    // --- MEDIDOR DE NÍVEL ---
    this.levelContainerElement = document.createElement("div");
    this.levelContainerElement.classList.add("level-container");
    this.levelContainerElement.innerHTML = `
      <div class="level-icon"></div>
      <div class="level-text">1</div>
    `;
    this.levelTextElement = this.levelContainerElement.querySelector(".level-text");
    gameContainerElement.appendChild(this.levelContainerElement);
    
    // --- PAINEL DE EASTER EGGS ---
    this.easterEggIconElement = document.createElement("div");
    this.easterEggIconElement.classList.add("easter-egg-icon");
    gameContainerElement.appendChild(this.easterEggIconElement);

    this.easterEggPanelElement = document.createElement("div");
    this.easterEggPanelElement.classList.add("easter-egg-panel");
    this.easterEggPanelElement.innerHTML = `
      <h3>Segredos Encontrados</h3>
      <ul class="easter-egg-list"></ul>
      <button class="easter-egg-close-button">Fechar</button>
    `;
    gameContainerElement.appendChild(this.easterEggPanelElement);

    // --- LÓGICA DOS EVENT LISTENERS ---
    this.taskListIconElement.addEventListener('click', () => this.taskListPanelElement.classList.toggle('visible'));
    this.taskListPanelElement.querySelector('.task-list-close-button').addEventListener('click', () => this.taskListPanelElement.classList.remove('visible'));
    
    this.easterEggIconElement.addEventListener('click', () => this.easterEggPanelElement.classList.toggle('visible'));
    this.easterEggPanelElement.querySelector('.easter-egg-close-button').addEventListener('click', () => this.easterEggPanelElement.classList.remove('visible'));

    const skipButton = this.taskListPanelElement.querySelector("#skip-quest-button");
    const questInput = this.taskListPanelElement.querySelector("#quest-id-input");

    if (skipButton && questInput && overworld) {
      skipButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const questId = questInput.value.trim().toUpperCase();
        if (questId) {
          overworld.skipToQuest(questId);
          questInput.value = "";
        }
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

  removeHotbarSlotItem(slotIndex) {
    const item = this.hotbarItems[slotIndex];
    if (!item) return;

    item.quantity -= 1;
    if (item.quantity <= 0) {
        this.hotbarItems[slotIndex] = null;
        this.hotbarSlots[slotIndex].innerHTML = ""; // Limpa o slot visualmente
    } else {
        this.updateHotbarSlot(slotIndex, item); // Atualiza o slot visualmente com a nova quantidade
    }
}

  // Método para atualizar a lista de tarefas
  updateTasks(activeQuestId, playerState) {
    const listElement = this.taskListPanelElement.querySelector("ul");
    listElement.innerHTML = ""; // Limpa a lista

    if (!activeQuestId) {
      listElement.innerHTML = `<li>Nenhuma tarefa no momento.</li>`;
      return;
    }

    const quest = window.QuestList.find(q => q.id === activeQuestId);
    if (quest) {
      const li = document.createElement("li");
        
      // Pega o progresso atual do estado do jogador
      const currentProgress = playerState.questFlags[quest.progressKey] || 0;
        
      // Monta o texto com o progresso
      li.textContent = `${quest.description} (${currentProgress}/${quest.progressTarget})`;
        
      listElement.appendChild(li);
    }
  }
}
