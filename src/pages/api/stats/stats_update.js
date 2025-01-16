import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { id } = req.query;
    const { repetitions, sets, weight_used, weight } = req.body;

    if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'Training stat ID is required' });
        }

        try {
            const { error } = await supabase
                .from('training_stats')
                .update({ repetitions, sets, weight_used, weight })
                .eq('id', id);

            if (error) throw new Error(error.message);

            res.status(200).json({ message: 'Training stat updated successfully' });
        } catch (error) {
            console.error('Error updating training stat:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
