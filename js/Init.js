(function () { // inicializa tudo que é apresentado na tela
    
    const overworld = new Overworld({
        element: document.querySelector(".game-container")
    });
    overworld.init();

})();