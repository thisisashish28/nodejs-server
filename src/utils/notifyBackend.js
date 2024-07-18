import axios from 'axios';

const notifyBackend = async (userId, message) => {
    try {
        const { data } = await axios.post('http://localhost:8000/api/notification-received', {
            userId: userId,
            message: message
        });
        console.log(data);
        console.log('Backend notified successfully');
    } catch (error) {
        console.error('Error notifying backend:', error);
    }
};

export default notifyBackend;
