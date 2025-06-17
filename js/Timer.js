class Timer {
  constructor({ overworld, onTimeEnd }) {
    this.overworld = overworld;
    this.onTimeEnd = onTimeEnd; // Callback para quando o tempo acabar
    this.element = null;
    this.progressElement = null;
    this.interval = null;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.classList.add('timer-container');
    this.element.innerHTML = `
      <div class="timer-label">Entrega do Mingau</div>
      <div class="timer-bar">
        <div class="timer-progress"></div>
      </div>
    `;
    this.progressElement = this.element.querySelector('.timer-progress');
    this.overworld.element.appendChild(this.element);
  }

  start(duration) { // duration em segundos
    this.element.style.display = 'block';
    const playerState = this.overworld.playerState;
    
    // Armazena o tempo final no estado do jogador para persistência
    playerState.porridgeTimerEndsAt = Date.now() + duration * 1000;

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      this.updateDisplay();
    }, 100); // Atualiza a cada 100ms
  }

  stop() {
    this.element.style.display = 'none';
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    // Limpa o estado do timer
    this.overworld.playerState.porridgeTimerEndsAt = null;
  }

  updateDisplay() {
    const playerState = this.overworld.playerState;
    const endTime = playerState.porridgeTimerEndsAt;
    
    if (!endTime) {
      this.stop();
      return;
    }

    const remainingTime = endTime - Date.now();
    
    if (remainingTime <= 0) {
      this.stop();
      this.onTimeEnd(); // Chama o callback quando o tempo acaba
      return;
    }
    
    // A duração total é de 20 segundos (20000 ms)
    const totalDuration = 20000; 
    const percentage = (remainingTime / totalDuration) * 100;
    this.progressElement.style.width = `${percentage}%`;

    // Muda a cor para vermelho se faltar menos de 25% do tempo (5 segundos)
    if (percentage < 25) {
      this.progressElement.classList.add('ending');
    } else {
      this.progressElement.classList.remove('ending');
    }
  }
}