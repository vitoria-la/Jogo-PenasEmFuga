class Audio {
    constructor(config) {
        this.soundtrack = [ // Lista de músicas de fundo
            {name: "sound1", src: "./assets/audio/songs/musicaFundo1.ogg"},
            {name: "sound2", src: "./assets/audio/songs/musicaFundo2.ogg"},
            {name: "sound3", src: "./assets/audio/songs/musicaFundo3.ogg"},
            {name: "sound4", src: "./assets/audio/songs/musicaFundo4.ogg"},
        ]
        this.currentSong = null; // Uma instancia da classe Howl (biblioteca howler) que abriga a música que está tocando no momento
        this.currentSongIndex = -1; // Variável que abriga o index do array soundtrack onde está a música atual (currentSong)
        this.isPlaying = true; // Para saber se está tocando uma música ou não
        this.currentAreaSong = null;
    }

    startSoundtrack() { // Começa a trilha sonora
        if (!this.isPlaying) { // Se nenhuma música está tocando
            this.soundtrackPlaying = true;
            this.startSoundtrackSong(); // Começa a tocar uma música
        }
    }

    startNextSoundtrackSong() {
        if (!this.soundtrackPlaying || this.currentSong) return; // Não inicia uma nova se não for para tocar ou se já houver uma

        this.currentSongIndex = this.getRandomSong(this.currentSongIndex);
        this.currentSong = new Howl({
            src: [this.soundtrack[this.currentSongIndex].src],
            loop: false, // O 'end' listener cuidará do loop
            volume: 0.3, // Volume inicial
        });
        
        this.currentSong.play();

        // Quando a música terminar, toca a próxima da playlist
        this.currentSong.on('end', () => {
            this.currentSong = null;
            if (this.soundtrackPlaying) {
                this.startNextSoundtrackSong();
            }
        });
    }

    // NOVO: Toca uma música específica (para uma área do mapa)
    playMusic(path, loop = true) {
        // Para a trilha sonora padrão com fade out
        this.fadeOutSoundtrack();
        //Armazena a música da área que está tocando
        this.currentAreaSong = path;
        // Toca a nova música após o fade out da anterior
        setTimeout(() => {
            this.currentSong = new Howl({
                src: [path],
                loop: loop,
                volume: 0.4
            });
            this.currentSong.play();
        }, 500); // 500ms para o fade out
    }

    // NOVO: Para a música atual com um efeito suave
    fadeOutSoundtrack() {
        this.soundtrackPlaying = false; // Impede que a próxima música da trilha comece
        this.currentAreaSong = null; 
        if (this.currentSong) {
            // Howler.js fade: do volume atual para 0 em 500ms
            this.currentSong.fade(this.currentSong.volume(), 0, 500);
            
            // Para a música e a remove após o fade
            setTimeout(() => {
                if (this.currentSong) {
                    this.currentSong.stop();
                    this.currentSong = null;
                }
            }, 500);
        }
    }

    getRandomSong(currentSongIndex) { // Pega um index aleatório para escolher a música
        let newSongIndex; // Cria um novo index
        do {
            newSongIndex = Math.floor(Math.random() * this.soundtrack.length) + 0; // Sorteio que vai de 0 - o tamanho do array soundtrack
        } while (newSongIndex === currentSongIndex); // Só sai do loop se o novo index for diferente do antigo
        return newSongIndex; // Retorna o novo index
    }

}