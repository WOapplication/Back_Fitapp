import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        if (!id) {
            return res.status(400).json({ error: 'Measurement ID is required' });
        }

        try {
            const { data, error } = await supabase
                .from('body_measurements')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);

            res.status(200).json({ measurement: data });
        } catch (error) {
            console.error('Error fetching measurement:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
