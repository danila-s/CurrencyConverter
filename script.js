const currencyStr = 'EUR, CHF, NOK, CAD, RUB ,GBP, MXN, CNY, ISK, KRW, HKD, CZK, BGN, BRL, USD, IDR, SGD, PHP, RON, HUF, ILS, THB, SEK, NZD, AUD, DKK, HRK, PLN, TRY, INR, MYR, ZAR, JPY'; 
 
window.addEventListener('load', () => init()); 
 
 
function init() { 
    const currencyArr = currencyStr.split(','); 

    const blocks = []; 
 
   
 
    function response(rates) {
        console.log(blocks[1].value, rates[blocks[1].value])
        blocks[1].setValue(+blocks[0].input * rates[blocks[1].value])
            
    }
        
        
        
     
 
    ['RUB', 'USD'].forEach((currency, index) => { 
        const currencyInput = new CurrencyInput(index + 1, currencyArr, currency, request); 
        blocks.push(currencyInput); 
    }); 

    function request() { 
        API.request(blocks[0].value, blocks[1].value, response) 
    } 

}
 
 
class CurrencyInput { 
    
    constructor(inputId, currencyList, defaultValue, callback) { 
        
        this.value = defaultValue; 
        const block = document.querySelector(`#block-${inputId}`); 
        this.inputField = block.querySelector(`#input-${inputId}`)
        const select = block.querySelector('select'); 
        const btns = block.querySelectorAll('.btn:not(select)'); 
        select.addEventListener('change', () => { 
            this.value = select.value; 
            console.log(this.value)
            block.querySelector('.selected').classList.remove('selected'); 
            select.classList.add('selected'); 
            callback(); 
        }) 
 
        btns.forEach(btn => { 
            btn.addEventListener('click', () => { 
                block.querySelector('.selected').classList.remove('selected'); 
                btn.classList.add('selected'); 
                this.value = btn.innerText;    
                callback(); 
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
            callback();
        })
    } 

    setValue (value)  {
        this.inputField.value = value;
    }
} 


 
const API = { 
    request(base, symbols, callback) { 
        console.log(base+ "  " + symbols)
        fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`) 
            .then(res => res.json()) 
            .then(data => { 
                console.log(data.rates)
                callback(data.rates) 
            }) 
    } 
}



