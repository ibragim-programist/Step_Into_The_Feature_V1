import { Link } from 'react-router-dom';
import './Nav.css';

function Nav({ isLoggedIn, user, setIsLoggedIn, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="nav">
      <div className='logo'>
        <Link to="/">
          <h1 style={{ borderBottom: '1px solid black' }}>ДагЧат</h1>
        </Link>
      </div>

      <div className='navbar'>
        <Link to="/" className='N_home item'>Главная</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/login" className='N_login item'>Вход</Link>
            <Link to="/register" className='N_register item'>Регистрация</Link>
          </>
        ) : (
          <>
            <span className='item user-name'>{user?.name}</span>
            <Link to="/profile" className='N_profile item'>Профиль</Link>
            <button onClick={handleLogout} className='item logout-btn'>Выйти</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;