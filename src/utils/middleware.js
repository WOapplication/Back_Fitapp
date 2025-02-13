import jwt from 'jsonwebtoken';

export function verifyToken(handler) {
    return async (req, res) => {
        const authHeader = req.headers.authorization;

        // Проверяем наличие токена
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            // Проверяем и расшифровываем токен
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Добавляем расшифрованные данные токена в запрос
            req.user = decoded;

            // Передаём управление следующему обработчику
            return handler(req, res);
        } catch (err) {
            console.error('Token verification failed:', err.message);
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
        }
    };
}
