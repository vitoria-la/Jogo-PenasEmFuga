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
        Image: "./../assets/img/trigo.png",
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
        Image: "./../assets/img/milho.png",
        quantity: 0,
        itemPorCompra: 5,
    },
    {   id: 5,
        name: "Carretel de linha",
        price: 4,
        description: "Carretel de linha para fazer roupas e outros itens!",
        Image: "./../assets/img/trigo.png",
        quantity: 0,
        itemPorCompra: 1,
    }
];

function openShop() {
    const overworld = window.overworld; // Obtém a instância do Overworld
    if(document.getElementById("shop-menu"))return; 
// Verifica se o menu da loja já está aberto

    const overlay =  document.createElement("div");
    overlay.id = "shop-menu";
    overlay.onclick = () => {
        overlay.remove(); // Remove o overlay quando clicado
        shopMenu.remove(); // Remove o menu da loja
    }

    const shopMenu = document.createElement("div");
    shopMenu.id = "shop-menu";
    const ul = document.createElement("ul");

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
            // Aqui você pode adicionar lógica para descontar moedas, adicionar ao inventário, etc.
            };
        img.className = "foto-item"; // Para estilizar a imagem do item    
        desc.className = "descricao-item"; // Para estilizar a descrição do item
        li.className = "cada-item"; // Para estilizar o item
        btn.className = "compra-btn"; //Para estilizar o botão
        li.appendChild(img); // Adiciona a imagem do item
        li.appendChild(desc);  // Adiciona a descrição do item
        li.appendChild(btn);  // Adiciona o botão de compra
        ul.appendChild(li);
    });
    shopMenu.appendChild(ul);
    
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




// buy: function(player) {
//             if (player.coins >= this.price) {
//                 player.coins -= this.price;
//                 this.quantity += 1;
//                 console.log(`Você comprou ${this.name}!`);
//             } else {
//                 console.log("Moedas insuficientes para comprar " + this.name);
//             }
//         }