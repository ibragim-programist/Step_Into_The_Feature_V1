import './Settings.css';
import { useState } from 'react';

function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Здесь должен быть вызов API для изменения пароля
      // await axios.post(`${serverUrl}/change-password`, {
      //   userId: user.id,
      //   currentPassword,
      //   newPassword
      // });
      
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error changing password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      
      <div className="settings-section">
        <h3>Change Password</h3>
        {message && <div className="message">{message}</div>}
        
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <button 
          onClick={handlePasswordChange}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
}

export default Settings;