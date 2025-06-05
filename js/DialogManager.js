/* 
 * Classe responsável por gerenciar os diálogos do jogo
 * Controla a exibição, animação e navegação entre diálogos
 */
class DialogManager {
  constructor() {
    this.npcDialogs = {
      // Diálogos para cada NPC do jogo
      "galinhaBranca": [
        "Olá! Bem-vindo ao galinheiro.",
        "Estamos planejando uma fuga em breve.",
        "Você vai nos ajudar?"
      ],
      "galinhaMarrom": [
        "Psiu! Não deixe os guardas te verem.",
        "Eles estão de olho em todos nós."
      ],
      "Paova": [
        "Eu sou a Paova, a galinha mais velha daqui.",
        "Já vi muitas tentativas de fuga fracassarem.",
        "Mas dessa vez, acho que temos uma chance real!"
      ],
      "Clotilde": [
        "Olá, eu sou a Clotilde!",
        "Estou cansada de botar ovos todos os dias.",
        "Quero conhecer o mundo lá fora!"
      ],
      "Bernadette": [
        "Bernadette ao seu dispor!",
        "Dizem que existe um lugar onde as galinhas são livres.",
        "Você acredita nisso?"
      ],
      "galinhaSegurancaMarrom": [
        "Ei você! O que está fazendo aqui?",
        "Estou de olho em você...",
        "Não tente nada suspeito!"
      ]
    };
    
    // Referência para a mensagem de texto atual
    this.textMessage = null;
    
    // Armazena o estado de todos os NPCs antes do diálogo
    this.npcStates = {};
  }

  // Método para obter os diálogos de um NPC específico
  getDialogsForNpc(npcId) {
    return this.npcDialogs[npcId] || ["..."];
  }
  
  // Método para salvar o estado de todos os NPCs antes do diálogo
  saveAllNpcStates(map) {
    this.npcStates = {};
    
    // Percorre todos os objetos do mapa
    Object.values(map.gameObjects).forEach(object => {
      // Verifica se é um NPC (Person) com behaviorLoop definido
      if (object instanceof Person && 
          !object.isPlayerControlled && 
          object.behaviorLoop.length > 0) {
        
        // Salva o estado atual do NPC de forma mais completa
        this.npcStates[object.id] = {
          behaviorLoopIndex: object.behaviorLoopIndex,
          behaviorLoopActive: object.behaviorLoopActive,
          currentAnimationState: object.currentAnimationState,
          direction: object.direction,
          isStanding: object.isStanding,
          retryTimeout: object.retryTimeout ? true : false
        };
        
        // Se houver um timeout ativo, limpa para evitar conflitos
        if (object.retryTimeout) {
          clearTimeout(object.retryTimeout);
          object.retryTimeout = null;
        }
      }
    });
  }

  // Método para iniciar um diálogo com um NPC
  async startDialog(npcId, map) {
    const dialogs = this.getDialogsForNpc(npcId);
    
    // Salva o estado de todos os NPCs antes de iniciar o diálogo
    this.saveAllNpcStates(map);
    
    // Marca o mapa como em cutscene para evitar movimentação durante o diálogo
    map.isCutscenePlaying = true;
    
    // Percorre cada mensagem do diálogo
    for (let i = 0; i < dialogs.length; i++) {
      // Cria uma nova instância de TextMessage para cada mensagem
      const message = new TextMessage({
        text: dialogs[i],
        npc: map.gameObjects[npcId],
        map: map,
        onComplete: () => {
          // Callback executado quando a mensagem é concluída
        }
      });
      
      this.textMessage = message;
      
      // Aguarda a conclusão da exibição da mensagem atual
      await message.init();
    }
    
    // Quando todas as mensagens forem exibidas, marca o mapa como não mais em cutscene
    map.isCutscenePlaying = false;
    this.textMessage = null;
    
    // Reinicia os behaviorLoops de TODOS os NPCs após o diálogo
    this.forceResumeAllNpcBehaviors(map);
  }
  
  // Método para forçar a retomada dos behaviorLoops de TODOS os NPCs após o diálogo
  forceResumeAllNpcBehaviors(map) {
    // Pequeno delay para garantir que o mapa já não está mais em cutscene
    setTimeout(() => {
      // Percorre todos os objetos do mapa
      Object.values(map.gameObjects).forEach(object => {
        // Verifica se é um NPC (Person) com behaviorLoop definido e está montado
        if (object instanceof Person && 
            !object.isPlayerControlled && 
            object.behaviorLoop.length > 0 && 
            object.isMounted) {
          
          // Restaura o estado salvo do NPC, se disponível
          if (this.npcStates[object.id]) {
            const savedState = this.npcStates[object.id];
            
            // Restaura o índice do behaviorLoop
            object.behaviorLoopIndex = savedState.behaviorLoopIndex;
            
            // Restaura a direção do NPC
            if (savedState.direction) {
              object.direction = savedState.direction;
            }
            
            // Restaura o estado da animação
            if (savedState.currentAnimationState) {
              object.currentAnimationState = savedState.currentAnimationState;
            }
            
            // Restaura o estado de isStanding
            object.isStanding = false;
          }
          
          // Força a retomada do behaviorLoop para TODOS os NPCs
          if (object.forceBehaviorLoop) {
            object.forceBehaviorLoop(map);
          } else if (object.doBehaviorEvent) {
            // Fallback para o método padrão se forceBehaviorLoop não existir
            object.doBehaviorEvent(map);
          }
        }
      });
      
      // Limpa os estados salvos após restaurá-los
      this.npcStates = {};
    }, 100);
  }
}
