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

  const shopMenu = document.createElement("div");
  //css
  shopMenu.id = "shop-menu";
    shopMenu.style.position = "absolute";
    shopMenu.style.top = "50%";
    shopMenu.style.left = "50%";
    shopMenu.style.transform = "translate(-50%, -50%)";
    shopMenu.style.background = "#fffbe7";
    shopMenu.style.border = "4px solid #333";
    shopMenu.style.padding = "32px";
    shopMenu.style.zIndex = "100";
    shopMenu.style.minWidth = "320px";
    shopMenu.style.boxShadow = "0 0 24px #0008";
    shopMenu.style.display = "flex";
    shopMenu.style.flexDirection = "column";
    shopMenu.style.alignItems = "center";
    //---------------
  const ul = document.createElement("ul");
  //css
  ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.width = "100%";
    //-----------------
  itens_loja.forEach(item => {
    const li = document.createElement("li");
    //css
    li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.margin = "12px 0";
//--------------------------------------------------
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
    closeBtn.onclick = () => shopMenu.remove();
    shopMenu.appendChild(closeBtn);

    // Adiciona o menu à game-container
    document.querySelector(".game-container").appendChild(shopMenu);
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