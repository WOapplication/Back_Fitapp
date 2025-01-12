import {supabase} from "../../../../supabase";
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password, name, inviteCode } = req.body;

        try {
            const { data: invite, error: inviteError } = await supabase
                .from('invite_codes')
                .select('*')
                .eq('code', inviteCode)
                .eq('active', true)
                .single();

            if (inviteError || !invite) {
                return res.status(400).json({ error: 'Invalid or inactive invite code' });
            }

            const { data: user, error: userError } = await supabase
                .from('users')
                .insert([{ email, password, name, invite_code: inviteCode }])
                .select('*');

            if (userError) {
                return res.status(500).json({ error: userError.message });
            }

            res.status(201).json({
                message: 'User registered successfully',
                user: user[0], // Возвращаем данные первого пользователя
            });
        } catch (err) {
            console.error('Unexpected error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
