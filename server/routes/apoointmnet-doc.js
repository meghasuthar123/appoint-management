import express from 'express';
import Appointment from './appointments';

const app = express();
const port = 8080;

app.use(express.json());

// Example route for fetching doctors
app.get('/api/doctors', (req, res) => {
    const doctors = [
        { _id: '1', firstName: 'John', lastName: 'Doe', specialization: 'Cardiology' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', specialization: 'Neurology' },
    ];
    res.json(doctors);
});
export default router;
