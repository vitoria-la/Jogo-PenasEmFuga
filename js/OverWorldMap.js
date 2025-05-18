class OverworldMap {
    constructor(config){
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};
        
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(22.5) - cameraPerson.x,
            utils.withGrid(13) - cameraPerson.y
        )
    }
    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(22.5) - cameraPerson.x,
            utils.withGrid(13) - cameraPerson.y
        )
    }

    isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.values(this.gameObjects).forEach(o => {

            //Determina se o objeto realmente poderia ser montado
            o.mount(this)
        })
    }

    addWall(x,y){
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y){
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction){
        this.removeWall(wasX,wasY);
        const {x,y} = utils.nextPosition(wasX,wasY,direction);
        this.addWall(x,y);
    }
}

window.OverworldMap = {
    Galinheiro: {
        lowerSrc: "/assets/img/galinheiro.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6),
            }),
            npc1: new Person({
                x: utils.withGrid(6),
                y: utils.withGrid(10),
                src: "/assets/img/White_chiken.png",
            })
        },
        walls: {
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