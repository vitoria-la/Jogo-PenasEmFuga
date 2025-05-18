class GameObject {
    constructor (config, value, value2){
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/assets/img/pingo.png",

        }); 
    }

    mount(map){
        console.log("mouting")
        this.isMounted = true;
        map.addWall(this.x,this.y);
    }

    update(){

    }
}