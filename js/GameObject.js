class GameObject {
    constructor (config, value, value2){
        this.id = null; // o id de um objeto é o nome dele
        this.isMounted = false; // indica se o objeto está montado no mapa do jogo
        this.x = config.x || 0; //define a posição horizontal (eixo X), se não tiver uma posição o valor será 0
        this.y = config.y || 0; //define a posição vertical (eixo Y), se não tiver uma posição o valor será 0
        this.direction = config.direction || "down"; // define a direção para qual o objeto está olhando, por padrão, para baixo
        this.sprite = new Sprite({
            gameObject: this, // herda todas as propriedades de GameObject
            src: config.src || "./assets/img/pinguim-spriteSheet.png", // Define o caminho da imagem. Se não tiver é usada a do caminho fornecido (no caso o personagem principal)
            isFrog: config.isFrog || false, // Para saber se é um sapo ou não. Caso não seja definido, ele assume que é falso
            isEasterEgg: config.isEasterEgg || false,
        }); 
        this.behaviorLoop = config.behaviorLoop || [];  // é um array que vai ser usado para definir os comportamentos normais dos NPCs
        this.behaviorLoopIndex = 0; // serve para saber qual comportamento está acontecendo
        this.retryTimeout = null; // Serve para um NPC retomar o seu comportamento após algo
        
        // Flag para controlar se o behaviorLoop está ativo
        this.behaviorLoopActive = true;
        
        // Armazena o estado atual da animação
        this.currentAnimationState = null;
    }

    mount(map){ // metodo responsável por montar o objeto no mapa
        //console.log("mouting")
        this.isMounted = true; // altera o estado para true, indicando que o objeto está ativo no mapa
        
        // se tiver um comportamento, ele vai começar depois de um delay 
        setTimeout( () => {
            this.doBehaviorEvent(map); // depois de 10 milissegundos ele chama o método doBehaviorEvent
        }, 10) 
    }

    update(){

    }

    async doBehaviorEvent(map) { // Configuração e preparação para rodar os comportamentos

        // se o NPC não tiver uma animação (ou estiver em uma animação de ficar parado), termina por aqui mesmo
        if (this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }
        // Se estiver em uma cutscene, para as animações e espera um tempo para ver se ela já terminou
        if (map.isCutscenePlaying) {
            if (this.retryTimeout) { // Se já tiver um tempo, limpa ele!
                clearTimeout(this.retryTimeout);
            }
            
            // Marca que o behaviorLoop não está ativo durante a cutscene
            this.behaviorLoopActive = false;
            
            this.retryTimeout = setTimeout(() => {
                this.doBehaviorEvent(map);
            }, 1000);
            return;
        }

        // Marca que o behaviorLoop está ativo
        this.behaviorLoopActive = true;

        // arrumando para começar a animação
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex]; // armazena em eventConfig o comportamento atual do array 
        eventConfig.who = this.id; // eventConfig.who recebe quem está fazendo esse comportamento

        // Salva o estado atual da animação
        this.currentAnimationState = {
            type: eventConfig.type,
            direction: eventConfig.direction,
            index: this.behaviorLoopIndex
        };

        const eventHandler = new OverworldEvent({map, event: eventConfig});  // os eventos no geral vão acontecer na classe OverworldEvent, como comportamentos, mensagens, múscia, etc
        await eventHandler.init();  // precisamos esperar acabar a animação para contiuar
        // init é um método da classe OverworldEvent

        // arrumando para começar a próxima etapa na animação
        this.behaviorLoopIndex += 1; // ao acabar essa etapa de animação, ele atualiza para a próxima
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0; // se chegar ao final, ele coloca o index na primeira etapa da animação para começar de novo
        }

        // começa de novo
        this.doBehaviorEvent(map);
    }
    
    // Método para retomar o behaviorLoop após uma cutscene
    resumeBehaviorLoop(map) {
        // Só retoma se não estiver ativo e tiver comportamentos definidos
        if (!this.behaviorLoopActive && this.behaviorLoop.length > 0 && this.isMounted) {
            // Limpa qualquer timeout existente
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }
            
            // Força a flag para true para garantir que o loop seja reiniciado
            this.behaviorLoopActive = true;
            
            // Inicia o behaviorLoop imediatamente
            this.doBehaviorEvent(map);
        }
    }
    
    // Método para forçar a retomada do behaviorLoop
    forceBehaviorLoop(map) {
        // Força a retomada do behaviorLoop independentemente do estado atual
        if (this.behaviorLoop.length > 0 && this.isMounted) {
            // Limpa qualquer timeout existente
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }
            
            // Força a flag para true para garantir que o loop seja reiniciado
            this.behaviorLoopActive = true;
            
            // Inicia o behaviorLoop imediatamente
            this.doBehaviorEvent(map);
        }
    }
}
