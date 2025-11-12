import Router from 'express';
import { checkExistUser } from '../__loadDataBase.js';

const logInRouter = Router();

logInRouter.post('/logIn', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(400).json({ 
                error: 'Email и пароль обязательны' 
            });
        }

        const user = await checkExistUser(email, password);
        
        if(!user) {
            return res.status(401).json({ 
                error: 'Неверные учетные данные' 
            });
        }

        res.status(200).json({ 
            success: true, 
            user 
        });
    } catch(error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ 
            error: 'Ошибка сервера',
            details: error.message 
        });
    }
});

export default logInRouter;