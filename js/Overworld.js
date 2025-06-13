class Overworld {
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        this.foundFrog2 = config.foundFrog2 || false;
        this.easterEggsFound = config.easterEggsFound || []; // Lista de easter eggs encontrados
        this.easterEggsFoundID = config.easterEggsFoundID || []; // Lista do id dos easter eggs encontrados
        this.playerHotbar = [
            null, null, null, null, null, null // 6 slots, todos vazios (null)
        ];
    }

    addItemToHotbar(itemToAdd) {
        let added = false;
        // 1. Tenta empilhar com um item existente
        for (let i = 0; i < this.playerHotbar.length; i++) {
            const slot = this.playerHotbar[i];
            if (slot && slot.id === itemToAdd.id) {
                slot.quantity += itemToAdd.quantity;
                added = true;
                break;
            }
        }
        // 2. Se não empilhou, procura um slot vazio
        if (!added) {
            for (let i = 0; i < this.playerHotbar.length; i++) {
                if (this.playerHotbar[i] === null) {
                    this.playerHotbar[i] = itemToAdd;
                    added = true;
                    break;
                }
            }
        }

        if (added) {
            // 3. Sincroniza a HUD com o novo estado do inventário
            this.playerHotbar.forEach((item, i) => {
                this.hud.updateHotbarSlot(i, item);
            });
        } else {
            console.log("Hotbar cheia! Não foi possível adicionar o item.");
        }
    }

    startGameLoop() { // loop principal do jogo, responsável por atualizar e redesenhar tudo em cada quadro
        const step = () => {

            //Clear off the canvas
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height); // Limpa todo o canvas para desenhar o próximo

            //Estibiliza a camera no personagem
            const cameraPerson = this.map.gameObjects.hero;

            //Atualiza todos os objetos
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                })
            })

            // Desenha a layer de baixo
            this.map.drawLowerImage(this.ctx, cameraPerson);

            //Desenha os objetos do jogo
            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y; // os personagens que estão mais ao norte vão renderizar primeiro
            }).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson);
            })

            // Desenha a layer de cima
            this.map.drawUpperImage(this.ctx, cameraPerson);
         
            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                // Quer dizer que a posição do pinguim mudou
                this.map.checkForFootstepCutscene();
            }
        })
    }

    frogsFoundCheck() { // Serve para ver se foi encontrado um sapo
        document.addEventListener("FrogWasFound", e => {
            if (e.detail.whoId === "frog1" && this.map.name === "Galinheiro") {
                this.foundFrog1 = true;
            }
            if (e.detail.whoId === "frog2" && this.map.name === "Galinheiro") {
                this.foundFrog2 = true;
            }
            if (e.detail.whoId === "frog3" && this.map.name === "Galinheiro") {
                this.foundFrog3 = true;
            }
        })
    }

    bindActionInput() {
        new KeypressListener("KeyE", () => {
            // Verifica se o jogador está próximo a um NPC e inicia o diálogo
            const hero = this.map.gameObjects.hero;
            if (hero.currentInteractingNpc && !this.map.isCutscenePlaying) {
                hero.startDialog(this.map);
            }
        });
    }

    easterEggsFoundCheck() { // Método que vê se algum easter-egg foi encontrado
        document.addEventListener("EasterEggWasFound", e => {
            if (!this.easterEggsFound.includes(e.detail.whoId)) { // Se não tiver esse easter-egg na lista
                this.easterEggsFound.push(e.detail.whoId); // Inclui ele na lista de easter eggs encontrados
                this.hud.updateEasterEggs(this.easterEggsFound); // Atualiza a listagem de easter eggs na hud
            }
        })
        document.addEventListener("EasterEggWasFoundID", e => {
            if (!this.easterEggsFoundID.includes(e.detail.whoId)) { // Se não tiver esse easter-egg na lista
                this.easterEggsFoundID.push(e.detail.whoId); // Inclui ele na lista de easter eggs encontrados
            }
        })
    }

    startMap(mapConfig) {
        this.frogsFoundCheck(); // Ve se os sapos já foram encontrados
        this.easterEggsFoundCheck();
        this.map = new OverworldMap(mapConfig, { // Passa os valores de foundFrog
            foundFrog1: this.foundFrog1,
            foundFrog2: this.foundFrog2,
            foundFrog3: this.foundFrog3,
            easterEggsFound: this.easterEggsFound, // Passa a lista do nome de easter-eggs encontrados
            easterEggsFoundID: this.easterEggsFoundID, // Passa a lista do id dos de easter-eggs encontrados
        });
        this.map.overworld = this;
        
        this.map.mountObjects();
    }

    init() {
        this.hud = new Hud();
        this.hud.init(document.querySelector(".game-container"));
        this.soundtrack = new Audio();
        this.soundtrack.startSoundtrack();

        this.startMap(window.OverworldMaps.Galinheiro);

        this.directionInput = new DirectionInput(); // gerencia as entradas do teclado para o movimento do personagem
        this.directionInput.init();
        //this.directionInput.direction;

        this.bindHeroPositionCheck();
        this.bindActionInput();

        this.startGameLoop(); // inicia o loop principal do jogo

        // --- EXEMPLO: Simulação de ganho de moedas a cada 1 segundo ---
        // (Remova isso depois e chame 'this.hud.updateCoins' quando o jogador realmente ganhar moedas)
        this.coins = 0;
        setInterval(() => {
            this.coins += 1; // Adiciona 1 moeda
            this.hud.updateCoins(this.coins); // Atualiza a HUD
            console.log("Moedas atualizadas:", this.coins);
        }, 1000); // A cada 1 segundos

        this.level = 0;
        setInterval(() => {
            this.level += 1; // Sobe de nível
            this.hud.updateLevel(this.level); // Atualiza a HUD
            console.log("Subiu de nível! Nível atual:", this.level);
        }, 5000); // A cada 5 segundos

        // --- EXEMPLO: Simulação de pegar itens com quantidade ---

        // Simula pegar 1 trigo após 2 segundos
        setTimeout(() => {
            const trigo = { id: "trigo", name: "Trigo", src: "./assets/img/trigo.png", quantity: 1 };
            console.log("Jogador pegou 1 trigo!");
            this.addItemToHotbar(trigo);
        }, 2000);

        // Simula pegar mais 5 trigos após 4 segundos
        setTimeout(() => {
            const maisTrigo = { id: "trigo", name: "Trigo", src: "./assets/img/trigo.png", quantity: 5 };
            console.log("Jogador pegou mais 5 trigos!");
            this.addItemToHotbar(maisTrigo);
        }, 4000);

        // Simula pegar dois milhos após 6 segundos
        setTimeout(() => {
            const milho = { id: "milho", name: "Milho", src: "./assets/img/milho.png", quantity: 2 };
            console.log("Jogador pegou um milho!");
            this.addItemToHotbar(milho);
        }, 6000);
        
    }
}