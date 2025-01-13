import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const { data: exercise, error } = await supabase
                .from('exercises')
                .select(`
          *,
          exercise_levels (
            difficulty,
            video_url,
            level_description
          )
        `)
                .eq('id', id)
                .single();

            if (error) return res.status(404).json({ error: 'Exercise not found' });

            res.status(200).json({ exercise });
        } catch (error) {
            console.error('Error fetching exercise:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
