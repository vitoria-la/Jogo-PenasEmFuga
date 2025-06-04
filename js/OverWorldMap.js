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
            utils.withGrid(3) - cameraPerson.y // são deslocamentos para centralizar a câmera
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

window.OverworldMaps = {
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

            //quarto direito inferior
            //------------------------------------------//
            [utils.asGridCoord(48,29)] : true,
            [utils.asGridCoord(48,28)] : true,
            [utils.asGridCoord(48,27)] : true,
            [utils.asGridCoord(48,26)] : true,
            [utils.asGridCoord(48,25)] : true,
            [utils.asGridCoord(48,24)] : true,

            [utils.asGridCoord(49,26)] : true,
            [utils.asGridCoord(50,26)] : true,
            [utils.asGridCoord(51,26)] : true,
            [utils.asGridCoord(52,26)] : true,
            [utils.asGridCoord(53,26)] : true,
            [utils.asGridCoord(54,26)] : true,
            [utils.asGridCoord(55,26)] : true,
            [utils.asGridCoord(56,26)] : true,
            [utils.asGridCoord(57,26)] : true,
            [utils.asGridCoord(58,26)] : true,
            [utils.asGridCoord(59,26)] : true,

            [utils.asGridCoord(48,32)] : true,
            [utils.asGridCoord(48,33)] : true,

            [utils.asGridCoord(49,24)] : true,
            [utils.asGridCoord(50,24)] : true,
            [utils.asGridCoord(51,24)] : true,
            [utils.asGridCoord(52,24)] : true,
            [utils.asGridCoord(53,24)] : true,
            [utils.asGridCoord(54,24)] : true,
            [utils.asGridCoord(55,24)] : true,
            [utils.asGridCoord(56,24)] : true,
            [utils.asGridCoord(57,24)] : true,
            [utils.asGridCoord(58,24)] : true,
            [utils.asGridCoord(59,24)] : true,
            [utils.asGridCoord(60,24)] : true,

            //------------------------------------------//

            // Parede direita
            //------------------------------------------//

            [utils.asGridCoord(60,33)] : true,
            [utils.asGridCoord(60,32)] : true,
            [utils.asGridCoord(60,31)] : true,
            [utils.asGridCoord(60,30)] : true,
            [utils.asGridCoord(60,29)] : true,
            [utils.asGridCoord(60,28)] : true,
            [utils.asGridCoord(60,27)] : true,
            [utils.asGridCoord(60,26)] : true,
            [utils.asGridCoord(60,25)] : true,
            [utils.asGridCoord(60,24)] : true,
            [utils.asGridCoord(60,23)] : true,
            [utils.asGridCoord(60,22)] : true,
            [utils.asGridCoord(60,21)] : true,
            [utils.asGridCoord(60,20)] : true,

            [utils.asGridCoord(60,17)] : true,
            [utils.asGridCoord(60,16)] : true,
            [utils.asGridCoord(60,15)] : true,
            [utils.asGridCoord(60,14)] : true,
            [utils.asGridCoord(60,13)] : true,
            [utils.asGridCoord(60,12)] : true,
            [utils.asGridCoord(60,11)] : true,
            [utils.asGridCoord(60,10)] : true,

            //------------------------------------------//
            
            // Base (chão)
            //------------------------------------------//

            [utils.asGridCoord(14,34)] : true,
            [utils.asGridCoord(15,34)] : true,
            [utils.asGridCoord(16,34)] : true,
            [utils.asGridCoord(17,34)] : true,
            [utils.asGridCoord(18,34)] : true,
            [utils.asGridCoord(19,34)] : true,
            [utils.asGridCoord(20,34)] : true,
            [utils.asGridCoord(21,34)] : true,
            [utils.asGridCoord(22,34)] : true,
            [utils.asGridCoord(23,34)] : true,
            [utils.asGridCoord(24,34)] : true,
            [utils.asGridCoord(25,34)] : true,
            [utils.asGridCoord(26,34)] : true,
            [utils.asGridCoord(27,34)] : true,
            [utils.asGridCoord(28,34)] : true,
            [utils.asGridCoord(29,34)] : true,
            [utils.asGridCoord(30,34)] : true,
            [utils.asGridCoord(31,34)] : true,
            [utils.asGridCoord(32,34)] : true,
            [utils.asGridCoord(33,34)] : true,
            [utils.asGridCoord(34,34)] : true,
            [utils.asGridCoord(35,34)] : true,
            [utils.asGridCoord(36,34)] : true,
            [utils.asGridCoord(37,34)] : true,
            [utils.asGridCoord(38,34)] : true,
            [utils.asGridCoord(39,34)] : true,
            [utils.asGridCoord(40,34)] : true,
            [utils.asGridCoord(41,34)] : true,
            [utils.asGridCoord(42,34)] : true,
            [utils.asGridCoord(43,34)] : true,
            [utils.asGridCoord(44,34)] : true,
            [utils.asGridCoord(45,34)] : true,
            [utils.asGridCoord(46,34)] : true,
            [utils.asGridCoord(47,34)] : true,
            [utils.asGridCoord(48,34)] : true,
            [utils.asGridCoord(49,34)] : true,
            [utils.asGridCoord(50,34)] : true,
            [utils.asGridCoord(51,34)] : true,
            [utils.asGridCoord(52,34)] : true,
            [utils.asGridCoord(53,34)] : true,
            [utils.asGridCoord(54,34)] : true,
            [utils.asGridCoord(55,34)] : true,
            [utils.asGridCoord(56,34)] : true,
            [utils.asGridCoord(57,34)] : true,
            [utils.asGridCoord(58,34)] : true,
            [utils.asGridCoord(59,34)] : true,

            //------------------------------------------//

            // Parede do mercado
            //------------------------------------------//

            [utils.asGridCoord(59,12)] : true,
            [utils.asGridCoord(58,12)] : true,
            [utils.asGridCoord(57,12)] : true,
            [utils.asGridCoord(56,12)] : true,
            [utils.asGridCoord(55,12)] : true,
            [utils.asGridCoord(54,12)] : true,
            //[utils.asGridCoord(53,12)] : true, // coordenada da porta
            //[utils.asGridCoord(52,12)] : true, // coordenada da porta
            [utils.asGridCoord(51,12)] : true,
            [utils.asGridCoord(50,12)] : true,
            [utils.asGridCoord(49,12)] : true,
            [utils.asGridCoord(48,12)] : true,
            [utils.asGridCoord(47,12)] : true,
            [utils.asGridCoord(46,12)] : true,
            [utils.asGridCoord(45,12)] : true,
            [utils.asGridCoord(44,12)] : true,
            [utils.asGridCoord(43,12)] : true,
            [utils.asGridCoord(42,12)] : true,
            [utils.asGridCoord(41,12)] : true,
            [utils.asGridCoord(40,12)] : true,
            [utils.asGridCoord(39,12)] : true,

            //------------------------------------------//

            // Quarto dos livros
            //------------------------------------------//

            [utils.asGridCoord(39,13)] : true,
            [utils.asGridCoord(39,14)] : true,
            [utils.asGridCoord(39,15)] : true,
            [utils.asGridCoord(39,16)] : true,
            [utils.asGridCoord(38,17)] : true,
            
            [utils.asGridCoord(35,17)] : true,
            [utils.asGridCoord(34,17)] : true,
            [utils.asGridCoord(33,17)] : true,
            [utils.asGridCoord(32,17)] : true,
            [utils.asGridCoord(31,17)] : true,
            [utils.asGridCoord(30,17)] : true,
            [utils.asGridCoord(29,17)] : true,
            [utils.asGridCoord(28,17)] : true,
            [utils.asGridCoord(27,17)] : true,

            [utils.asGridCoord(26,16)] : true,
            [utils.asGridCoord(26,15)] : true,
            [utils.asGridCoord(26,14)] : true,
            [utils.asGridCoord(26,13)] : true,

            [utils.asGridCoord(27,12)] : true,
            [utils.asGridCoord(28,12)] : true,
            [utils.asGridCoord(29,12)] : true,
            [utils.asGridCoord(30,12)] : true,
            [utils.asGridCoord(31,12)] : true,
            [utils.asGridCoord(32,12)] : true,
            [utils.asGridCoord(33,12)] : true,
            [utils.asGridCoord(34,12)] : true,
            [utils.asGridCoord(35,12)] : true,
            [utils.asGridCoord(36,12)] : true,
            [utils.asGridCoord(37,12)] : true,
            [utils.asGridCoord(38,12)] : true,
            [utils.asGridCoord(39,12)] : true,

            [utils.asGridCoord(36,13)] : true,
            [utils.asGridCoord(37,13)] : true,
            [utils.asGridCoord(38,13)] : true,

            //------------------------------------------//

            // Quarto dos ovos
            //------------------------------------------//

            [utils.asGridCoord(29,27)] : true,
            [utils.asGridCoord(29,26)] : true,
            [utils.asGridCoord(29,25)] : true,
            [utils.asGridCoord(29,24)] : true,
            [utils.asGridCoord(29,23)] : true,
            [utils.asGridCoord(29,22)] : true,

            [utils.asGridCoord(29,30)] : true,
            [utils.asGridCoord(29,31)] : true,
            [utils.asGridCoord(29,32)] : true,
            [utils.asGridCoord(29,33)] : true,
            [utils.asGridCoord(29,34)] : true,

            [utils.asGridCoord(28,22)] : true,
            [utils.asGridCoord(27,22)] : true,
            [utils.asGridCoord(26,22)] : true,
            [utils.asGridCoord(25,22)] : true,
            [utils.asGridCoord(24,22)] : true,
            [utils.asGridCoord(23,22)] : true,
            [utils.asGridCoord(22,22)] : true,
            [utils.asGridCoord(21,22)] : true,
            [utils.asGridCoord(20,22)] : true,
            [utils.asGridCoord(19,22)] : true,
            [utils.asGridCoord(18,22)] : true,
            [utils.asGridCoord(17,22)] : true,
            [utils.asGridCoord(16,22)] : true,
            [utils.asGridCoord(15,22)] : true,

            [utils.asGridCoord(14,22)] : true,
            [utils.asGridCoord(14,23)] : true,
            [utils.asGridCoord(14,24)] : true,
            [utils.asGridCoord(14,25)] : true,
            [utils.asGridCoord(14,26)] : true,
            [utils.asGridCoord(14,27)] : true,
            [utils.asGridCoord(14,28)] : true,
            [utils.asGridCoord(14,29)] : true,
            [utils.asGridCoord(14,30)] : true,
            [utils.asGridCoord(14,31)] : true,
            [utils.asGridCoord(14,32)] : true,
            [utils.asGridCoord(14,33)] : true,

            [utils.asGridCoord(28,25)] : true,
            [utils.asGridCoord(27,25)] : true,
            [utils.asGridCoord(26,25)] : true,
            [utils.asGridCoord(25,25)] : true,
            [utils.asGridCoord(24,25)] : true,
            [utils.asGridCoord(23,25)] : true,
            [utils.asGridCoord(22,25)] : true,
            [utils.asGridCoord(21,25)] : true,
            [utils.asGridCoord(20,25)] : true,
            [utils.asGridCoord(19,25)] : true,
            [utils.asGridCoord(18,25)] : true,
            [utils.asGridCoord(17,25)] : true,
            [utils.asGridCoord(16,25)] : true,
            [utils.asGridCoord(15,25)] : true,

            [utils.asGridCoord(15,26)] : true,
            [utils.asGridCoord(15,27)] : true,
            [utils.asGridCoord(15,28)] : true,
            [utils.asGridCoord(15,29)] : true,
            [utils.asGridCoord(15,30)] : true,
            [utils.asGridCoord(15,31)] : true,
            [utils.asGridCoord(15,32)] : true,
            [utils.asGridCoord(15,33)] : true,

            [utils.asGridCoord(16,33)] : true,
            [utils.asGridCoord(16,28)] : true,
            [utils.asGridCoord(16,29)] : true,
            [utils.asGridCoord(16,30)] : true,

            [utils.asGridCoord(27,30)] : true,
            [utils.asGridCoord(27,31)] : true,
            [utils.asGridCoord(27,32)] : true,
            [utils.asGridCoord(27,33)] : true,
            [utils.asGridCoord(28,30)] : true,
            [utils.asGridCoord(28,31)] : true,
            [utils.asGridCoord(28,32)] : true,
            [utils.asGridCoord(28,33)] : true,

            //------------------------------------------//

            // Parede acima dos quartos dos ovos
            //------------------------------------------//

            [utils.asGridCoord(14,20)] : true,
            [utils.asGridCoord(14,21)] : true,

            //------------------------------------------//

            // Quarto da costura
            //------------------------------------------//

            [utils.asGridCoord(15,18)] : true,
            [utils.asGridCoord(15,19)] : true,
            [utils.asGridCoord(15,20)] : true,

            [utils.asGridCoord(15,15)] : true,
            [utils.asGridCoord(15,14)] : true,
            [utils.asGridCoord(15,13)] : true,

            [utils.asGridCoord(1,20)] : true,
            [utils.asGridCoord(2,20)] : true,
            [utils.asGridCoord(3,20)] : true,
            [utils.asGridCoord(4,20)] : true,
            [utils.asGridCoord(5,20)] : true,
            [utils.asGridCoord(6,20)] : true,
            [utils.asGridCoord(7,20)] : true,
            [utils.asGridCoord(8,20)] : true,
            [utils.asGridCoord(9,20)] : true,
            [utils.asGridCoord(10,20)] : true,
            [utils.asGridCoord(11,20)] : true,
            [utils.asGridCoord(12,20)] : true,
            [utils.asGridCoord(13,20)] : true,

            [utils.asGridCoord(1,19)] : true,
            [utils.asGridCoord(1,18)] : true,
            [utils.asGridCoord(1,17)] : true,
            [utils.asGridCoord(1,16)] : true,
            [utils.asGridCoord(1,15)] : true,
            [utils.asGridCoord(1,14)] : true,
            [utils.asGridCoord(1,13)] : true,
            [utils.asGridCoord(1,12)] : true,
            [utils.asGridCoord(1,11)] : true,
            [utils.asGridCoord(1,10)] : true,

            [utils.asGridCoord(2,13)] : true,
            [utils.asGridCoord(3,13)] : true,
            [utils.asGridCoord(4,13)] : true,

            [utils.asGridCoord(5,12)] : true,
            [utils.asGridCoord(6,12)] : true,
            [utils.asGridCoord(7,12)] : true,
            [utils.asGridCoord(8,12)] : true,
            [utils.asGridCoord(9,12)] : true,

            [utils.asGridCoord(10,13)] : true,
            [utils.asGridCoord(11,13)] : true,
            [utils.asGridCoord(12,13)] : true,
            [utils.asGridCoord(13,13)] : true,
            [utils.asGridCoord(14,13)] : true,

            [utils.asGridCoord(12,14)] : true,
            [utils.asGridCoord(13,14)] : true,

            [utils.asGridCoord(2,15)] : true,
            [utils.asGridCoord(2,16)] : true,
            [utils.asGridCoord(2,17)] : true,
            [utils.asGridCoord(2,18)] : true,

            [utils.asGridCoord(12,18)] : true,
            [utils.asGridCoord(13,18)] : true,
            [utils.asGridCoord(12,19)] : true,
            [utils.asGridCoord(13,19)] : true,

            //------------------------------------------//

            // Parede para o acesso a cozinha
            //------------------------------------------//

            [utils.asGridCoord(16,12)] : true,
            [utils.asGridCoord(17,12)] : true,
            [utils.asGridCoord(18,12)] : true,
            [utils.asGridCoord(19,12)] : true,
            //[utils.asGridCoord(20,12)] : true, // colisao da porta
            //[utils.asGridCoord(21,12)] : true, // colisao da porta
            [utils.asGridCoord(22,12)] : true,
            [utils.asGridCoord(23,12)] : true,
            [utils.asGridCoord(24,12)] : true,
            [utils.asGridCoord(25,12)] : true,

            //------------------------------------------//

            // Cozinha
            //------------------------------------------//

            [utils.asGridCoord(17,10)] : true,
            [utils.asGridCoord(17,9)] : true,
            [utils.asGridCoord(17,8)] : true,
            [utils.asGridCoord(17,7)] : true,
            [utils.asGridCoord(17,6)] : true,
            [utils.asGridCoord(17,5)] : true,
            [utils.asGridCoord(17,4)] : true,
            [utils.asGridCoord(17,3)] : true,
            [utils.asGridCoord(17,2)] : true,

            [utils.asGridCoord(18,5)] : true,
            [utils.asGridCoord(19,5)] : true,
            [utils.asGridCoord(20,5)] : true,
            [utils.asGridCoord(21,5)] : true,
            [utils.asGridCoord(22,5)] : true,
            [utils.asGridCoord(23,5)] : true,
            [utils.asGridCoord(24,5)] : true,
            [utils.asGridCoord(25,5)] : true,
            [utils.asGridCoord(26,5)] : true,
            [utils.asGridCoord(27,5)] : true,
            [utils.asGridCoord(28,5)] : true,
            [utils.asGridCoord(29,5)] : true,
            [utils.asGridCoord(30,5)] : true,
            [utils.asGridCoord(31,5)] : true,

            [utils.asGridCoord(29,6)] : true,
            [utils.asGridCoord(29,7)] : true,
            [utils.asGridCoord(29,8)] : true,

            [utils.asGridCoord(30,9)] : true,
            [utils.asGridCoord(31,9)] : true,

            [utils.asGridCoord(18,11)] : true,
            [utils.asGridCoord(19,11)] : true,
            //[utils.asGridCoord(20,11)] : true,
            //[utils.asGridCoord(21,11)] : true,
            [utils.asGridCoord(22,11)] : true,
            [utils.asGridCoord(23,11)] : true,
            [utils.asGridCoord(24,11)] : true,
            [utils.asGridCoord(25,11)] : true,
            [utils.asGridCoord(26,11)] : true,
            [utils.asGridCoord(27,11)] : true,
            [utils.asGridCoord(28,11)] : true,
            [utils.asGridCoord(29,11)] : true,
            [utils.asGridCoord(30,11)] : true,
            [utils.asGridCoord(31,11)] : true,

            [utils.asGridCoord(32,10)] : true,

            //------------------------------------------//

            // Mercado
            //------------------------------------------//

            [utils.asGridCoord(42,14)] : true,
            [utils.asGridCoord(49,14)] : true,
            [utils.asGridCoord(50,14)] : true,

            [utils.asGridCoord(42,13)] : true,
            [utils.asGridCoord(43,13)] : true,
            [utils.asGridCoord(44,13)] : true,
            [utils.asGridCoord(45,13)] : true,
            [utils.asGridCoord(46,13)] : true,
            [utils.asGridCoord(47,13)] : true,
            [utils.asGridCoord(48,13)] : true,
            [utils.asGridCoord(49,13)] : true,

            [utils.asGridCoord(55,13)] : true,
            [utils.asGridCoord(56,13)] : true,

            //------------------------------------------//

            // Quarto superior
            //------------------------------------------//

            [utils.asGridCoord(43,11)] : true,
            [utils.asGridCoord(44,11)] : true,
            [utils.asGridCoord(45,11)] : true,
            [utils.asGridCoord(46,11)] : true,
            [utils.asGridCoord(47,11)] : true,
            [utils.asGridCoord(48,11)] : true,
            [utils.asGridCoord(49,11)] : true,
            [utils.asGridCoord(50,11)] : true,
            [utils.asGridCoord(51,11)] : true,
            [utils.asGridCoord(52,11)] : true,
            [utils.asGridCoord(53,11)] : true,
            [utils.asGridCoord(54,11)] : true,
            [utils.asGridCoord(55,11)] : true,
            [utils.asGridCoord(56,11)] : true,

            [utils.asGridCoord(56,10)] : true,
            [utils.asGridCoord(56,9)] : true,
            [utils.asGridCoord(56,8)] : true,
            [utils.asGridCoord(56,7)] : true,
            [utils.asGridCoord(56,6)] : true,
            [utils.asGridCoord(56,5)] : true,
            [utils.asGridCoord(56,4)] : true,
            [utils.asGridCoord(56,3)] : true,
            [utils.asGridCoord(56,2)] : true,

            [utils.asGridCoord(43,10)] : true,
            [utils.asGridCoord(43,9)] : true,
            [utils.asGridCoord(43,8)] : true,
            [utils.asGridCoord(43,7)] : true,
            [utils.asGridCoord(43,6)] : true,
            [utils.asGridCoord(43,5)] : true,
            [utils.asGridCoord(43,4)] : true,
            [utils.asGridCoord(43,3)] : true,
            [utils.asGridCoord(43,2)] : true,

            [utils.asGridCoord(44,4)] : true,
            [utils.asGridCoord(45,4)] : true,
            [utils.asGridCoord(46,4)] : true,
            [utils.asGridCoord(47,4)] : true,
            [utils.asGridCoord(48,4)] : true,
            [utils.asGridCoord(49,4)] : true,
            [utils.asGridCoord(50,4)] : true,
            [utils.asGridCoord(51,4)] : true,
            [utils.asGridCoord(52,4)] : true,
            [utils.asGridCoord(53,4)] : true,

            [utils.asGridCoord(44,5)] : true,
            [utils.asGridCoord(45,5)] : true,
            [utils.asGridCoord(53,5)] : true,
            [utils.asGridCoord(54,5)] : true,
            [utils.asGridCoord(55,5)] : true,

            //------------------------------------------//

            // Sofa sala
            //------------------------------------------//
        
            [utils.asGridCoord(38,31)] : true,
            [utils.asGridCoord(39,31)] : true,

            [utils.asGridCoord(42,30)] : true,
            [utils.asGridCoord(42,31)] : true,
            [utils.asGridCoord(42,32)] : true,
            [utils.asGridCoord(43,30)] : true,
            [utils.asGridCoord(43,31)] : true,
            [utils.asGridCoord(43,32)] : true,

            [utils.asGridCoord(34,30)] : true,
            [utils.asGridCoord(34,31)] : true,
            [utils.asGridCoord(34,32)] : true,
            [utils.asGridCoord(35,30)] : true,
            [utils.asGridCoord(35,31)] : true,
            [utils.asGridCoord(35,32)] : true,

            [utils.asGridCoord(37,33)] : true,
            [utils.asGridCoord(38,33)] : true,
            [utils.asGridCoord(39,33)] : true,
            [utils.asGridCoord(40,33)] : true,

            //------------------------------------------//
        }
    }
}
