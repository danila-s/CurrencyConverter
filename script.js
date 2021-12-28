const currencyStr = 'EUR, CHF, NOK, CAD, RUB, GBP, MXN, CNY, ISK, KRW, HKD, CZK, BGN, BRL, USD, IDR, SGD, PHP, RON, HUF, ILS, THB, SEK, NZD, AUD, DKK, HRK, PLN, TRY, INR, MYR, ZAR, JPY'; 
 
window.addEventListener('load', () => init()); 
 
 
function init() { 
    const currencyArr = currencyStr.split(', '); 

    const blocks = []; 

    const btn = document.querySelector('#btn-exchange');
    btn.addEventListener('click' , () => {
        blocks[1].id = 3;
        const value1 = blocks[0].value;
        const value2 = blocks[1].value;
        blocks[1].value = value1
        blocks[0].value = value2
        blocks[0].selectSelected(value2)
        blocks[1].selectSelected(value1)
        request(1)
    })
 
   
 
    function response(rates , id) {
        if(id === 2){
            blocks[0].setValue(+blocks[1].inputField.value/rates[blocks[1].value])
        }
        else if (id === 1 ) {blocks[1].setValue(+blocks[0].inputField.value * rates[blocks[1].value])
        blocks[1].id = 2 ;
        } 
    }
        
        
        
     
 
    ['RUB', 'USD'].forEach((currency, index) => { 
        const currencyInput = new CurrencyInput(index + 1, currencyArr, currency, request); 
        blocks.push(currencyInput); 
    }); 

    function request(id ) { 
        API.request(blocks[0].value, blocks[1].value, response , id) 
    } 

}
 
 
class CurrencyInput { 
    
    constructor(inputId, currencyList, defaultValue, callback) { 
        this.id = inputId;
        this.value = defaultValue; 
        const block = document.querySelector(`#block-${inputId}`); 
        this.block = block
        this.inputField = block.querySelector(`#input-${inputId}`)
        const select = block.querySelector('select'); 
        this.select = select
        const btns = block.querySelectorAll('.btn:not(select)'); 
        select.addEventListener('change', (e) => { 

            this.value = select.value; 
            console.log(this.value)
            block.querySelector('.selected').classList.remove('selected'); 
            select.classList.add('selected'); 
            this.selectSelected(this.value)
            console.log('VALUE!!!!!!')
            
            callback(1); 
        }) 
 
        btns.forEach(btn => { 
            btn.addEventListener('click', () => { 
                block.querySelector('.selected').classList.remove('selected'); 
                btn.classList.add('selected'); 
                this.value = btn.innerText;   
                callback(1); 
            }); 
        }); 
        
        
        currencyList.forEach(currencyText => { 
            const option = document.createElement('option'); 
            option.value = currencyText; 
            option.innerText = currencyText; 
            select.append(option); 
        }); 

        const input = block.querySelector('input');
        input.addEventListener('change', (e) => {
            this.input = e.target.value ;
            callback(this.id);
        })
        this.btns = btns;
        
    } 

    selectSelected (value){
        const btn = [...this.btns].find(btn => btn.innerText === value)
        if(btn){
            btn.click();
        }else{
        const options = this.select.querySelectorAll('option');
        const option =[...options].find(option => option.value === value);
        option.selected = true ;
        this.block.querySelector('.selected').classList.remove('selected');
        this.select.classList.add('selected');
        
        }
        this.value=value;
    
    }

    setValue (value)  {
        this.inputField.value = value;
    }


} 


 
const API = { 
    request(base, symbols, callback ,id) { 
        if(base === symbols){
            console.log('Одинаковые значения')
        }else {
        fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`) 
            .then(res => res.json()) 
            .then(data => { 
                console.log(data.rates)
                callback(data.rates , id) 
            })
            .catch(eror => {
                alert('Что-то пошло не так ')
            }) 
        }
    } 
}