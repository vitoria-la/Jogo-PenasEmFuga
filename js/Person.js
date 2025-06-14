class Person extends GameObject {
    constructor(config){
        super(config);
        this.movingProgressRemaining = 0; // controla o progresso de um movimento em pixels

        this.direction = "down"; // Define a direção inicial do personagem

        this.isStanding = false; // Para saber se um NPC está no meio de uma animação de ficar parado

        this.intentPosition = null; // Ou é nulo ou é uma coordenada [x,y] e trata-se da intenção que um NPC tem de se mover

        this.isPlayerControlled = config.isPlayerControlled || false; // indica se este personagem é controlado pelo jogador

        this.directionUpdate = {
            "up"   : ["y", -1],
            "down" : ["y",  1],
            "left" : ["x", -1],
            "right": ["x",  1],
        }
        
        // Propriedades para o sistema de diálogo
        this.talking = false;
        this.interactionButton = null;

        this.isHorse = config.isHorse || false;

        if (this.isHorse) {
            this.direction = "right";
        }


        this.walkSoundEffect = new Audio(); // O efeito sonoro que o pinguim faz ao andar
    }

    update(state){
        if(this.movingProgressRemaining > 0){ // Se o personagem ainda estiver em progresso de um movimento, chama updatePosition() para continuar o movimento
            this.updatePosition();
        } else {

            //Caso: 
            if(!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){ // Se o personagem é controlado pelo jogador e há uma entrada de direção (state.arrow), ele inicia um comportamento de "caminhada"
                // ele só consegue andar caso não tenha uma cutscene acontecendo
                this.walkSoundEffect.startWalkingSound(); // Começa o som de andar
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                }) 
            }
            this.updateSprite(state); // Atualiza a animação do sprite com base no estado atual (parado ou andando)
            
            // Verifica proximidade com NPCs para mostrar botão de interação
            if (this.isPlayerControlled) {
                this.checkForNpcInteraction(state);
            }
        }
    }

    startBehavior(state, behavior){

        if (!this.isMounted) {
            return;
        }

        //define a direção do personagem para qualquer ele esteja
        this.direction = behavior.direction;
        if(behavior.type === "walk"){
            if(state.map.isSpaceTaken(this.x, this.y, this.direction)){ // Verifica se o próximo espaço na direção do movimento está ocupado por uma "parede". Se sim, o movimento é abortado
                this.walkSoundEffect.stopWalkingSound(); // Para o som de andar
                behavior.retry && setTimeout(() => { // se for um NPC que foi interrompido, espera 10 milissegundos e tenta andar de novo
                    this.startBehavior(state, behavior); // tenta andar de novo
                }, 10)
                
                return;
            }
            // Pronto para andar
            // state.map.moveWall(this.x,this.y,this.direction);
            this.movingProgressRemaining = 16;
            //this.walkSoundEffect.startWalkingSound();

            //Adiciona a  intenção da próxima posição
            const intentPosition = utils.nextPosition(this.x, this.y, this.direction);
            this.intentPosition = [
                intentPosition.x,
                intentPosition.y,
            ]

            this.updateSprite(state); // para animar os NPCs
        }

        if (behavior.type === "stand") { // se o tipo de animação for ficar parado
            this.isStanding = true;
            setTimeout(() => { 
                utils.emitEvent("PersonStandComplete", {
                    whoId: this.id // quando der o tempo, emite que foi completado esse comportamento e quem completou
                })
                this.isStanding = false;
            }, behavior.time) // espera pelo tempo especificado para esse comportamento
        }
    }

    updatePosition(){
        const [property,change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;

        if (this.movingProgressRemaining === 0) { // foi terminado o movimento de andar
            this.intentPosition = null; // Tira o que seria a próxima posição
            utils.emitEvent("PersonWalkingComplete", { // emite um sinal que foi terminado a animação de andar
                whoId: this.id  // manda quem terminou de andar
            });
            this.walkSoundEffect.stopWalkingSound(); // Para o som de andar
            // a estrutura do método emitEvent está na classe utils
        }
    }

    updateSprite(){

        if(this.movingProgressRemaining > 0){ // Se o personagem estiver se movendo, ele define a animação de "walk" (caminhada) na direção atual
            this.sprite.setAnimation("walk-"+this.direction);
            return;
        }
        
        this.sprite.setAnimation("idle-"+this.direction); // Se o personagem não estiver se movendo, ele define a animação de "idle" (parado) na direção atual
        
    }
    
    // Verifica se o jogador está próximo a algum NPC para mostrar botão de interação
    checkForNpcInteraction(state) {
        // Obtém todos os NPCs do mapa
        const npcs = Object.values(state.map.gameObjects).filter(obj => 
            !obj.isPlayerControlled && obj instanceof Person
        );
        
        // Verifica se o jogador está próximo a algum NPC
        let nearbyNpc = null;
        
        for (const npc of npcs) {
            // Calcula a distância entre o jogador e o NPC
            const distance = Math.abs(this.x - npc.x) + Math.abs(this.y - npc.y);
            
            // Se a distância for menor ou igual a 16 pixels (1 tile), considera como próximo
            if (distance <= utils.withGrid(1)) {
                nearbyNpc = npc;
                break;
            }
        }
        
        // Se encontrou um NPC próximo, mostra o botão de interação
        if (nearbyNpc && !state.map.isCutscenePlaying) {
            this.showInteractionButton(nearbyNpc, state.map);
            nearbyNpc.talking = true;
        } else {
            // Se não encontrou ou está em cutscene, esconde o botão
            this.hideInteractionButton();
            npcs.forEach(npc => npc.talking = false);
        }
    }
    
    // Mostra o botão de interação "E" acima do NPC
    showInteractionButton(npc, map) {
        if (!this.interactionButton) {
            this.interactionButton = document.createElement("div");
            this.interactionButton.classList.add("interaction-button");
            this.interactionButton.textContent = "E";
            document.querySelector(".game-container").appendChild(this.interactionButton);
        }
        
        // Posiciona o botão centralizado acima do NPC
        const cameraPerson = map.gameObjects.hero;
        
        // Centraliza horizontalmente e posiciona acima do sprite do NPC
        const x = npc.x - cameraPerson.x + utils.withGrid(1);
        
        // Posiciona o botão exatamente acima do sprite do NPC
        // Usa um deslocamento vertical menor para garantir que fique logo acima da cabeça do NPC
        const y = npc.y - utils.withGrid(15) - cameraPerson.y + utils.withGrid(0);
        
        this.interactionButton.style.transform = `translate(${x}px, ${y}px)`;
        this.interactionButton.style.display = "block";
        
        // Armazena o NPC atual para interação
        this.currentInteractingNpc = npc;
    }
    
    // Esconde o botão de interação
    hideInteractionButton() {
        if (this.interactionButton) {
            this.interactionButton.style.display = "none";
        }
        this.currentInteractingNpc = null;
    }
    
    // Inicia um diálogo com o NPC atual
    startDialog(map) {
        if (this.currentInteractingNpc && !map.isCutscenePlaying) {
            // Verifica se o DialogManager existe
            if (!map.dialogManager) {
                map.dialogManager = new DialogManager();
            }
           if(this.currentInteractingNpc.id === "galinhaPenosa"){
                map.dialogManager.startDialog("galinhaPenosa", map, () => {
                    openShop(); // Chama a função openShop() após o diálogo
                });
            }else {
                // Inicia o diálogo usando o DialogManager
            map.dialogManager.startDialog(this.currentInteractingNpc.id, map);
            }
        }
   
            // Esconde o botão de interação durante o diálogo
            this.hideInteractionButton();
        }
    }

