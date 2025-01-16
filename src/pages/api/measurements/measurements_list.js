import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { user_id } = req.query;

    if (req.method === 'GET') {
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const { data, error } = await supabase
                .from('body_measurements')
                .select('*')
                .eq('user_id', user_id);

            if (error) throw new Error(error.message);

            res.status(200).json({ measurements: data });
        } catch (error) {
            console.error('Error fetching measurements:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
