class Sprite {
    constructor (config) {

        // Definir a imagem
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        // Sombras
        this.shadow = new Image();
        this.useShadow = true; //config.useShadow || false
        if(this.useShadow){
            this.shadow.src = "/assets/img/sombra.png"; //colocar aqui a imagem da sombra
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        //Configura Animação e o Estado inicial
        this.animations = config.animations || {
            "idle-right" : [ [0,0] ],
            "idle-up"    : [ [0,1] ],
            "idle-down"  : [ [0,2] ],
            "idle-left"  : [ [0,3] ],
            "walk-right" : [ [1,0],[0,0],[3,0],[0,0], ],
            "walk-up"    : [ [1,1],[0,1],[3,1],[0,1], ],
            "walk-down"  : [ [1,2],[0,2],[3,2],[0,2], ],
            "walk-left"  : [ [1,3],[0,3],[3,3],[0,3], ]
        }
        this.currentAnimation = "walk-up"
        //config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 10;
        this.animationFrameProgress = this.animationFrameLimit;


        //Referencia aos objetos do jogo
        this.gameObject = config.gameObject;
    }

    get frame(){
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key){
        if(this.currentAnimation !== key){
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() { 
        //Downtick frame progresso 
        if(this.animationFrameProgress > 0){
            this.animationFrameProgress -= 1;
            return;
        }

        //resetar o contador
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if(this.frame === undefined){
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson){
        const x = this.gameObject.x - 8 + utils.withGrid(22.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 + utils.withGrid(13) - cameraPerson.y;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

        const[frameX, frameY] = this.frame; 

        this.isLoaded && ctx.drawImage(this.image,
            frameX * 32, frameY * 32,
            32,32,
            x,y,
            32,32
        )

        this.updateAnimationProgress();
    }
}