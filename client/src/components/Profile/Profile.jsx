import './Profile.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const serverUrl = 'http://localhost:7523';

function Profile({ user }) {
  const [userRooms, setUserRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        const response = await axios.get(`${serverUrl}/rooms`);
        const rooms = response.data.success
          .filter(room => room && room.name && room.id)
          .map(room => ({
            name: room.name.trim(),
            id: room.id.trim()
          }));
        setUserRooms(rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRooms();
  }, []);

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className='profile-container'>
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
      
      <h3>Your Rooms</h3>
      {userRooms.length > 0 ? (
        <ul className="rooms-list">
          {userRooms.map(room => (
            <li key={room.id}>{room.name}</li>
          ))}
        </ul>
      ) : (
        <p>You haven't created any rooms yet.</p>
      )}
    </div>
  );
}

export default Profile;