
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const keyboardSymbols = '`~!@#$%^&*()_+{}|:"<>?[];,./-=';

let password = "";
let passwordLength = 11;
let checkCount = 1;
handleSlider()
setIndicator("#f8fafc");



// set password length
function handleSlider(){
       inputSlider.value = passwordLength;
       lengthDisplay.innerText = passwordLength;
       
       // const min = inputSlider.min;     FOR SLIDER BG-COLOR-CHANGE...
       // const max = inputSlider.max;
       // inputSlider.style.backgroundSize = ((passwordLength - min) * 100/(max - min)) + "% 100%"
}

function setIndicator(color){
       indicator.style.backgroundColor = color;
}

function getRdmInteger(min, max){
       return Math.floor(Math.random() * (max - min)) + min;

}

function generateRandomNumber(){
       return getRdmInteger(0, 9);
}

function generateLowerCase(){
       return String.fromCharCode(getRdmInteger(97, 123));
}

function generateUpperCase(){
       return String.fromCharCode(getRdmInteger(65, 91));
}

function generateSymbols(){
       const rdmNum = getRdmInteger(0, keyboardSymbols.length);
       return keyboardSymbols.charAt(rdmNum); 
}

function calcStrength(){
       let hasUpper = false;
       let hasLower = false;
       let hasNum = false;
       let hasSym = false;
       if (uppercaseCheck.checked) hasUpper = true;
       if (lowercaseCheck.checked) hasLower = true;
       if (numbersCheck.checked) hasNum = true;
       if (symbolsCheck.checked) hasSym = true;
       
       if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
              setIndicator("#22c55e");
       } else if (
              (hasLower || hasUpper) && 
              (hasNum || hasSym) && 
              passwordLength >= 6
       ) {
              setIndicator("#fde047");
       } else {
              setIndicator("#f43f5e");
       }
}

async function copyContent(){
       try{
              await navigator.clipboard.writeText(passwordDisplay.value);
              copyMsg.innerText = "Copied!";
       }
       catch(e){
              copyMsg.innerText = "Failed!"
       };

       copyMsg.classList.add("active")

       setTimeout(() => {
              copyMsg.classList.remove("active")
       }, 1000);
}

inputSlider.addEventListener('input', (num) => {
       passwordLength = num.target.value;
       handleSlider();
})

copyBtn.addEventListener('click', () => {
       if(passwordDisplay.value)
              copyContent();
})

function handleCheckBoxChange(){
       checkCount = 0;
       allCheckBox.forEach((checkbox) => {
              if(checkbox.checked)
                     checkCount++;
       })

       // special condition
       if(passwordLength < checkCount){
              passwordLength = checkCount;
              handleSlider();
       }

}

allCheckBox.forEach((checkbox) => {
       checkbox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(array){
       // fisher yates method

       for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              const temp = array[i];
              array[i] = array[j];
              array[j] = temp;
       }
            
       let str = "";
       array.forEach((el) => (str += el));    
       return str;
            
}

generateBtn.addEventListener('click', () => {
       // if none of the ckeckbox are selected
       if(checkCount <= 0) return;

       
       else if(passwordLength < checkCount){
              passwordLength = checkCount;
              handleSlider();
       }


       //let's start the journey to find the new password

       //remove old pass.
       password="";

       //let's put the characters according to the check boxes
       let funcArr = [];


       if(uppercaseCheck.checked){
              funcArr.push(generateUpperCase);
       }

       if(lowercaseCheck.checked){
              funcArr.push(generateLowerCase);
       }

       if(numbersCheck.checked){
              funcArr.push(generateRandomNumber);
       }

       if(symbolsCheck.checked){
              funcArr.push(generateSymbols);
       }

       // compulsory addition
       for(let i=0; i<funcArr.length; i++){
              password += funcArr[i]();
       }

       // remaining addition
       for(let i=0; i<passwordLength-funcArr.length; i++){
              let randIndex = getRdmInteger(0, funcArr.length);
              password += funcArr[randIndex]();
       }


       //now shuffling all characters of the generated pass
       password = shufflePassword(Array.from(password));

       // show in UI
       passwordDisplay.value = password;

       calcStrength();

})
