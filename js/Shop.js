const itens_loja = [
    {
        id: 1,
        name: "Trigo",
        price: 1,
        description: "Trigo fresco e saudável!",
        Image: "./../assets/img/trigo.png",
        quantity: 0,
        itemPorCompra: 1, // Quantidade comprada por vez
    },
    {
        id: 2,
        name: "Semente de Trigo (x5)",
        price: 2,
        description: "Sementes de trigo para plantar!",
        Image: "./../assets/img/trigoSemente.png",
        quantity: 0,
        itemPorCompra: 5,
    },
    {
        id: 3,
        name: "Milho",
        price: 2,
        description: "Milho fresco e saboroso! Favorito das galinhas!",
        Image: "./../assets/img/milho.png",
        quantity: 0,
        itemPorCompra: 1,
    },
    {
        id: 4,
        name: "Semente de Milho (x5)",
        price: 4,
        description: "Sementes de milho para plantar!",
        Image: "./../assets/img/milhoSemente.png",
        quantity: 0,
        itemPorCompra: 5,
    },
    {
        id: 5,
        name: "Carretel de linha",
        price: 4,
        description: "Carretel de linha para fazer roupas e outros itens!",
        Image: "./../assets/img/linha.png",
        quantity: 0,
        itemPorCompra: 1,
    },
    {
        id: 6,
        name: "Passe de Saída",
        price: 100,
        description: "Um passe especial que permite a saída do galinheiro!",
        Image: "./../assets/img/linha.png",
        quantity: 0,
        itemPorCompra: 1,
    }
];

function openShop() {
    const overworld = window.overworld; // Obtém a instância do Overworld
    if (document.getElementById("shop-menu")) return;

    // --- CRIAÇÃO DA ESTRUTURA DO MENU (sem alterações) ---
    const tabs = document.createElement("div");
    tabs.className = "shop-tabs";
    const buyTab = document.createElement("button");
    buyTab.innerText = "Comprar";
    buyTab.className = "shop-tab active";
    const sellTab = document.createElement("button");
    sellTab.innerText = "Vender";
    sellTab.className = "shop-tab";
    tabs.appendChild(buyTab);
    tabs.appendChild(sellTab);

    const overlay = document.createElement("div");
    overlay.id = "shop-overlay";
    overlay.onclick = () => {
        overlay.remove();
        shopMenu.remove();
    };

    const shopMenu = document.createElement("div");
    shopMenu.id = "shop-menu";
    const BuyUl = document.createElement("ul");
    BuyUl.className = "ul";
    const sellList = document.createElement("ul");
    sellList.className = "ul";
    sellList.style.display = "none";

    shopMenu.appendChild(tabs);
    shopMenu.appendChild(BuyUl);
    shopMenu.appendChild(sellList);

    // --- LÓGICA DAS ABAS (sem alterações) ---
    buyTab.onclick = () => {
        buyTab.classList.add("active");
        sellTab.classList.remove("active");
        BuyUl.style.display = "";
        sellList.style.display = "none";
    };
    sellTab.onclick = () => {
        sellTab.classList.add("active");
        buyTab.classList.remove("active");
        BuyUl.style.display = "none";
        sellList.style.display = "";
    };

    // --- LAÇO PARA CRIAR ITENS DE COMPRA (CORRIGIDO) ---
    itens_loja.forEach(item => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = item.Image;
        const desc = document.createElement("span");
        desc.innerText = `${item.name} - ${item.description}`;
        const btn = document.createElement("button");
        btn.innerText = `Comprar (${item.price} moedas)`;

        btn.onclick = () => {
            if (overworld.coins >= item.price) {
                overworld.coins -= item.price;
                overworld.hud.updateCoins(overworld.coins);
                const itemParaHotbar = {
                    id: item.id,
                    name: item.name,
                    src: item.Image,
                    quantity: item.itemPorCompra,
                };
                window.overworld.addItemToHotbar(itemParaHotbar);
            } else {
                alert("Moedas insuficientes para comprar este item!");
            }
        };

        img.className = "foto-item";
        desc.className = "descricao-item";
        li.className = "cada-item";
        btn.className = "compra-btn";
        li.appendChild(img);
        li.appendChild(desc);
        li.appendChild(btn);
        BuyUl.appendChild(li);
    });

    // --- LAÇO PARA CRIAR ITENS DE VENDA (AGORA SEPARADO E CORRETO) ---
    overworld.playerState.items.forEach((item, idx) => {
        if (!item || item.quantity <= 0) return;

        const shopItemData = itens_loja.find(i => i.id === item.id);
        if (!shopItemData) {
            return;
        }

        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = shopItemData.Image;
        const desc = document.createElement("span");
        desc.innerText = `${item.name}`;
        const Sellbtn = document.createElement("button");
        Sellbtn.innerText = ` Vender por: (${shopItemData.price} moedas)`;

        Sellbtn.onclick = () => {
            const maxQuantity = item.quantity;
            const quantityToSellStr = prompt(`Quantos ${item.name} você quer vender? (Máx: ${maxQuantity})`, maxQuantity);

            if (quantityToSellStr === null) {
                return;
            }

            const quantityToSell = parseInt(quantityToSellStr);

            if (isNaN(quantityToSell) || quantityToSell <= 0) {
                alert("Por favor, insira um número válido.");
                return;
            }
            if (quantityToSell > maxQuantity) {
                alert("Você não tem essa quantidade para vender!");
                return;
            }

            // Calcula moedas com a quantidade correta
            const salePrice = shopItemData.price * quantityToSell;
            overworld.coins += salePrice;

            // Atualiza a quest com a quantidade correta
            const soldQuantity = quantityToSell;
            if (overworld.playerState.currentQuestId === "Q8.1" && item.id === 1) {
                const currentWheatSold = overworld.playerState.questFlags.WHEAT_SOLD || 0;
                overworld.playerState.questFlags.WHEAT_SOLD = currentWheatSold + soldQuantity;
                overworld.hud.updateTasks(overworld.playerState.currentQuestId, overworld.playerState);
                overworld.checkForQuestCompletion();
            }
            if (overworld.playerState.currentQuestId === "Q8.2" && item.id === 3) {
                const currentCornSold = overworld.playerState.questFlags.CORN_SOLD || 0;
                overworld.playerState.questFlags.CORN_SOLD = currentCornSold + soldQuantity;
                overworld.hud.updateTasks(overworld.playerState.currentQuestId, overworld.playerState);
                overworld.checkForQuestCompletion();
            }

            // --- A CORREÇÃO CRÍTICA ESTÁ AQUI ---
            // O objeto para remoção deve usar 'quantityToSell' (do prompt), e não 'item.quantity' (a pilha toda).
            const ItemRemove = {
                id: item.id,
                name: item.name,
                src: item.src,
                quantity: quantityToSell, // <<<<<<<<<<<<<<< ESSA LINHA É A CHAVE
            };

            // Agora a função em Overworld.js receberá a quantidade correta
            window.overworld.removeItemFromHotbar(ItemRemove);
            window.overworld.hud.updateCoins(overworld.coins);

            // Força a recriação da lista de venda para atualizar a quantidade restante
            buyTab.click();
            sellTab.click();
        };

        img.className = "foto-item";
        desc.className = "descricao-item";
        li.className = "cada-item";
        Sellbtn.className = "venda-btn";
        li.appendChild(img);
        li.appendChild(desc);
        li.appendChild(Sellbtn);
        sellList.appendChild(li);
    });

    // --- BOTÃO DE FECHAR (sem alterações) ---
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Fechar";
    closeBtn.style.marginTop = "16px";
    closeBtn.onclick = () => {
        overlay.remove();
        shopMenu.remove();
    };
    shopMenu.appendChild(closeBtn);

    document.body.appendChild(overlay);
    document.body.appendChild(shopMenu);
}