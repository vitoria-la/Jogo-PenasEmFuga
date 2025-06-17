class PlantingSystem {
  constructor(overworld) {
    this.overworld = overworld; // Referência ao jogo principal
    this.tipoPlantaSelecionado = 'trigo';
    this.onCloseCallback = null;

    // Elementos do DOM
    this.popupElement = document.getElementById('plantacao-popup');
    this.gridElement = this.popupElement.querySelector('.grid-plantacao');
    this.closeButton = this.popupElement.querySelector('#fechar-popup');
    this.harvestAllButton = this.popupElement.querySelector('#colher-tudo');
    this.trigoButton = this.popupElement.querySelector('#btn-trigo');
    this.milhoButton = this.popupElement.querySelector('#btn-milho');
  }

  // Inicializa os eventos do sistema
  init() {
    this.closeButton.addEventListener('click', () => this.close());
    this.trigoButton.addEventListener('click', () => this.selecionarPlanta('trigo'));
    this.milhoButton.addEventListener('click', () => this.selecionarPlanta('milho'));
    this.harvestAllButton.addEventListener('click', () => this.colherTudo());
    
    this.criarGrid();
    this.atualizarBotoesTipoPlanta();
  }

  // Abre o pop-up de plantação
  open(onCloseCallback) {
    this.onCloseCallback = onCloseCallback;
    this.popupElement.style.display = 'flex';
    this.moverHudParaPopup(true);
  }

  // Fecha o pop-up de plantação
  close() {
    this.popupElement.style.display = 'none';
    this.moverHudParaPopup(false);
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  // Seleciona o tipo de planta
  selecionarPlanta(tipo) {
    this.tipoPlantaSelecionado = tipo;
    this.atualizarBotoesTipoPlanta();
  }

  // Atualiza a aparência dos botões de seleção
  atualizarBotoesTipoPlanta() {
    this.trigoButton.classList.toggle('selected', this.tipoPlantaSelecionado === 'trigo');
    this.milhoButton.classList.toggle('selected', this.tipoPlantaSelecionado === 'milho');
  }

  // Move a hotbar para dentro ou fora do pop-up
  moverHudParaPopup(mostrar) {
    const hotbarContainer = document.querySelector('.hotbar-container');
    const popupInventario = this.popupElement.querySelector('.popup-inventario');
    const gameContainer = document.querySelector('.game-container');
    
    if (!hotbarContainer) return;
    
    if (mostrar && popupInventario && hotbarContainer.parentElement !== popupInventario) {
      popupInventario.appendChild(hotbarContainer);
    } else if (!mostrar && gameContainer && hotbarContainer.parentElement !== gameContainer) {
      gameContainer.appendChild(hotbarContainer);
    }
  }

  // Cria a grade 3x3
  criarGrid() {
    this.gridElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const bloco = document.createElement('div');
      bloco.className = 'bloco-plantacao';
      bloco.dataset.index = i;
      bloco.setAttribute('data-tipo', '');
      bloco.setAttribute('data-etapa', '');
      bloco.style.backgroundImage = "url('./assets/img/terreno.png')";

      const imgEstagio = document.createElement('img');
      imgEstagio.className = 'img-estagio-plantacao';
      imgEstagio.style.display = 'none';
      bloco.appendChild(imgEstagio);

      bloco.addEventListener('click', () => this.onBlocoClick(bloco));
      this.gridElement.appendChild(bloco);
    }
  }

  // Lógica para quando um bloco é clicado
  onBlocoClick(bloco) {
    const etapa = bloco.getAttribute('data-etapa');
    const tipo = bloco.getAttribute('data-tipo');

    // Se estiver pronto para colher
    if (etapa === 'crescido') {
      this.colher(bloco);
      return;
    }

    // Se já estiver plantado, não faz nada
    if (etapa) return;

    // Tenta plantar
    this.plantar(bloco);
  }
  
  // Tenta usar uma semente e plantar
  plantar(bloco) {
    const sementeId = this.tipoPlantaSelecionado === 'trigo' ? 'Semente de Trigo' : 'Semente de Milho';
    const playerItems = this.overworld.playerState.items;
    
    let sementeSlot = -1;
    for (let i = 0; i < playerItems.length; i++) {
        if (playerItems[i] && playerItems[i].name === sementeId) {
            sementeSlot = i;
            break;
        }
    }

    if (sementeSlot === -1 || playerItems[sementeSlot].quantity <= 0) {
      alert(`Você não tem sementes de ${this.tipoPlantaSelecionado}!`);
      return;
    }

    // Usa a semente
    playerItems[sementeSlot].quantity -= 1;
    if(playerItems[sementeSlot].quantity === 0) {
        playerItems[sementeSlot] = null;
    }
    this.overworld.hud.updateHotbarSlot(sementeSlot, playerItems[sementeSlot]);

    // Inicia o crescimento
    const tipoPlanta = this.tipoPlantaSelecionado;
    const imgEstagio = bloco.querySelector('.img-estagio-plantacao');
    bloco.setAttribute('data-tipo', tipoPlanta);
    bloco.setAttribute('data-etapa', 'terra');
    imgEstagio.src = './assets/img/terra.png';
    imgEstagio.style.display = 'block';

    setTimeout(() => {
      bloco.setAttribute('data-etapa', 'pequeno');
      imgEstagio.src = `./assets/img/${tipoPlanta}-pequeno.png`;
      setTimeout(() => {
        bloco.setAttribute('data-etapa', 'medio');
        imgEstagio.src = `./assets/img/${tipoPlanta}-medio.png`;
        setTimeout(() => {
          bloco.setAttribute('data-etapa', 'crescido');
          imgEstagio.src = `./assets/img/${tipoPlanta}-crescido.png`;
        }, 3000);
      }, 3000);
    }, 2000);
  }

  // Colhe uma planta individual
  colher(bloco) {
      const tipoColhido = bloco.getAttribute('data-tipo');
      const itemColhido = {
          id: tipoColhido,
          name: tipoColhido.charAt(0).toUpperCase() + tipoColhido.slice(1), // Trigo ou Milho
          src: `./assets/img/${tipoColhido}.png`,
          quantity: 1
      };

      this.overworld.addItemToHotbar(itemColhido);
      this.mostrarSpanColheita(tipoColhido, bloco);

      // Limpa o bloco
      bloco.setAttribute('data-tipo', '');
      bloco.setAttribute('data-etapa', '');
      const imgEstagio = bloco.querySelector('.img-estagio-plantacao');
      imgEstagio.style.display = 'none';
      imgEstagio.src = '';

      // Sorteia sementes extras
      this.sortearSementes(tipoColhido, bloco);
  }
  
  // Colhe todas as plantas maduras
  colherTudo() {
      const blocos = this.gridElement.querySelectorAll('.bloco-plantacao');
      let colheuAlgum = false;
      blocos.forEach(bloco => {
          if (bloco.getAttribute('data-etapa') === 'crescido') {
              this.colher(bloco);
              colheuAlgum = true;
          }
      });

      if (colheuAlgum) {
          alert('Colheita realizada com sucesso!');
      } else {
          alert('Não há nada para colher!');
      }
  }

  // Sorteia sementes extras ao colher
  sortearSementes(tipo, bloco) {
    const sorteio = Math.random();
    let sementesGanhas = 0;
    if (sorteio < 0.15) { // 15% de chance de ganhar 2
        sementesGanhas = 2;
    } else if (sorteio < 0.5) { // 35% de chance de ganhar 1
        sementesGanhas = 1;
    }
    
    if (sementesGanhas > 0) {
        const sementeItem = {
            id: tipo === 'trigo' ? 2 : 4, // ID da semente correspondente na loja
            name: tipo === 'trigo' ? 'Semente de Trigo (x5)' : 'Semente de Milho (x5)',
            src: `./assets/img/${tipo}Semente.png`,
            quantity: sementesGanhas
        };
        this.overworld.addItemToHotbar(sementeItem);
        this.mostrarSpanColheita(`${sementesGanhas} semente(s) de ${tipo}!`, bloco, true);
    }
  }

  // Mostra a mensagem flutuante de colheita
  mostrarSpanColheita(texto, bloco, isSemente = false) {
    const span = document.createElement('span');
    span.textContent = `+ ${texto}`;
    span.className = 'span-colheita'; // Adiciona a classe para animação
    span.style.position = 'fixed';
    span.style.color = isSemente ? '#ffe066' : '#fff';
    span.style.fontWeight = 'bold';
    span.style.fontSize = '1.1rem';
    span.style.pointerEvents = 'none';
    span.style.textShadow = '-1px -1px 0 #222, 1px -1px 0 #222, -1px 1px 0 #222, 1px 1px 0 #222';
    span.style.zIndex = 2000;
    
    const rect = bloco.getBoundingClientRect();
    span.style.left = (rect.left + rect.width / 2) + 'px';
    span.style.top = (rect.top - (isSemente ? 48 : 24)) + 'px'; // Posição diferente para semente
    
    document.body.appendChild(span);
    setTimeout(() => {
      span.remove();
    }, 1200);
  }
}