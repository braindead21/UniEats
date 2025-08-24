// Test admin login and dashboard access
const axios = require('axios');

const baseURL = 'http://localhost:5000/api';

const testAdminLogin = async () => {
  try {
    console.log('Testing admin login...');
    
    // Login as admin
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@university.edu',
      password: 'admin123'
    });
    
    console.log('✓ Admin login successful');
    console.log('User role:', loginResponse.data.user.role);
    
    const token = loginResponse.data.token;
    
    // Test admin dashboard
    console.log('\nTesting admin dashboard...');
    const dashboardResponse = await axios.get(`${baseURL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✓ Admin dashboard access successful');
    console.log('Dashboard stats:', JSON.stringify(dashboardResponse.data.data.stats, null, 2));
    
    // Test admin users endpoint
    console.log('\nTesting admin users endpoint...');
    const usersResponse = await axios.get(`${baseURL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✓ Admin users endpoint successful');
    console.log(`Found ${usersResponse.data.count} users`);
    
    console.log('\n🎉 All admin tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    console.error('Full error:', error);
  }
};

// Only run if not imported
if (require.main === module) {
  testAdminLogin();
}

module.exports = testAdminLogin;
