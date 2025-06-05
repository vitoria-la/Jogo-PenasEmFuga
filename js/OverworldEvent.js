// Classe com todos os eventos, como comportamentos, música, conversa, etc;
class OverworldEvent {
    constructor({map, event}) {
        this.map = map;
        this.event = event;
    }

    // cada tipo de evento que pode acontecer no mapa terá um método próprio
    // resolve = função que fala para o método que o evento em questão acabou. Lá em GameObjects o método doBehaviorLoop espera o método aqui se resolver
    
    stand(resolve) { 
        const who = this.map.gameObjects[this.event.who]; // pega o objeto do NPC
        who.startBehavior({
            map: this.map
        }, {
            type: "stand",  //tipo da animação
            direction: this.event.direction,  // direção da animação
            time: this.event.time // quanto tempo dura
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonStandComplete", completeHandler)
    }

    walk(resolve) { 
        const who = this.map.gameObjects[this.event.who]; // pega o objeto do NPC
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",  //tipo da animação
            direction: this.event.direction,  // direção da animação
            retry: true  // serve para, se o player entrar na frente de um NPC quando ele estiver realizando uma animação, o NPC pare e tente continuar novamente depois de um delay
        })

        // Serve para ver se o NPC específico terminou o movimento. Se sim, resolve o evento
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler); // se acabou não precisa mais ficar escutando
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler) // está escutando para saber se o movimento foi finalizado
    }

    changeMap(resolve) { // Método para mudar de mapa

        // Desativa os objetos 
        Object.values(this.map.gameObjects).forEach(obj => {
            obj.isMounted = false;
        })

        const sceneTransition = new SceneTransition(); // sceneTransition é uma instância da classe SceneTransition
        sceneTransition.init(document.querySelector(".game-container"), () => { // Começa a transição de mapa
            this.map.overworld.startMap(window.OverworldMaps[this.event.map]); // Muda de mapa
            resolve();
            sceneTransition.fadeOut(); // Tira a cor sólida da tela e mostra o novo mapa
        });
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve) // this.event.type é o tipo de animação
        })
    }
}