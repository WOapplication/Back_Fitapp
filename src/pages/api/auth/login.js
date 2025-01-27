import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '/supabase.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (userError || !user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Создаём JWT-токен
            const expiresIn = '1h';
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn }
            );

            const currentTime = new Date();
            const expiresAt = new Date(currentTime.getTime() + 60 * 60 * 1000); // +1 час

            const { error: tokenError } = await supabase
                .from('sessions')
                .insert([
                    {
                        user_id: user.id,
                        token,
                        created_at: currentTime.toISOString(),
                        expires_at: expiresAt.toISOString(),
                    },
                ]);

            if (tokenError) {
                console.error('Error saving token to Supabase:', tokenError);
                return res.status(500).json({ error: 'Failed to save session token' });
            }

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Login successful',
                user: userWithoutPassword,
                token,
                expiresAt: expiresAt.toISOString(),
            });
        } catch (err) {
            console.error('Unexpected error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
