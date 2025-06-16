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
      ],
      "frog2": [
        "Eu amo programar hahaha HAHAHAHAHAHA"
      ],
      "galinhaPenosa": [
        "Oi, eu sou a Penosa!",
        "Você veio conhecer minha vendinha né??",
        "Tenho os melhores produtos do galinheiro!",
        "Dá uma olhada!",
      ],
      "galinhaBrancaQuestIcon": [
        "Hmmmm",
        "Não era para isso ter acontecido...",
        "Isso não aconteceu, ok?",
      ],
      
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

  // Método para iniciar um diálogo com um NPC
  async startDialog(npcId, map, onDialogEnd) {
    const dialogs = this.getDialogsForNpc(npcId);
    
    // Salva o estado de todos os NPCs antes de iniciar o diálogo
    //this.saveAllNpcStates(map);
    
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
    //this.forceResumeAllNpcBehaviors(map);

    if(typeof onDialogEnd === "function"){
      // Chama a função onDialogEnd se estiver definida
      onDialogEnd();
    }
  }
  
}
