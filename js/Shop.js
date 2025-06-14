const itens_loja = [
    {   name: "Trigo",
        price: 1,
        description: "Trigo fresco e saudável!",
        Image: " ",
        quantity: 0,
    },
    {   name: "Semente de Trigo (x5)",
        price: 2,
        description: "Sementes de trigo para plantar!",
        Image: " ",
        quantity: 0,
    },
    {   name: "Milho",
        price: 2,
        description: "Milho fresco e saboroso! Favorito das galinhas!",
        Image: " ",
        quantity: 0,
    },
    {   name: "Semente de Milho (x5)",
        price: 4,
        description: "Sementes de milho para plantar!",
        Image: " ",
        quantity: 0,
    },
    {   name: "Carretel de linha",
        price: 4,
        description: "Carretel de linha para fazer roupas e outros itens!",
        Image: " ",
        quantity: 0,
    }
];

function openShop() {
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

        const desc = document.createElement("span");
        desc.innerText =  `${item.name} - ${item.description}`;
        const btn = document.createElement("button");
            btn.innerText = `Comprar (${item.price} moedas)`;
            btn.onclick = () => {
                alert(`Você comprou: ${item.name} por ${item.price} moedas!`);
            // Aqui você pode adicionar lógica para descontar moedas, adicionar ao inventário, etc.
            };
        li.appendChild(desc);
        li.appendChild(btn);
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