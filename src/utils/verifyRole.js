import jwt from 'jsonwebtoken';

export function verifyRole(requiredRole, handler) {
    return async (req, res) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            // Проверяем токен
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Проверяем роль пользователя
            if (decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            }

            // Добавляем данные пользователя в запрос
            req.user = decoded;

            // Передаём управление следующему обработчику
            return handler(req, res);
        } catch (err) {
            console.error('Token verification failed:', err.message);
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
        }
    };
}
