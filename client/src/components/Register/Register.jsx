import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const serverUrl = 'http://localhost:7523';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password.length < 4) {
      setError('Пароль должен содержать минимум 4 символа');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${serverUrl}/register`, {
        name,
        email,
        password
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        setError('Ошибка регистрации');
      }
    } catch (e) {
      if (e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError('Ошибка сервера. Пожалуйста, попробуйте позже');
      }
      console.error('Registration error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='register'>
      <h2>Регистрация</h2>
      {error && <div className="error">{error}</div>}
      <div className="form-group">
        <label>Имя</label>
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength="2"
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Пароль</label>
        <input
          type="password"
          placeholder="Пароль (минимум 4 символа)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="4"
          required
        />
      </div>
      <button onClick={handleRegister} disabled={isLoading}>
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      <p className="login-link">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default Register;