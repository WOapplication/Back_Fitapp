import { supabase } from '@/../supabase';
import { verifyRole } from '@/utils/verifyRole';

export default verifyRole('admin', async (req, res) => {
    if (req.method === 'POST') {
        const { name, description, levels } = req.body;

        if (!name || !levels || !Array.isArray(levels)) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        try {
            const { data: exercise, error: exerciseError } = await supabase
                .from('exercises')
                .insert([{ name, description }])
                .select('*')
                .single();

            if (exerciseError) throw new Error(exerciseError.message);

            const levelsData = levels.map((level) => ({
                exercise_id: exercise.id,
                difficulty: level.difficulty,
                video_url: level.video_url,
                level_description: level.level_description,
            }));

            const { data: levelsResponse, error: levelsError } = await supabase
                .from('exercise_levels')
                .insert(levelsData)
                .select('*');

            if (levelsError) throw new Error(levelsError.message);

            res.status(201).json({ message: 'Exercise created successfully', exercise, levels: levelsResponse });
        } catch (error) {
            console.error('Error creating exercise:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
