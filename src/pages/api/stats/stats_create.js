import { supabase } from '@/../supabase';
import { verifyRole } from '@/utils/verifyRole';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { user_id, exercise_id, repetitions, sets, weight_used, weight, start_time } = req.body;

        if (!user_id || !exercise_id || !repetitions || !sets || !start_time) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        try {
            const { data, error } = await supabase
                .from('training_stats')
                .insert([{ user_id, exercise_id, repetitions, sets, weight_used, weight, start_time }])
                .select('*')
                .single();

            if (error) throw new Error(error.message);

            res.status(201).json({ message: 'Training stat added successfully', stat: data });
        } catch (error) {
            console.error('Error creating training stat:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
