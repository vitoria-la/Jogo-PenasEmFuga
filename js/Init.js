(function () { // inicializa tudo que é apresentado na tela
    //Invoked Function Expression (IIFE) para evitar conflitos de escopo
    
    function start(){
        document.getElementById("titlescreen").style.display = "none"; // Remove toda a tela do título do jogo
        const overworld = new Overworld({
            element: document.querySelector(".game-container")
        });
        overworld.init();
    } 

    document.getElementById("start-button").addEventListener("click", start);
        // Adiciona um evento de clique ao botão de início do jogo
     // Inicia o jogo quando o botão é clicado através da passagem da funcção recursiva como parametro
})();