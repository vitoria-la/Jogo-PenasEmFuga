const itens_loja = [
    {   id: 1,
        name: "Trigo",
        price: 1,
        description: "Trigo fresco e saudável!",
        Image: "./../assets/img/trigo.png",
        quantity: 0,
        itemPorCompra: 1, // Quantidade comprada por vez
    },
    {   id: 2,
        name: "Semente de Trigo (x5)",
        price: 2,
        description: "Sementes de trigo para plantar!",
        Image: "./../assets/img/trigoSemente.png",
        quantity: 0,
        itemPorCompra: 5,
    },
    {   id: 3,    
        name: "Milho",
        price: 2,
        description: "Milho fresco e saboroso! Favorito das galinhas!",
        Image: "./../assets/img/milho.png",
        quantity: 0,
        itemPorCompra: 1,
    },
    {   id: 4,
        name: "Semente de Milho (x5)",
        price: 4,
        description: "Sementes de milho para plantar!",
        Image: "./../assets/img/milhoSemente.png",
        quantity: 0,
        itemPorCompra: 5,
    },
    {   id: 5,
        name: "Carretel de linha",
        price: 4,
        description: "Carretel de linha para fazer roupas e outros itens!",
        Image: "./../assets/img/linha.png",
        quantity: 0,
        itemPorCompra: 1,
    },
    {   id: 6,
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
    if(document.getElementById("shop-menu"))return; 
// Verifica se o menu da loja já está aberto

    // const MostrarPasse = itens_loja.filter(item => {
    //     if (item.id === 6) {
    //         return overworld.playerState.storyFlags.descobriuGalinha === true;
    //     }
    //     return true;
    // });

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

    const overlay =  document.createElement("div");
    overlay.id = "shop-overlay";
    overlay.onclick = () => {
        overlay.remove(); // Remove o overlay quando clicado
    }

    const shopMenu = document.createElement("div");
    shopMenu.id = "shop-menu";
    const ShopUl = document.createElement("ul");
    ShopUl.className = "ul";
    const BuyUl = document.createElement("ul");
    BuyUl.className = "ul";
    shopMenu.appendChild(tabs);


    // Função para alternar abas
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

    // Cria a lista de venda (vazia por enquanto)
    const sellList = document.createElement("ul");
    sellList.className = "ul";
    sellList.style.display = "none";
    shopMenu.appendChild(BuyUl);
    shopMenu.appendChild(sellList);

    itens_loja.forEach(item => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = item.Image;
        const desc = document.createElement("span");
        desc.innerText =  `${item.name} - ${item.description}`;
        const btn = document.createElement("button");
            btn.innerText = `Comprar (${item.price} moedas)`;
            btn.onclick = () => {
                //Sistema de Compra e redução de moedas
                if(overworld.coins >= item.price){
                    overworld.coins -= item.price; // Desconta o preço do item das moedas do jogador
                    item.quantity += 1; // Aumenta a quantidade do item comprado
                    overworld.hud.updateCoins(overworld.coins); // Atualiza a HUD com as novas moedas
                } else {
                    alert("Moedas insuficientes para comprar este item!"); // Alerta se não tiver moedas suficientes
                    return; // Sai da função se não tiver moedas suficientes
                }
                //-----------------------------------------------------------------------
                //Sistema de Adição de Itens ao Inventário
                const itemParaHotbar = {
                    id: item.id,
                    name: item.name,
                    src: item.Image,
                    quantity: item.itemPorCompra,
                };
                window.overworld.addItemToHotbar(itemParaHotbar); // Adiciona o item à hotbar do jogador
                //-----------------------------------------------------------------------
            };
        img.className = "foto-item"; // Para estilizar a imagem do item    
        desc.className = "descricao-item"; // Para estilizar a descrição do item
        li.className = "cada-item"; // Para estilizar o item
        btn.className = "compra-btn"; //Para estilizar o botão
        li.appendChild(img); // Adiciona a imagem do item
        li.appendChild(desc);  // Adiciona a descrição do item
        li.appendChild(btn);  // Adiciona o botão de compra
        BuyUl.appendChild(li);
    });

    overworld.playerState.items.forEach((item, idx) => {
        if (!item || item.quantity <= 0) return; 

        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = itens_loja.find(i => i.id === item.id).Image; // Obtém a imagem do item
        const desc = document.createElement("span");
        desc.innerText =  `${item.name} `;
        const Sellbtn = document.createElement("button");
            Sellbtn.innerText = ` Vender por: (${itens_loja.find(i => i.id === item.id).price} moedas)`;
            Sellbtn.onclick = () => {
                overworld.coins += itens_loja.find(i => i.id === item.id).price;

                const ItemRemove = {
                    id: item.id,
                    name: item.name,
                    src: item.src,
                    quantity: item.quantity,
                };
                // //essa é para a quest de vender itens 
                // playerState.questFlags.ITENS_VENDIDOS = (playerState.questFlags.ITENS_VENDIDOS || 0) + 1;
                // //----------------------------------------------------
                window.overworld.removeItemFromHotbar(ItemRemove);
                window.overworld.hud.updateCoins(overworld.coins); // Atualiza a HUD com as novas moedas
            };
        img.className = "foto-item"; // Para estilizar a imagem do item    
        desc.className = "descricao-item"; //Para estilizar a descrição do item
        li.className = "cada-item"; // Para estilizar o item
        Sellbtn.className = "venda-btn"; //Para estilizar o botão
        li.appendChild(img); // Adiciona a imagem do item
        li.appendChild(desc);  // Adiciona a descrição do item
        li.appendChild(Sellbtn);  // Adiciona o botão de compra
        sellList.appendChild(li);
});


    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Fechar";
    closeBtn.style.marginTop = "16px";
    closeBtn.onclick = () => {
        overlay.remove(); // Remove o overlay
        shopMenu.remove(); // Remove o menu da loja
    }
    shopMenu.appendChild(closeBtn);

    document.body.appendChild(overlay); // Adiciona o overlay ao body
    document.body.appendChild(shopMenu); // Adiciona o menu da loja ao body

}