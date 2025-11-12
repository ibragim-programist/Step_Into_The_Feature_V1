import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LogIn.css';

const serverUrl = 'http://localhost:7523';

function LogIn({ setIsLoggedIn, setUser }) {
  const [emailValue, setEmailValue] = useState('');
  const [passValue, setPassValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!emailValue || !passValue) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${serverUrl}/logIn`, {
        email: emailValue,
        password: passValue
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (e) {
      setError('Ошибка сервера. Пожалуйста, попробуйте позже');
      console.error('Login error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-form'>
        <h2>Вход в систему</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input
            type='email'
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder='Введите ваш email'
          />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input
            type="password"
            value={passValue}
            onChange={(e) => setPassValue(e.target.value)}
            placeholder='Введите ваш пароль'
          />
        </div>
        <button 
          onClick={handleLogin} 
          disabled={isLoading}
          className="login-button"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
        <div className="register-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

export default LogIn;