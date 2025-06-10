/* 
 * Classe responsável por exibir mensagens de texto no jogo
 * Controla a animação de texto caractere por caractere e navegação
 */
class TextMessage {
  constructor({ text, npc, map, onComplete }) {
    this.text = text;
    this.npc = npc;
    this.map = map;
    this.onComplete = onComplete;
    
    this.element = null;
    this.revealingText = false;
    this.isDone = false;
    this.nextIndicator = null;
    
    // Listener para tecla E (para acelerar texto ou avançar)
    this.keypressListener = null;
  }
  
  // Cria o elemento HTML da caixa de diálogo
  createElement() {
    // Cria o container principal
    this.element = document.createElement("div");
    this.element.classList.add("text-message");
    
    // Cria a caixa de diálogo
    const box = document.createElement("div");
    box.classList.add("text-message-box");
    this.element.appendChild(box);
    
    // Cria a seção para o nome do NPC (retângulo preto)
    const nameSection = document.createElement("div");
    nameSection.classList.add("text-message-name");
    nameSection.textContent = this.getNpcName();
    box.appendChild(nameSection);
    
    // Cria a seção para o conteúdo do diálogo (retângulo cinza)
    const dialogSection = document.createElement("div");
    dialogSection.classList.add("text-message-dialog-section");
    box.appendChild(dialogSection);
    
    // Cria o elemento para o conteúdo do texto
    const content = document.createElement("p");
    content.classList.add("text-message-content");
    dialogSection.appendChild(content);
    
    // Cria o indicador de próximo diálogo (seta)
    this.nextIndicator = document.createElement("span");
    this.nextIndicator.classList.add("text-message-next-indicator");
    this.nextIndicator.innerHTML = "▶";
    this.nextIndicator.style.display = "none"; // Inicialmente oculto
    
    // Adiciona o elemento ao DOM
    document.querySelector(".game-container").appendChild(this.element);
    
    // Posiciona a caixa de diálogo acima do NPC
    this.positionMessageBox();
  }
  
  // Obtém o nome formatado do NPC a partir do ID
  getNpcName() {
    if (!this.npc || !this.npc.id) return "???";
    
    // Formata o nome do NPC para exibição (remove camelCase, adiciona espaços, etc.)
    let name = this.npc.id;
    
    // Remove prefixos comuns como "galinha" ou "npc"
    name = name.replace(/^galinha/i, "");
    
    // Adiciona espaço antes de cada letra maiúscula e capitaliza a primeira letra
    name = name.replace(/([A-Z])/g, ' $1').trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    return name;
  }
  
  // Posiciona a caixa de diálogo acima do NPC
  positionMessageBox() {
    if (!this.element || !this.npc) return;
    
    const box = this.element.querySelector(".text-message-box");
    const cameraPerson = this.map.gameObjects.hero;
    
    // Calcula a posição relativa à câmera
    const x = this.npc.x - cameraPerson.x + utils.withGrid(47);
    const y = this.npc.y - cameraPerson.y + utils.withGrid(10); // Posiciona acima do NPC
    
    box.style.transform = `translate(${x}px, ${y}px)`;
  }
  
  // Anima o texto caractere por caractere
  async typeTextAnimation() {
    const element = this.element.querySelector(".text-message-content");
    element.textContent = "";
    
    this.revealingText = true;
    
    return new Promise(resolve => {
      let i = 0;
      
      // Intervalo para adicionar caracteres um por um
      const interval = setInterval(() => {
        if (i >= this.text.length) {
          clearInterval(interval);
          this.revealingText = false;
          this.isDone = true;
          
          // Adiciona um espaço após o último caractere e então a seta
          element.textContent += " ";
          element.appendChild(this.nextIndicator);
          this.nextIndicator.style.display = "inline-block"; // Mostra o indicador quando terminar
          
          resolve();
          return;
        }
        
        element.textContent += this.text[i];
        i++;
      }, 40); // Velocidade da animação
      
      // Método para acelerar texto quando pressionar "E"
      this.skipHandler = () => {
        if (this.revealingText) {
          clearInterval(interval);
          element.textContent = this.text + " "; // Adiciona espaço após o texto
          element.appendChild(this.nextIndicator);
          this.nextIndicator.style.display = "inline-block";
          this.revealingText = false;
          this.isDone = true;
          resolve();
        } else if (this.isDone) {
          this.done();
        }
      };
    });
  }
  
  // Inicializa a exibição da mensagem
  async init() {
    return new Promise(resolve => {
      // Cria o elemento HTML
      this.createElement();
      
      // Configura o listener para tecla E
      this.keypressListener = new KeypressListener("KeyE", () => {
        this.skipHandler();
      });
      
      // Inicia a animação de texto
      this.typeTextAnimation().then(() => {
        // Aguarda o usuário pressionar E para continuar
        this.done = () => {
          this.element.remove();
          this.keypressListener.unbind();
          resolve();
        };
      });
      
      // Atualiza a posição da caixa de diálogo durante o loop do jogo
      const updatePosition = () => {
        if (this.element) {
          this.positionMessageBox();
          requestAnimationFrame(updatePosition);
        }
      };
      updatePosition();
    });
  }
}
