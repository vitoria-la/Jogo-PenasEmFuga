(function () { // inicializa tudo que é apresentado na tela
    //Invoked Function Expression (IIFE) para evitar conflitos de escopo
    
    function start(){
        document.getElementById("titlescreen").style.display = "none"; // Remove toda a tela do título do jogo
        window.overworld = new Overworld({ //window.overworld é a instância do jogo
            // Cria uma nova instância do Overworld com as opções fornecidas,
            // isso permite que outras partes do código acessem o jogo através de window.overworld
            // e interajam com ele, como iniciar mapas, gerenciar eventos, etc.
            // Danilo: "Estou usando para a loja"
            element: document.querySelector(".game-container")
        });
        overworld.init();
    } 

    document.getElementById("start-button").addEventListener("click", start);
        // Adiciona um evento de clique ao botão de início do jogo
     // Inicia o jogo quando o botão é clicado através da passagem da funcção recursiva como parametro
})();