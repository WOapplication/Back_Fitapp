import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data: exercises, error } = await supabase
                .from('exercises')
                .select(`
          *,
          exercise_levels (
            difficulty,
            video_url,
            level_description
          )
        `);
            if (error) throw new Error(error.message);
            res.status(200).json({ exercises });
        } catch (error) {
            console.error('Error fetching exercises:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
