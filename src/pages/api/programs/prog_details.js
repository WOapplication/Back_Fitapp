import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const { data: program, error } = await supabase
                .from('training_programs')
                .select(`
          *,
          program_exercises (
            exercise_id
          )
        `)
                .eq('id', id)
                .single();

            if (error) return res.status(404).json({ error: 'Program not found' });
            res.status(200).json({ program });
        } catch (error) {
            console.error('Error fetching program:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
