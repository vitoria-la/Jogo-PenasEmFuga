window.creditos_show = function() {
    // Evita múltiplos pop-ups
    if (document.getElementById("credits-overlay")) return;

    // Overlay escuro
    const overlay = document.createElement("div");
    overlay.id = "credits-overlay";

    // Pop-up de créditos
    const popup = document.createElement("div");
    popup.id = "credits-popup";

    // Botão de fechar
    const closeBtn = document.createElement("button");
    closeBtn.id = "credits-close-btn";
    closeBtn.innerText = "Fechar";
    closeBtn.onclick = () => overlay.remove();
    popup.appendChild(closeBtn);

    // Lista de desenvolvedores (adicione os seus aqui)
    const devs = [
        { nome: "Danilo R. Toriy", foto: "./../assets/img/milho.png" },
        { nome: "Gabriel Miashiro ", foto: "./../assets/img/milho.png" },
        { nome: "Laura Vitória", foto: "./../assets/img/milho.png" },
        { nome: "Matheus Previato", foto: "./../assets/img/milho.png" },
        { nome: "Murilo", foto: "./../assets/img/milho.png" }
    ];

    devs.forEach(dev => {
        const card = document.createElement("div");
        card.className = "credits-card";

        const img = document.createElement("img");
        img.src = dev.foto;
        img.alt = dev.nome;
        img.className = "credits-foto";

        const nome = document.createElement("strong");
        nome.innerText = dev.nome;
        nome.className = "credits-nome";

        card.appendChild(img);
        card.appendChild(nome);

        popup.appendChild(card);
    });

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

}
