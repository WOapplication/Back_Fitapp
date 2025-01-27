import bcrypt from 'bcrypt';
import {supabase} from "../../../../supabase";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password, name, inviteCode } = req.body;

        try {
            const { data: existingUser, error: existingUserError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }

            if (existingUserError && existingUserError.code !== 'PGRST116') {
                // Если ошибка не связана с отсутствием строки (PGRST116), возвращаем её
                return res.status(500).json({ error: existingUserError.message });
            }

            const { data: invite, error: inviteError } = await supabase
                .from('invite_codes')
                .select('*')
                .eq('code', inviteCode)
                .eq('active', true)
                .single();

            if (inviteError || !invite) {
                return res.status(400).json({ error: 'Invalid or inactive invite code' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const { data: user, error: userError } = await supabase
                .from('users')
                .insert([{ email, password: hashedPassword, name, invite_code: inviteCode }])
                .select('*');

            if (userError) {
                return res.status(500).json({ error: userError.message });
            }

            await supabase
                .from('invite_codes')
                .update({ active: false, used: true })
                .eq('id', invite.id);

            const { password: _, ...userWithoutPassword } = user[0];

            res.status(201).json({
                message: 'User registered successfully',
                user: userWithoutPassword,
            });
        } catch (err) {
            console.error('Unexpected error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
