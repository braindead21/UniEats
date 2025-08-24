// Test registration endpoint
const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('🔄 Testing student registration...');
    
    const studentData = {
      name: 'Test Student',
      email: 'test.student.new@example.com',
      password: 'password123',
      role: 'student',
      phone: '+91 9876543210',
      collegeId: 'STU2025001', // Adding collegeId
      studentInfo: {
        studentId: 'STU2025001',
        course: 'Computer Science',
        year: 3, // Changed to number
        hostelBlock: 'A',
        roomNumber: '101'
      }
    };
    
    const response = await axios.post('http://localhost:5000/api/auth/register', studentData);
    
    if (response.data.success) {
      console.log('✅ Student registration successful');
      console.log('User ID:', response.data.user.id);
      console.log('Role:', response.data.user.role);
    } else {
      console.log('❌ Registration failed:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Registration test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testRegistration();
