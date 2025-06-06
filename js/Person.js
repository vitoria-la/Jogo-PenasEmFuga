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
    }

    update(state){
        if(this.movingProgressRemaining > 0){ // Se o personagem ainda estiver em progresso de um movimento, chama updatePosition() para continuar o movimento
            this.updatePosition();
        } else {

            //Caso: 
            if(!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){ // Se o personagem é controlado pelo jogador e há uma entrada de direção (state.arrow), ele inicia um comportamento de "caminhada"
                // ele só consegue andar caso não tenha uma cutscene acontecendo
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                }) 
            }
            this.updateSprite(state); // Atualiza a animação do sprite com base no estado atual (parado ou andando)
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

                behavior.retry && setTimeout(() => { // se for um NPC que foi interrompido, espera 10 milissegundos e tenta andar de novo
                    this.startBehavior(state, behavior); // tenta andar de novo
                }, 10)
                
                return;
            }
            // Pronto para andar
            // state.map.moveWall(this.x,this.y,this.direction);
            this.movingProgressRemaining = 16;

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
            })
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
}