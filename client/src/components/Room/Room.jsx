import './Room.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const serverUrl = 'http://localhost:7523';

function Room({ props }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${serverUrl}/room/${props.name}/messages`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [props.name]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${serverUrl}/room/${props.name}/addMessage`, {
        msg: newMessage,
        owner: user.name
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Ошибка отправки сообщения');
    }
  };

   const handleExit = (e) => {
    e.preventDefault();
    navigate('/', { replace: true });
    window.location.reload();
  };
  if (isLoading) return <div className="loading">Загрузка сообщений...</div>;

  return (
    <div className='room'>
      <h1>Чат: {props.name}</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>{message.owner}: </strong>
            <span>{message.msg}</span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Отправить</button>
        <button 
          className="exit-btn" 
          onClick={handleExit}
          type="button"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}

export default Room;