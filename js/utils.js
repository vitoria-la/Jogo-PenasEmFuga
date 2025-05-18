const utils = {
    withGrid(n) {
        return n * 16;
    },
    asGridCoord(x, y) {
        return `${x * 16},${y * 16}`;
    },
    nextPosition(inicialX, inicialY, direction){
        let x = inicialX;
        let y = inicialY;
        const size = 16;
        if(direction === "left"){
            x -= size;
        } else if(direction === "right"){
            x += size;
        } else if (direction === "up"){
            y-= size;
        } else if(direction === "down"){
            y += size;
        }
        return {x,y};
    }
}