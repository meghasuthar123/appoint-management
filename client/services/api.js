import axios from 'axios';

const createUser = async (userData) => {
  try {
    const response = await axios.post('https://doc-appoint-server.onrender.com/api/users', userData);
    console.log('User created successfully:', response.data);
  } catch (error) {
    console.error('Error creating user:', error.response.data);
  }
};

// Usage
createUser({
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@example.com",
  password: "password123",
  specialization: "Cardiology",
  rating: 4.5,
  location: "New York",
  feedback: "Great doctor!",
  cost: "$200",
  photo: "http://example.com/photo.jpg"
});
