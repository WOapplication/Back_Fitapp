import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        if (!id) {
            return res.status(400).json({ error: 'Training stat ID is required' });
        }

        try {
            const { data, error } = await supabase
                .from('training_stats')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);

            res.status(200).json({ stat: data });
        } catch (error) {
            console.error('Error fetching training stat:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
