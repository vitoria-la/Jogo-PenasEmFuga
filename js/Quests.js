const quest1 = {
    description: "Fale com 3 galinhas",
    objective: "Falar com 3 galinhas diferentes, sendo necessário que fale com a Caipira e a galinha Segurança, além de alguma outra",
    reward: " ",
    isCompleted: false,
    requiredItems: [], // Lista de itens necessários para completar a quest
    checkCompletion: function (player) {
        const chickens = player.getEntitiesByType("chicken");
        if (chickens.length >= 3) {
            this.isCompleted = true;
            console.log("Quest 1 completed!"); // Exibe mensagem de conclusão no console
            // Aqui você pode adicionar lógica para recompensar o jogador, como aumentar o nível ou conceder itens
        }

    }


};

const quest2 = {
    description: "Plante e colha 9 trigos",
    objective: "Plantar e colher 9 trigos, e ao final, falar com a Clotilde",
    reward: " ",
    isCompleted: false,
    requiredItems: ['enxada', 'semente de trigo'], // Lista de itens necessários para completar a quest
    checkCompletion: function (player) {
        const wheatCount = player.getItemCount('wheat'); // Verifica a quantidade de trigo no inventário do jogador
        if (wheatCount >= 9 && player.chickens.some(chicken => chicken.name === "Clotilde") && player.coins >= 10) {
            this.isCompleted = true;
            console.log("Quest 2 completed!"); // Exibe mensagem de conclusão no console
            // Aqui você pode adicionar lógica para recompensar o jogador, como aumentar o nível ou conceder itens
        }
    }
};