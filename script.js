const currencyStr = 'EUR, CHF, NOK, CAD, RUB, GBP, MXN, CNY, ISK, KRW, HKD, CZK, BGN, BRL, USD, IDR, SGD, PHP, RON, HUF, ILS, THB, SEK, NZD, AUD, DKK, HRK, PLN, TRY, INR, MYR, ZAR, JPY'; 
 
window.addEventListener('load', () => init()); 
 
 
function init() { 
    const currencyArr = currencyStr.split(', '); 

    const blocks = []; 

    const btn = document.querySelector('#btn-exchange');
    btn.addEventListener('click' , () => {
        const value1 = blocks[0].value;
        const value2 = blocks[1].value;
        console.log(value1);
        console.log(value2);
        blocks[1].value = value1
        blocks[0].value = value2
        blocks[0].selectSelected(value2)
        blocks[1].selectSelected(value1)
        request()
    })
 
   
 
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




