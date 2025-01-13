import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '/supabase.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // Проверяем, существует ли пользователь
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (userError || !user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Проверяем пароль
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Создаём JWT-токен, включая роль
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role }, // Передаём роль пользователя
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Убираем пароль из ответа
            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Login successful',
                user: userWithoutPassword,
                token,
            });
        } catch (err) {
            console.error('Unexpected error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
