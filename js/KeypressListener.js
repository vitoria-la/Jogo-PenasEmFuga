class KeypressListener {
  constructor(keyCode, callback) {
    // Armazena o código da tecla que queremos monitorar
    this.keyCode = keyCode;
    
    // Armazena a função de callback que será executada quando a tecla for pressionada
    this.callback = callback;
    
    // Flag para controlar se a tecla está sendo pressionada
    this.keySafe = true;

    // Vincula os métodos ao contexto da instância
    this.keydownFunction = this.keydownFunction.bind(this);
    this.keyupFunction = this.keyupFunction.bind(this);
    
    // Adiciona os event listeners para keydown e keyup
    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyupFunction);
  }

  // Método executado quando uma tecla é pressionada
  keydownFunction(event) {
    // Verifica se a tecla pressionada é a que estamos monitorando e se é seguro executar o callback
    if (event.code === this.keyCode && this.keySafe) {
      // Marca como não seguro para evitar múltiplas execuções enquanto a tecla estiver pressionada
      this.keySafe = false;
      
      // Executa o callback
      this.callback();
    }
  }

  // Método executado quando uma tecla é solta
  keyupFunction(event) {
    // Quando a tecla monitorada é solta, marca como seguro novamente
    if (event.code === this.keyCode) {
      this.keySafe = true;
    }
  }

  // Método para remover os event listeners quando não precisamos mais deles
  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
}
