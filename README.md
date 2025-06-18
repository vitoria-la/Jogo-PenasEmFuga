HTML
index.html
Arquivo principal que estrutura o jogo na web. Carrega o canvas, elementos da interface (HUD, diálogos, menus) e importa os arquivos CSS e JS necessários para o funcionamento.

🔸 CSS (Estilo visual)
Arquivos responsáveis pela aparência dos elementos do jogo:

style.css – Estilo geral do jogo, controla a aparência da tela, HUD, menus e elementos comuns.

Hud.css – Estilo da interface HUD (vida, inventário, missões).

dialog.css – Estiliza a caixa de diálogos.

Timer.css – Formata o cronômetro ou contagem de tempo no jogo.

shop.css – Estilo específico da interface de loja.

credits.css – Tela de créditos, com design separado.

TitleScreen.css – Estilo da tela inicial do jogo.

Zoom.css – Controla efeitos de zoom na interface ou no canvas.

SceneTransition.css – Efeitos visuais de transição entre cenas/mapas.

PlantingSystem.css – Aparência da interface de plantio.

EasterEgg.css – Aparência para elementos secretos ou easter eggs.

🟩 JS (Lógica e funcionamento do jogo)
🎧 Áudio
Audio.js – Gerencia os sons do jogo (efeitos sonoros, música de fundo e ações como plantar, pegar itens, comprar).

🎮 Sistema Principal
Init.js – Inicializa o jogo, carregando mapas, assets e configurações.

Overworld.js – Controla o mundo aberto (mapa), atualizando e desenhando os elementos na tela (personagens, jogador, objetos).

OverworldEvent.js – Gerencia eventos no mapa, como interações com NPCs, objetos ou mudanças no ambiente.

OverWorldMap.js – Define os mapas do jogo, onde estão NPCs, objetos interativos e colisões.

SceneTransition.js – Faz as transições visuais entre cenas (fade in, fade out).

Hud.js – Controla a interface do HUD, como inventário, status, vida e dinheiro.

Timer.js – Controla o sistema de tempo do jogo, como contagem, ciclos ou cronômetros.

🗣️ Interações e Diálogos
DialogManager.js – Controla a exibição de diálogos, textos, balões e interações verbais com NPCs.

TextMessage.js – Sistema de mensagens na tela, como balões de fala, notificações e avisos.

🧠 Jogabilidade e Objetos
GameObject.js – Classe base para qualquer objeto do jogo: NPCs, plantas, itens, etc.

Person.js – Classe dos personagens, incluindo o jogador e NPCs, com lógica de movimentação e comportamento.

DirectionInput.js – Interpreta os comandos do teclado para movimentação (cima, baixo, esquerda, direita).

KeypressListener.js – Detecta teclas específicas para interações (E, espaço, etc.).

🌱 Sistemas Específicos
PlantingSystem.js – Sistema de plantio, permitindo o jogador plantar e colher.

PlantableSpot.js – Define os locais específicos onde é possível plantar.

Shop.js – Sistema de loja, permitindo comprar e vender itens.

Items.js – Gerencia os itens do jogo, incluindo nome, preço, funções e efeitos.

📜 Quests e Easter Eggs
Quests.js – Sistema de missões. Controla progresso, objetivos e recompensas.

EasterEgg.js – Lógica para elementos secretos ou surpresas escondidas no jogo.

🔧 Utilitários
utils.js – Funções auxiliares usadas em vários pontos do código, como cálculos, delays, animações
