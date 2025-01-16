import { verifyRole } from '@/utils/verifyRole';

const adminOnlyHandler = async (req, res) => {
    if (req.method === 'GET') {
        res.status(200).json({
            message: 'Welcome, admin!',
            user: req.user, // Данные пользователя
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default verifyRole('admin', adminOnlyHandler);
