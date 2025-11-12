import { checkValidEmail, checkValidPassword } from "../security/__checkValidData";


export const loginMiddleware = async (req, res, next) => {
    const { email, password } = req.body;

    if(checkValidEmail(email) && checkValidPassword(password)) {
        next();
    } else {
        next('Not valid data');
    }
}