import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { user_id, exercise_id } = req.query;

    if (req.method === 'GET') {
        if (!user_id || !exercise_id) {
            return res.status(400).json({ error: 'User ID and Exercise ID are required' });
        }

        try {
            const { data, error } = await supabase
                .from('training_stats')
                .select('start_time, repetitions, sets, weight_used, weight')
                .eq('user_id', user_id)
                .eq('exercise_id', exercise_id)
                .order('start_time', { ascending: true });

            if (error) throw new Error(error.message);

            res.status(200).json({ stats: data });
        } catch (error) {
            console.error('Error fetching training progress:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
