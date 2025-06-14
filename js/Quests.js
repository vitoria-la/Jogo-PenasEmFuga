// Objeto que contém a lógica para verificar a conclusão de cada quest
const QuestChecks = {
    FALAR_COM_GALINHAS(playerState) {
        // O objetivo é ter falado com 3 galinhas ou mais
        return playerState.questFlags.CHICKENS_SPOKEN_TO >= 3;
    },
    COLETAR_TRIGO(playerState) {
        // O objetivo é ter 9 trigos ou mais no inventário
        const trigo = playerState.items.find(item => item && item.id === "trigo");
        return trigo && trigo.quantity >= 9;
    },
    // Adicione as funções de verificação para as outras quests aqui...
}

// A lista principal e ordenada de todas as quests do jogo
window.QuestList = [
    {
        id: "Q1",
        name: "Primeiros Passos",
        description: "Explore o galinheiro e converse com pelo menos 3 galinhas.",
        checkCompletion: QuestChecks.FALAR_COM_GALINHAS,
        progressKey: "CHICKENS_SPOKEN_TO", 
        progressTarget: 3,
        reward: {
            type: "item",
            item: { id: "semente_trigo", name: "Semente de Trigo", src: "./assets/img/trigoSemente.png", quantity: 5 }
        }
    },
    {
        id: "Q2",
        name: "Mãos à Obra",
        description: "Colete 9 trigos para a comunidade.",
        checkCompletion: QuestChecks.COLETAR_TRIGO,
        progressKey: "WHEAT_COLLECTED", 
        progressTarget: 9, 
        reward: {
            type: "coins",
            amount: 20
        }
    },
    // Adicione as quests 3 a 10 aqui...
];