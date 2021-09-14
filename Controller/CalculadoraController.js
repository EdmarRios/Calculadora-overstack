class CalculadoraController {
    constructor(){
        this._dateEl = document.querySelector('.data');
        this._timeEl = document.querySelector('.hora');
        this._displayEl = document.querySelector('.expressao');
        this._prevEl = document.querySelector('.previa')
        this._listExp = ['0'];
        this._prev = 0;
        this.iniciar();
        this.initAddEventosBotoes();
        this.initAddEventsKeyboard();
        this._ifResult = false
    }

    iniciar(){
        this.attData();
        setInterval(()=>{
            this.attData();
        },1000)
    }

    inverse(){
        if(this.verifSeOperador(this.retornaUltimo())){
            this._listExp.pop()
        }
        if(this.retornaUltimo() == '0'){
            return;
        }
        this._listExp[this._listExp.length-1] = (1/this.retornaUltimo()).toString();
        this._ifResult = true;
        this.attDisplay();
    }

    attData(){
        let data = new Date();

        this._dateEl.innerHTML = data.toLocaleDateString('pt-BR');
        this._timeEl.innerHTML = data.toLocaleTimeString('pt-BR');
    }

    attDisplay(){
        this._displayEl.innerHTML = this._listExp.join('');
        this._prevEl.innerHTML = this._prev;
        this._displayEl.scrollBy(100,0)
    }

    clear(){
        this._listExp = ['0'];
        this._prev = '0'; 
        this.attDisplay();
    }

    apagar(){
        this._listExp[this._listExp.length-1] = this.retornaUltimo().slice(0,-1);
        if(this.retornaUltimo() == ''){
            if(this._listExp.length == 1){
                this._listExp = ['0']
            }else{
                this._listExp.pop();
            }
        }
        this.attDisplay();
    }

    error(){
        this._displayEl.innerHTML = 'ERROR';
        this._prevEl.innerHTML = '';
        this._ifResult = true;
    }

    retornaUltimo(){
        return this._listExp[this._listExp.length-1];
    }

    verifSeOperador(val){
        return ['×','÷','+','-'].indexOf(val)>-1;
    }
   
    addValoresExpressao(val){
        if(this.verifSeOperador(val)){
            if(this.verifSeOperador(this.retornaUltimo())){
                this._listExpp[this._listExp.length-1] = val;
            }else{
                this._listExp.push(val);
            }
        }else{
            if(this.verifSeOperador(this.retornaUltimo())){
                this._listExp.push(val);
            }else{
                if(this.retornaUltimo() == '0' && val.toString() != '.'){
                    this._listExp[this._listExp.length-1] = '';
                }
                if(this.retornaUltimo().indexOf('.')>-1 && val.toString() == '.'){
                    return
                }
                this._listExp[this._listExp.length-1] += val.toString();
            }
        }
        this.attDisplay();
    }

    multIndexOf(arrPrincipal,arr){
        for(let i = 0; i<arrPrincipal.length; i++){
            let v = arrPrincipal[i];
            for(let i2 = 0; i2<arr.length; i2++){
                let v2 = arr[i2];
                if(v == v2){
                    return [i,v2];
                }
            }
        }
        return [-1,'']
    }

    calculate(arr){
        for(let i = 0;i < arr.length; i+=2){
            arr[i] = parseFloat(arr[i])
        }

        while(this.multIndexOf(arr,['÷','×'])[0]>-1){
            let operation = this.multIndexOf(arr,['÷','×']); // [index, 'el']
            let result;
            switch(operation[1]){
                case '÷':
                    result = arr[operation[0]-1]/arr[operation[0]+1];
                    break;
                case '×':
                    result = arr[operation[0]-1]*arr[operation[0]+1];
                    break;
            }
            arr.splice(operation[0]-1,3,result);
        }
        while(this.multIndexOf(arr,['+','-'])[0]>-1){
            let operation = this.multIndexOf(arr,['+','-']); // [index, 'el']
            let result;
            switch(operation[1]){
                case '+':
                    result = arr[operation[0]-1]+arr[operation[0]+1];
                    break;
                case '-':
                    result = arr[operation[0]-1]-arr[operation[0]+1];
                    break;
            }
            arr.splice(operation[0]-1,3,result);
        }
        this._ifResult = true;
        arr[0] = arr.toString();
        this.attDisplay();
    }

    calcPrev(){
        let listPrev = [];
        this._listExp.forEach((v)=>{
            listPrev.push(v);
        })
        this.calculate(listPrev);
        this._ifResult = false;
        if(isNaN(listPrev[0])){
            return;
        }
        this._prev = listPrev.join('');
        this.attDisplay();
    }

    initAddEventsKeyboard(){
        document.addEventListener('keyup',(e)=>{

            switch(e.key){
                case 'c':
                    this.clear();
                    //limpar tudo
                    break;
                case 'Backspace':
                    if(this._ifResult == true){
                        this.clear();
                    }
                    this.apagar();
                    this.calcPrev();
                    //apagar ultimo caractere
                    break;
                case 'Enter':
                    //calcular valor final
                    if(this._ifResult == true){
                        return;
                    }
                    this._prev = '';
                    this.calculate(this._listExp);
                    break;
                case '+':
                case '-':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                case '.':
                    if(this._ifResult == true){
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValoresExpressao(e.key);
                    this.calcPrev();
                    break;
                case '/':
                    if(this._ifResult == true){
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValoresExpressao('÷');
                    this.calcPrev();
                    break;
                case '*':
                    if(this._ifResult == true){
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValoresExpressao('×');
                    this.calcPrev();
                    break;
            }
        })
    }

    initAddEventosBotoes(){
        let botoes = document.querySelectorAll('table.botoes td')

        botoes.forEach(botao => {
            botao.addEventListener('click',()=>{
               let valor = botao.innerHTML;
               switch(valor){
                   case'AC':
                        this.clear();
                    //limpar tudo
                        break;
                    case 'backspace':
                        if(this._ifResult == true){
                            this.clear();
                        }
                        this.apagar();
                        this.calcPrev();
                        //apagar ultimo caractere
                        break;
                    case '=':
                        //calcular valor final
                        if(this._ifResult == true){
                            return;
                        }
                        this._prev = '';
                        this.calculate(this._listExp);
                        break;
                    case '1/x':
                        //invertervalor digitado
                        this.inverse();
                        this.calcPrev();
                        break;
                    case '+':
                    case '-':
                    case '÷':
                    case '×':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '0':
                    case '.':
                        if(this._ifResult == true){
                            this.clear();
                            this._ifResult = false;
                        }
                        this.addValoresExpressao(valor);
                        this.calcPrev();
                        break;
               }
               if(isNaN(this._listExp[0])){
                   this.error();
               }
            })
        });
    }
}