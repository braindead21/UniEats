import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1>Test App - React is Working!</h1>
      <p>If you see this, React is loading correctly.</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  );
}

export default TestApp;
