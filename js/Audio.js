class Audio {
    constructor(config) {
        this.soundtrack = [ // Lista de músicas de fundo
            //{name: "sound1", src: "./assets/audio/songs/musicaFundo1.ogg"},
            {name: "sound2", src: "./assets/audio/songs/musicaFundo2.ogg"},
            {name: "sound3", src: "./assets/audio/songs/musicaFundo3.ogg"},
            {name: "sound4", src: "./assets/audio/songs/musicaFundo4.ogg"},
            {name: "sound5", src: "./assets/audio/songs/musicaFundo5.ogg"},
            {name: "sound6", src: "./assets/audio/songs/musicaFundo6.ogg"},
        ];
        this.soundtrackPlaying = false;
        this.currentSong = null;
        this.currentSongIndex = -1;
        this.currentAreaSong = null;

        // Efeitos Sonoros
        this.walkingSoundEffect = new Howl({
            src: "./assets/audio/soundEffects/andarPinguim.ogg",
            loop: true,
            volume: 0.28,
        });
        this.easterEggSoundEffect = new Howl({
            src: "./assets/audio/soundEffects/easterEggSoundEffect.ogg",
            volume: 0.5,
        });
        this.frogSoundEffect = new Howl ({
            src: "./assets/audio/soundEffects/frogSoundEffect.ogg",
        })
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
            onend: () => {
                this.currentSong = null;
                if (this.soundtrackPlaying) {
                    this.startNextSoundtrackSong();
                }
            }
        });
        this.currentSong.play();
    }

    // Toca uma música específica para uma área
    playMusic(path, loop = true) {
        this.fadeOutCurrentSong(() => {
            this.currentAreaSong = path;
            this.currentSong = new Howl({ src: [path], loop: loop, volume: 0 });
            this.currentSong.play();
            this.currentSong.fade(0, 0.4, 500); // Fade In
        });
    }

    // Para a música da área e retoma a trilha sonora padrão
    resumeSoundtrack() {
        this.fadeOutCurrentSong(() => {
             this.startSoundtrack();
        });
    }

    // MÉTODO QUE ESTAVA FALTANDO E CAUSANDO O ERRO
    fadeOutCurrentSong(callback) {
        this.soundtrackPlaying = false;
        this.currentAreaSong = null;
        if (this.currentSong) {
            this.currentSong.once('fade', () => {
                if (this.currentSong) {
                    this.currentSong.stop();
                    this.currentSong.unload();
                    this.currentSong = null;
                }
                if (callback) callback();
            });
            this.currentSong.fade(this.currentSong.volume(), 0, 500);
        } else {
            if (callback) callback();
        }
    }

    playEasterEggSound() {
        if (this.currentSong) {
            // Abaixa o volume da música de fundo para destacar o efeito
            this.currentSong.fade(this.currentSong.volume(), 0.3, 800);
        }
        this.easterEggSoundEffect.play();
        this.easterEggSoundEffect.fade(0, 0,4, 900);

        // Quando o som do easter egg terminar, restaura o volume da música
        this.easterEggSoundEffect.once('end', () => {
            if (this.currentSong) {
                // Retorna ao volume padrão (0.3)
                this.currentSong.fade(0.3, 1, 1000); 
            }
        });
    }

    playFrogSoundEffect() {
        this.frogSoundEffect.play();
    }

    getRandomSong(currentSongIndex) {
        let newSongIndex;
        do {
            newSongIndex = Math.floor(Math.random() * this.soundtrack.length);
        } while (this.soundtrack.length > 1 && newSongIndex === currentSongIndex);
        return newSongIndex;
    }

    startWalkingSound() {
        if (!this.walkingSoundEffect.playing()) {
            this.walkingSoundEffect.play();
        }
    }

    stopWalkingSound() {
        this.walkingSoundEffect.stop();
    }
}