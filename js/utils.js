// funções utilitárias que são usadas em todo o projeto para lidar com coordenadas de grid e posições no mapa

const utils = {
    withGrid(n) {
        return n * 16; // Converte um valor n para sua representação em pixels, multiplicando por 16
    },
    asGridCoord(x, y) {
        return `${x * 16},${y * 16}`;
        // Converte coordenadas de grid (x, y) em uma string no formato "pixelX,pixelY", onde pixelX e pixelY são as coordenadas de pixel correspondentes ao canto superior esquerdo da célula do grid.
        // Exemplo: utils.asGridCoord(1, 1) retornaria "16,16"
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
        // Dependendo da direction ("left", "right", "up", "down"), ajusta x ou y subtraindo ou adicionando size
        return {x,y};
    },

    emitEvent(name, detail) { // serve para criar um evento personalizado
        const event = new CustomEvent(name, { // Cria um evento para saber se acabou o movimento; CustomEvent é algo nativo do browser
            detail
        });
        document.dispatchEvent(event);
    }
}