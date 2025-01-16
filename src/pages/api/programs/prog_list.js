import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data: programs, error } = await supabase
                .from('training_programs')
                .select(`
          *,
          program_exercises (
            exercise_id
          )
        `);

            if (error) throw new Error(error.message);

            res.status(200).json({ programs });
        } catch (error) {
            console.error('Error fetching programs:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
