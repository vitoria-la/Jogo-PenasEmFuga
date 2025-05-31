class OverworldMap { // representa um mapa específico no jogo, incluindo seus objetos, colisões e camadas visuais
    constructor(config){
        this.gameObjects = config.gameObjects; // Armazena um objeto contendo todos os GameObjects que pertencem a este mapa
        this.walls = config.walls || {}; // Armazena um objeto que representa as áreas de colisão ("paredes") no mapa. As chaves são coordenadas no formato "x,y", e o valor true indica que há uma parede. O padrão é um objeto vazio
        
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc; // cria a camada inferior do mapa

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc; // cria a camada superior do mapa
        this.isCutscenePlaying = false; // Para saber se está rodando alguma cutscene. 
    }

    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(-20) - cameraPerson.x,
            utils.withGrid(3) - cameraPerson.y // são deslocamentos para centralizar a câmera
        )
    }
    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(22.5) - cameraPerson.x,
            utils.withGrid(13) - cameraPerson.y
        )
    }

    isSpaceTaken(currentX, currentY, direction){ // Verifica se uma determinada posição no mapa, após um movimento em uma certa direção, está ocupada por uma "parede"
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() { 
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key];  // essa key é o nome do objeto, tipo galinhaMarrom
            object.id = key;
            //Determina se o objeto realmente poderia ser montado
            object.mount(this)
        })
    }

    async startCutscene(events) { // método para começar uma cutscene
        this.isCutscenePlaying = true;

        // começa um loop de eventos assíncronos
        // espera cada um
        for (let i = 0; i<events.length; i++) {
            const eventHandler = new  OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false; // ao acabar, atualiza a variável para false
    }

    addWall(x,y){ // Adiciona uma parede (uma área de colisão) nas coordenadas (x,y)
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y){ // Remove uma parede das coordenadas (x,y)
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction){ // Move uma parede de uma posição anterior (wasX, wasY) para a próxima posição calculada com base na direction. Útil para objetos que se movem e precisam atualizar suas colisões
        this.removeWall(wasX,wasY);
        const {x,y} = utils.nextPosition(wasX,wasY,direction);
        this.addWall(x,y);
    }
}

window.OverworldMap = {
    Galinheiro: { // mapa
        lowerSrc: "./assets/img/galinheiroMapa.png", // layer de base do mapa (chão do mapa)
        upperSrc: "", // layer superior do mapa (se precisa de algo acima do player)
        gameObjects: { // define os personagens/objetos que o mapa vai ter
            hero: new Person({ // personagem principal
                isPlayerControlled: true,
                x: utils.withGrid(4),
                y: utils.withGrid(6),
            }),
            galinhaBranca: new Person({
                x: utils.withGrid(6),
                y: utils.withGrid(10),
                src: "./assets/img/galinhaBranca.png",
                behaviorLoop: [  // é um array que vai definir o comportamento normal de um NPC
                    {type: "walk", direction: "left",time: 800},  
                    {type: "walk", direction: "left",time: 800},
                    {type: "walk", direction: "left",time: 800},
                    {type: "stand", direction: "down", time: 300},  // o time é para quanto tempo vai passar até a próxima animação
                    {type: "walk", direction: "right", time: 800},
                    {type: "walk", direction: "right", time: 800},
                    {type: "walk", direction: "right", time: 800},
                    {type: "stand", direction: "down", time: 300}
                ]
            }),
            galinhaMarrom: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(4),
                src: "./assets/img/galinhaMarrom.png",
                behaviorLoop: [  // é um array que vai definir o comportamento normal de um NPC
                    {type: "walk", direction: "left",time: 800},  
                    {type: "walk", direction: "left",time: 800},
                    {type: "walk", direction: "left",time: 800}, 
                    {type: "walk", direction: "down",time: 800},  
                    {type: "walk", direction: "down",time: 800},
                    {type: "walk", direction: "down",time: 800},
                    {type: "walk", direction: "right",time: 800},
                    {type: "walk", direction: "right",time: 800},
                    {type: "walk", direction: "right",time: 800},
                    {type: "walk", direction: "up",time: 800},
                    {type: "walk", direction: "up",time: 800},
                    {type: "walk", direction: "up",time: 800},
                ]
            })
        },
        walls: {
            //define as coordenadas das colisoes do mapa
            //"16,16": true
            [utils.asGridCoord(2,14)]: true,
            [utils.asGridCoord(3,14)]: true,
            [utils.asGridCoord(4,14)]: true,
            [utils.asGridCoord(2,15)]: true,
            [utils.asGridCoord(3,15)]: true,
            [utils.asGridCoord(4,15)]: true,
            
        }
    }
}
