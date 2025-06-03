class Overworld {
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        
        // Inicializa o gerenciador de diálogos
        this.dialogManager = null;
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

    // Configura o listener para a tecla E (interação com NPCs)
    bindActionInput() {
        new KeypressListener("KeyE", () => {
            // Verifica se o jogador está próximo a um NPC e inicia o diálogo
            const hero = this.map.gameObjects.hero;
            if (hero.currentInteractingNpc && !this.map.isCutscenePlaying) {
                hero.startDialog(this.map);
            }
        });
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.Galinheiro); 
        
        // Inicializa o gerenciador de diálogos e o associa ao mapa
        this.dialogManager = new DialogManager();
        this.map.dialogManager = this.dialogManager;
        
        this.map.mountObjects();

        this.directionInput = new DirectionInput(); // gerencia as entradas do teclado para o movimento do personagem
        this.directionInput.init();
        
        // Configura o listener para a tecla E
        this.bindActionInput();

        this.startGameLoop(); // inicia o loop principal do jogo

        // 
        // this.map.startCutscene([
        //      {who: "galinhaBranca", type: "walk", direction: "right"},  
        //      {who: "galinhaBranca", type: "walk", direction: "right"},
        //      {who: "galinhaBranca", type: "walk", direction: "right"},
        //      {who: "galinhaBranca", type: "walk", direction: "right"},
        //      {who: "galinhaBranca", type: "walk", direction: "left"},  
        //      {who: "galinhaBranca", type: "walk", direction: "left"},
        //      {who: "galinhaBranca", type: "walk", direction: "left"}, 
        //      {who: "galinhaBranca", type: "walk", direction: "left"}, 
        // ])
        
    }
}
