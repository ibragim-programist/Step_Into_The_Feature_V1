import { ru } from './__getSecurityData.js';
import { checkValidName, checkValidEmail, checkValidPassword, checkValidId } from './__checkValidData.js';
import { notAllowedWords } from './__getNotAllowedWords.js';

const data = ru;

function containsForbiddenPatterns(input, patterns) {
    const lowerInput = input.toLowerCase();
    return patterns.some(pattern => lowerInput.includes(pattern.toLowerCase()));
}

function isNotXSS(input) {
    if (!checkValidName(input)) {
        return false;
    }
    return !containsForbiddenPatterns(input, ['<script>', '</script>']);
}

function isNotCSRF(input) {
    if (!checkValidName(input)) {
        return false;
    }
    return !containsForbiddenPatterns(input, ['<div>', '</div>']);
}

function fullCheckName(n) {
    return (checkValidName(n) && isNotCSRF(n) && isNotXSS(n)) ? true : false;
}

function fullCheckEmail(e) {
    return (checkValidEmail(e) && isNotCSRF(e) && isNotXSS(e)) ? true : false;
}

function fullCheckPassword(p) {
    return (checkValidPassword(p) && isNotCSRF(p) && isNotXSS(p)) ? true : false;
}

function fullCheckId(id) {
    return (checkValidId(id) && isNotCSRF(id) && isNotXSS(id)) ? true : false;
}

/*
function isSecureInput(input) {
    if (!checkValidName(input)) {
        return false;
    }
    return !containsForbiddenPatterns(input, notAllowedWords);
}


function myEncode(input) {
    if (typeof input !== 'string') return input;
    
    let result = [];
    for (const char of input) {
        const lowerChar = char.toLowerCase();
        
        if (data.letterToDigitals[lowerChar]) {
            result.push(data.letterToDigitals[lowerChar]);
        } 
        else if (data.digitalsToLetters[char]) {
            result.push(data.digitalsToLetters[char]);
        }
        else {
            result.push(char);
        }
    }
    
    return result.join('_');
}
*/
/*
function myDecode(encoded) {
    if (typeof encoded !== 'string') return encoded;
    
    let result = [];
    const parts = encoded.split('_');
    
    for (const part of parts) {
        if (data.digitalsToLetters[part]) {
            result.push(data.digitalsToLetters[part]);
        } 
        else if (data.letterToDigitals[part.toLowerCase()]) {
            result.push(data.letterToDigitals[part.toLowerCase()]);
        }
        else {
            result.push(part);
        }
    }
    
    return result.join('');
}
*/

/*export { isNotXSS, isNotCSRF, isSecureInput, myDecode, myEncode };*/
export { isNotXSS, isNotCSRF, fullCheckEmail, fullCheckId, fullCheckName, fullCheckPassword }