class PlantableSpot extends GameObject {
    constructor(config) {
        super(config);
        // Configuração do sprite invisível para o ponto de plantação
        this.sprite = new Sprite({
            gameObject: this,
            animations: {
                "idle-down": [ [0,0] ]  // Animação básica, já que o sprite é invisível
            },
            currentAnimation: "idle-down",
            isInvisible: true  // Torna o sprite invisível mas ainda interativo
        });
        this.isInteractable = true;  // Permite interação com o spot
        this.direction = "down";  // Direção padrão para eventos
        this.talking = config.talking || [];  // Mantém compatibilidade com o sistema de diálogo
    }

    // Implementa comportamentos para cutscenes, similar ao Person
    startBehavior(state, behavior) {
        if (behavior.type === "stand") {
            setTimeout(() => {
                utils.emitEvent("PersonStandComplete", {
                    whoId: this.id
                })
            }, behavior.time)
        }
    }

    update(state) {
        // Hook para atualizações futuras se necessário
    }

    // Sistema de detecção de proximidade para interação
    checkForInteraction(state) {
        const hero = state.map.gameObjects.hero;
        
        // Calcula distância Manhattan entre o jogador e o spot
        const distance = Math.abs(hero.x - this.x) + Math.abs(hero.y - this.y);
        
        // Mostra/esconde botão de interação baseado na proximidade
        if (distance <= utils.withGrid(1) && !state.map.isCutscenePlaying) {
            this.showInteractionButton(state.map);
        } else {
            this.hideInteractionButton();
        }
    }

    // UI - Botão de interação "E"
    showInteractionButton(map) {
        if (!this.interactionButton) {
            this.interactionButton = document.createElement("div");
            this.interactionButton.classList.add("interaction-button");
            this.interactionButton.textContent = "E";
            document.querySelector(".game-container").appendChild(this.interactionButton);
        }
        
        const cameraPerson = map.gameObjects.hero;
        
        // Posicionamento do botão relativo à câmera
        const x = this.x - cameraPerson.x + utils.withGrid(1);
        const y = this.y - utils.withGrid(15) - cameraPerson.y + utils.withGrid(0);
        
        this.interactionButton.style.transform = `translate(${x}px, ${y}px)`;
        this.interactionButton.style.display = "block";
    }
    
    // Esconde o botão quando não está próximo
    hideInteractionButton() {
        if (this.interactionButton) {
            this.interactionButton.style.display = "none";
        }
    }
}