/*function OnNumberClick(){
    document.getElementById("Display").value = "Number";
}

function OnSignClick(){
    document.getElementById("Display").value = "Sign";
}*/


let Signable = false;
const numbers = ['1','2','3','4','5','6','7','8','9','0'];
const operators = ['/','*','-','+','=', '^', '**'];

over = false
error = true
ParOffset = 0
ParHas = true

document.querySelectorAll('.MyButton').forEach(button => {
    button.addEventListener('click', function() {
        const buttonType = this.getAttribute('data-type');
        const buttonValue = this.getAttribute('data-value');

        if(buttonType !== 'Answer' && error) Restart()
        
        if(buttonType === 'Restart'){
            Restart();
        } else if(buttonType === 'Par'){
            OnParClick(buttonValue);
        } else if( buttonType === 'Answer'){
            DisplayAnswer();
        } else if (buttonType === 'number') {
            OnNumberClick(buttonValue);
        } else if (buttonType === 'sign') {
            OnSignClick(buttonValue);
        } else if (buttonType === 'Del'){
            OnDelClick();
        }
        
        if(display.value.length === 0)
            Signable = false;
    });
});





function Restart(){
    over = false
    error = false
    ParOffset = 0
    Signable = false
    ParHas = true
    document.getElementById('Display').value = ''
    document.getElementById('Test').value = ''

}



function DisplayAnswer(){
    
    Signable = true;

    display = document.getElementById('Display');
    var answer = display.value
    if(operators.includes(answer[answer.length-1])) answer = answer.slice(0,-1)

    answer = AnswerAfterChanges(answer)
    document.getElementById('Test').value = answer
    answer = formatNumberWithPrecision(eval(answer))
    
    try{
        if(isFinite(answer))
            display.value = answer;
        else{
            display.value = 'Error';
            error = true
        }
    } catch(e) {return e.expression}
    
}



function AnswerAfterChanges(answer){
    answer = FixParIssues(answer);


    answer = FixPiAndEIssues(answer)

    answer = AddMultiplicationBeforeLetter(answer,'l')

    answer = ChangeSymbols(answer)

    
    return answer;
}



function ChangeSymbols(expression){

    expression = ChangeUpArrowIntoTwoStars(expression)
    expression = ChangeLns(expression)
    expression = ChangeLogs(expression)
    expression = ChangeEValue(expression)
    expression = ChangePiValue(expression)
    
    return expression
}

function FixPiAndEIssues(expression){
    expression = AddMultiplicationBeforeLetter(expression, 'π')
    expression = AddMultiplicationBeforeLetter(expression, 'e')

    expression = AddMultiplicationAfterLetter(expression, 'π')
    expression = AddMultiplicationAfterLetter(expression, 'e')

    return expression
}



function FixParIssues(expression){
    expression = AddMissingPar(expression)
    expression = FixEmptyPars(expression)
    return expression
}



function FixEmptyPars(expression){
    return expression.replace(/\(\)/g, '(1)')
}



function AddMultiplicationBeforeLetter(expression, letter) {
    // Add '*' before letter if preceded by a digit, another letter, or itself
    const regex = new RegExp(`(\\d|[a-zA-Z]|${letter})\\s*(${letter})`, 'g');
    expression = expression.replace(regex, `$1*$2`);
    
    // Ensure that if the letter follows itself, add multiplication
    const adjacentRegex = new RegExp(`(${letter})(${letter})`, 'g');
    expression = expression.replace(adjacentRegex, `$1*$2`);

    return expression;
}



function AddMultiplicationAfterLetter(expression, letter) {
    // Add '*' after letter if followed by a digit or another letter
    const regex = new RegExp(`(${letter})(\\d|[a-zA-Z])`, 'g');
    return expression.replace(regex, `$1*$2`);
}



function ChangeUpArrowIntoTwoStars(expression){
    return expression.replace(/\^/g, '**');
}



function ChangeLogs(expression){
    return expression.replace(/log([0-9]+)\(([^)]+)\)/g, 'Math.log($2) / Math.log($1)')
}



function ChangeLns(expression){
    return expression.replace(/ln/g, 'Math.log')
}



function ChangeEValue(expression){
    return expression.replace(/e/g, '2.7182818284590');
}



function ChangePiValue(expression){
    return expression.replace(/π/g, '3.141592653589')
}



function OnParClick(buttonValue){
    display = document.getElementById('Display');
    var last = display.value[display.value.length-1]
    if(buttonValue === '(' ){
        var lastThreeChars =display.value.slice(-3)
        if(last==='g')OnNumberClick('10')
        if(numbers.includes(last) && !(lastThreeChars.includes('g') || lastThreeChars.includes('n'))){
            OnSignClick('*');
        }
        OnNumberClick('(')
        /*Signable = false;*/
        ParOffset ++;
        ParHas=false;
    }else if( buttonValue === ')' && ParOffset > 0){
        if(operators.includes(last))
            OnDelClick();
        OnNumberClick(')')
        ParOffset--;
    }
}



function AddMissingPar(expression){
    if(!ParHas){                   // if There is a par that doesn't contain anything,
        if(expression[expression.length-1] ===')'){   // add the number one inside it
            expression+='*'
        }
        expression+='1'  
    }

    while(ParOffset != 0 ){
        expression+=')'
        ParOffset--;
    }

    return expression
}



function OnDelClick(){

    const display = document.getElementById('Display');
    
    if(display.value.length === 0)
        return;
    
    var last = display.value.substr(display.value.length -1)
    if( last === '('){
        ParOffset--;
    } else if(last === ')'){
        ParOffset++;
    }

    display.value = display.value.slice(0,-1);

    if(display.value.length === 0){
        Signable = false
        return;
    }

    last = display.value.substr(display.value.length -1)
    if(numbers.includes(last)){
        Signable = true
    } else if (operators.includes(last)){
        Signable = false
    }
    
}



function OnNumberClick(number) {
    // Your logic for handling number clicks
    Signable = true;

    const display = document.getElementById('Display');
    var last = display.value[display.value.length -1]
   
    if(last==='(') ParHas = true
    if(last === ')' && number !== ')' || over){
        OnSignClick('*')
        ParHas = true
    }
    display.value += number;
    
}



function OnSignClick(sign) {
    // Your logic for handling sign clicks
    if(Signable){
        const display = document.getElementById('Display');
        // Add logic for different sign values (e.g., +, -, *, /, =, bs)
        display.value += sign;
        Signable = false;
    }
}



function formatNumberWithPrecision(num) {
    // Check if the number is an integer
    if (Number.isInteger(num)) {
        // Return the integer without any decimal points
        return num.toString();
    } else {
        // Use toFixed to format the number to a maximum of 6 decimal places
        // and remove trailing zeros using parseFloat
        return parseFloat(num.toFixed(6)).toString();
    }
}