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
            utils.withGrid(-20) - cameraPerson.x,
            utils.withGrid(3) - cameraPerson.y
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
                behaviorLoop: [
                    {type: "walk", direction: "left"},  
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"}, 
                    {type: "walk", direction: "down"},  
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},
                ]
            }),
            Paova: new Person({
                x: utils.withGrid(-14),
                y: utils.withGrid(-5),
                src: "./assets/img/galinhaPaova.png",
                behaviorLoop: [ 
                    {type: "stand", direction: "up", time: 1500},
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "stand", direction: "up", time: 1100},
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},  
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "stand", direction: "up", time: 1700},
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "right"}, 
                ]
            }),
            Clotilde: new Person({
                x: utils.withGrid(-31),
                y: utils.withGrid(4),
                src: "./assets/img/galinhaClotilde.png",
                behaviorLoop: [ 
                    {type: "stand", direction: "up", time: 4300},
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},  
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "up"},
                    {type: "stand", direction: "up", time: 1700},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                    {type: "stand", direction: "left", time: 1300},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                    {type: "stand", direction: "left", time: 1100},
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},
                    {type: "stand", direction: "up", time: 1700},
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                ]
            }),
            Bernadette: new Person({
                x: utils.withGrid(0),
                y: utils.withGrid(20),
                src: "./assets/img/galinhaBernadette.png",
                behaviorLoop: [ 
                    {type: "stand", direction: "left", time: 10000},
                    {type: "walk", direction: "left"}, 
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},  
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},  
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},  
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"}, 
                    {type: "stand", direction: "up", time: 2800},
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},  
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "stand", direction: "up", time: 3500},
                    {type: "walk", direction: "left"},  
                    {type: "walk", direction: "left"},   
                    {type: "walk", direction: "left"},
                    {type: "stand", direction: "up", time: 3000},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "up"},
                    {type: "stand", direction: "up", time: 2800},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"},  
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "right"}, 
                    {type: "walk", direction: "down"},
                    {type: "walk", direction: "down"},
                ]
            }),
            galinhaSegurancaMarrom: new Person({
                x: utils.withGrid(17),
                y: utils.withGrid(7),
                src: "./assets/img/galinhaSegurancaMarrom.png",
                behaviorLoop: [  
                   {type: "stand", direction: "left", time: 2800},
                ]
            })
        },
        walls: {
            //define as coordenadas das colisoes do mapa
            //"16,16": true
                       [utils.asGridCoord(-3,6)]: true,
            [utils.asGridCoord(-3,5)]: true,
            [utils.asGridCoord(-3,4)]: true,
            [utils.asGridCoord(-3,3)]: true,
            [utils.asGridCoord(-3,2)]: true,
            [utils.asGridCoord(-2,2)]: true,
            [utils.asGridCoord(-1,2)]: true,
            [utils.asGridCoord(0,2)]: true,
            [utils.asGridCoord(1,2)]: true,
            [utils.asGridCoord(2,2)]: true,
            [utils.asGridCoord(3,2)]: true,
            [utils.asGridCoord(4,2)]: true,
            [utils.asGridCoord(5,2)]: true,
            [utils.asGridCoord(6,2)]: true,
            [utils.asGridCoord(7,2)]: true,
            [utils.asGridCoord(8,2)]: true,
            [utils.asGridCoord(9,2)]: true,
            [utils.asGridCoord(10,2)]: true,
            [utils.asGridCoord(11,2)]: true,
            [utils.asGridCoord(12,2)]: true,
            [utils.asGridCoord(13,2)]: true,
            [utils.asGridCoord(14,2)]: true,
            [utils.asGridCoord(15,2)]: true,
            [utils.asGridCoord(16,2)]: true,
            [utils.asGridCoord(17,2)]: true,
            [utils.asGridCoord(18,2)]: true,
            [utils.asGridCoord(18,3)]: true,
            
        }
    }
}
