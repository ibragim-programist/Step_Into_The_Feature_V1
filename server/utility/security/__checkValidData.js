import validator from 'validator';

function checkValidName(n) {
    return ( n.length >= 2 && typeof n == 'string') ? true : false;
}


function checkValidEmail(e) {
    return (validator.isEmail(e)) ? true : false;
}


function checkValidPassword(p) {
    return (p.length >= 4 && typeof p == 'string') ? true : false;
}

function checkValidId(id) {
    return (typeof id == 'number') ? true : false;
}


export { checkValidName, checkValidEmail, checkValidPassword, checkValidId };