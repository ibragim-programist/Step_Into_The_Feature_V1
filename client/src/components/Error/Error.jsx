import './Error.css';
import { Link } from 'react-router-dom';

function Error({ message }) {
  return (
    <div className="error-container">
      <h2>Oops! Something went wrong</h2>
      <p className="error-message">{message || 'Unknown error occurred'}</p>
      <p>We're working to fix this issue.</p>
      <p>Please try again later or contact support if the problem persists.</p>
      <Link to="/" className="home-link">Return to Home</Link>
    </div>
  );
}

export default Error;