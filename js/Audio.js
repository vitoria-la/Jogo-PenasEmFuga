class Audio {
    constructor(config) {
        this.soundtrack = [ // Lista de músicas de fundo
            {name: "sound1", src: "./assets/audio/songs/musicaFundo1.ogg"},
            {name: "sound2", src: "./assets/audio/songs/musicaFundo2.ogg"},
            {name: "sound3", src: "./assets/audio/songs/musicaFundo3.ogg"},
            {name: "sound4", src: "./assets/audio/songs/musicaFundo4.ogg"},
            {name: "sound5", src: "./assets/audio/songs/musicaFundo5.ogg"},
            {name: "sound6", src: "./assets/audio/songs/musicaFundo6.ogg"},
        ]
        this.soundtrackPlaying = false; // Controla se a trilha sonora padrão deve tocar
        this.currentSong = null;
        this.currentSongIndex = -1;
        this.currentAreaSong = null; // Guarda o path da música da área atual

        // Efeitos Sonoros
        this.walkingSoundEffect = new Howl({
            src: "./assets/audio/soundEffects/andarPinguim.ogg",
            loop: true,
            volume: 0.6,
        });
        this.easterEggSoundEffect = new Howl({
            src: "./assets/audio/soundEffects/easterEggSoundEffect.ogg",
            //volume: 0.5,
        });
    }

    startSoundtrack() {
        if (this.currentSong || this.soundtrackPlaying) return;
        this.soundtrackPlaying = true;
        this.startNextSoundtrackSong();
    }

    startNextSoundtrackSong() {
        if (!this.soundtrackPlaying || this.currentSong) return;
        this.currentSongIndex = this.getRandomSong(this.currentSongIndex);
        const songInfo = this.soundtrack[this.currentSongIndex];
        this.currentSong = new Howl({
            src: [songInfo.src],
            loop: false,
            volume: 0.3,
            onend: () => {
                this.currentSong = null;
                if (this.soundtrackPlaying) {
                    this.startNextSoundtrackSong();
                }
            }
        });
        this.currentSong.play();
    }

    playMusic(path, loop = true) {
        this.fadeOutCurrentSong(() => {
            this.currentAreaSong = path; 
            this.currentSong = new Howl({ src: [path], loop: loop, volume: 0 });
            this.currentSong.play();
            this.currentSong.fade(0, 0.4, 500);
        });
    }

    fadeOutCurrentSong(callback) {
        this.soundtrackPlaying = false;
        this.currentAreaSong = null;
        if (this.currentSong) {
            this.currentSong.fade(this.currentSong.volume(), 0, 500);
            this.currentSong.once('fade', () => {
                if (this.currentSong) {
                    this.currentSong.stop();
                    this.currentSong.unload();
                    this.currentSong = null;
                }
                if (callback) callback();
            });
        } else {
            if (callback) callback();
        }
    }

    // O método resumeSoundtrack é chamado pelo toggleMusic, então não precisamos dele separadamente
    // Se quiser mantê-lo para outras lógicas:
    resumeSoundtrack() {
        this.fadeOutCurrentSong(() => {
             this.startSoundtrack();
        });
    }

    fadeOutCurrentSong(callback) {
        this.soundtrackPlaying = false;
        this.currentAreaSong = null;

        if (this.currentSong) {
            // O evento 'fade' garante que o callback só será chamado quando o fade terminar
            this.currentSong.once('fade', () => { 
                if (this.currentSong) {
                    this.currentSong.stop();
                    this.currentSong.unload(); // Libera a música da memória
                    this.currentSong = null;
                }
                if (callback) callback(); // Chama a próxima ação (ex: tocar outra música)
            });
            // Inicia o fade out
            this.currentSong.fade(this.currentSong.volume(), 0, 500);
        } else {
            // Se não havia música tocando, apenas executa o callback
            if (callback) callback();
        }
    }

    playEasterEggSound() {
        if (this.currentSong) {
            // Abaixa o volume da música de fundo para destacar o efeito
            this.currentSong.fade(this.currentSong.volume(), 0.1, 400);
        }
        
        this.easterEggSoundEffect.play();

        // Quando o som do easter egg terminar, restaura o volume da música
        this.easterEggSoundEffect.once('end', () => {
            if (this.currentSong) {
                // Retorna ao volume padrão (0.3)
                this.currentSong.fade(0.1, 0.3, 1000); 
            }
        });
    }

    getRandomSong(currentSongIndex) {
        let newSongIndex;
        do {
            newSongIndex = Math.floor(Math.random() * this.soundtrack.length);
        } while (this.soundtrack.length > 1 && newSongIndex === currentSongIndex);
        return newSongIndex;
    }

    startWalkingSound() { // Começa o barulho de andar 
        if (this.walkingSoundEffect.playing()) { // Se o som já está rodando, não começa a tocar de novo
            return;
        }
        this.walkingSoundEffect.play();
    }

    stopWalkingSound() { // Para o barulho de andar
        if (!this.walkingSoundEffect.playing()) { // Se o som já está parado, não precisa parar
            return; 
        }
        this.walkingSoundEffect.stop();
    }

}