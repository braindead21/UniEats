// Test script to verify signup functionality
// Run this with: node test-signup.js

const fetch = require('node-fetch');

async function testSignup() {
  try {
    const userData = {
      name: "Test User",
      email: "test@college.edu",
      password: "password123",
      role: "student",
      phone: "1234567890",
      collegeId: "COLLEGE123"
    };

    console.log('Testing signup with data:', userData);

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (result.success) {
      console.log('✅ Signup successful!');
      console.log('User created:', result.user);
    } else {
      console.log('❌ Signup failed:', result.message);
      if (result.errors) {
        console.log('Validation errors:', result.errors);
      }
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testSignup();
