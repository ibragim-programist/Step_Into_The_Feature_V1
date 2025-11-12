import axios from 'axios';
import './Home.css';
import { useEffect, useState } from 'react';
import Error from '../Error/Error.jsx';
import Room from '../Room/Room.jsx';
import { useNavigate } from 'react-router-dom';

const serverUrl = 'http://localhost:7523';

function Home({ user }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwords, setPasswords] = useState({});
  const [roomProps, setRoomProps] = useState(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPass, setNewRoomPass] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${serverUrl}/rooms`);
      const processedRooms = response.data.success
        .filter(room => room && room.name && room.id)
        .map(room => ({
          name: room.name.trim(),
          id: room.id.trim()
        }));
      setRooms(processedRooms);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setErrorMessage('Ошибка загрузки комнат: ' + error.message);
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const intervalId = setInterval(fetchRooms, 20000);
    return () => clearInterval(intervalId);
  }, []);

  const joinRoom = async (name, password) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${serverUrl}/room/${name}/${password}`);
      if (response.data.success) {
        setRoomProps({ ...response.data.success, user });
      }
    } catch (e) {
      setIsError(true);
      setErrorMessage('Не удалось войти в комнату: ' + (e.response?.data?.error || 'Неверный пароль'));
    }
  };

  const createRoom = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newRoomName || !newRoomPass) {
      setErrorMessage('Название и пароль комнаты обязательны');
      return;
    }

    try {
      await axios.post(`${serverUrl}/rooms/addRoom`, {
        nameRoom: newRoomName,
        passRoom: newRoomPass
      });
      setNewRoomName('');
      setNewRoomPass('');
      fetchRooms();
    } catch (e) {
      setErrorMessage('Не удалось создать комнату: ' + (e.response?.data?.error || 'Ошибка сервера'));
    }
  };

  if (roomProps) {
    return <Room props={roomProps} />;
  }

  if (isError) {
    return <Error message={errorMessage} />;
  }

  if (isLoading) {
    return <div className="loading">Загрузка комнат...</div>;
  }

  return (
    <div className="home">
      <div className="create-room">
        <h3>Создать новую комнату</h3>
        <input
          type="text"
          placeholder="Название комнаты"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль комнаты"
          value={newRoomPass}
          onChange={(e) => setNewRoomPass(e.target.value)}
        />
        <button onClick={createRoom}>Создать комнату</button>
      </div>
      
      <h3 className="rooms-title">Доступные комнаты</h3>
      <div className="rooms">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className='room-card'>
              <h4>{room.name}</h4>
              <input 
                value={passwords[room.id] || ''}
                onChange={(e) => setPasswords({
                  ...passwords,
                  [room.id]: e.target.value,
                })}
                placeholder='Введите пароль'
                type='password'
              />
              <button onClick={() => joinRoom(room.name, passwords[room.id])}>
                Войти
              </button>
            </div>
          ))
        ) : (
          <p className="no-rooms">Нет доступных комнат</p>
        )}
      </div>
    </div>
  );
}

export default Home;