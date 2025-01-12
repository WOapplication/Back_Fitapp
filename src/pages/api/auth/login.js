import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '/supabase.js'; // Импортируем настроенный клиент Supabase

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // Проверяем, существует ли пользователь с указанным email
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (userError || !user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Сравниваем введённый пароль с хэшом из базы данных
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Создаём JWT-токен (опционально)
            const token = jwt.sign(
                { id: user.id, email: user.email }, // Payload токена
                process.env.JWT_SECRET, // Секретный ключ
                { expiresIn: '2h' } // Время жизни токена
            );

            // Убираем пароль из возвращаемых данных
            const { password: _, ...userWithoutPassword } = user;

            // Возвращаем успешный ответ
            res.status(200).json({
                message: 'Login successful',
                user: userWithoutPassword,
                token, // Возвращаем токен
            });
        } catch (err) {
            console.error('Unexpected error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
