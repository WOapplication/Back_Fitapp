import { supabase } from '../../../../supabase.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password) // Лучше использовать хэширование пароля
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
