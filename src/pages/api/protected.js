import { verifyToken } from '@/utils/middleware';

const protectedHandler = async (req, res) => {
    if (req.method === 'GET') {
        // Доступен расшифрованный токен
        console.log('Decoded user data:', req.user);

        res.status(200).json({
            message: 'This is a protected route',
            user: req.user,
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default verifyToken(protectedHandler);
