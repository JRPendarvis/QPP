// This script tests the backend pattern generation endpoint with user-assigned fabric roles.
// Run with: node testPatternRoleAssignments.js

const axios = require('axios');

// Example test data (replace with real base64 images for a real test)
const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';

const payload = {
  fabricImages: [dummyBase64, dummyBase64, dummyBase64],
  fabricTypes: ['solid', 'printed', 'solid'],
  skillLevel: 'intermediate',
  challengeMe: false,
  selectedPattern: 'log-cabin',
  // User-assigned roles: fabric 0 = background, 1 = primary, 2 = secondary
  roleAssignments: {
    background: { fabricIndex: 0, description: 'Blue solid' },
    primary: { fabricIndex: 1, description: 'Floral print' },
    secondary: { fabricIndex: 2, description: 'Yellow solid' },
    accent: null
  }
};

async function testPatternGeneration() {
  try {
    const response = await axios.post('http://localhost:3001/api/patterns/generate', payload, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication if required, e.g. 'Authorization': 'Bearer <token>'
      }
    });
    console.log('Response:', response.data);
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  }
}

testPatternGeneration();
