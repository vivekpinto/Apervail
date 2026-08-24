// frontend/src/App.jsx
import { useState, useEffect } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('Checking API...');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('API unreachable'));
  }, []);

  return (
    <div>
      <h1>A11yLearn</h1>
      <p>Backend status: {apiStatus}</p>
    </div>
  );
}

export default App;