import { supabase } from '../../../../supabase.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password, name, inviteCode } = req.body;

        // Проверяем invite code
        const { data: invite, error: inviteError } = await supabase
            .from('invite_codes')
            .select('*')
            .eq('code', inviteCode)
            .eq('active', true)
            .single();

        if (inviteError || !invite) {
            return res.status(400).json({ error: 'Invalid or inactive invite code' });
        }

        // Регистрируем пользователя
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert([{ email, password, name, invite_code: inviteCode }]);

        if (userError) {
            return res.status(500).json({ error: userError.message });
        }

        // Деактивируем invite code
        await supabase.from('invite_codes').update({ active: false }).eq('id', invite.id);

        res.status(201).json({ message: 'User registered successfully', user });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
