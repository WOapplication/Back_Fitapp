import { supabase } from '@/../supabase';
import { verifyRole } from '@/utils/verifyRole';

export default verifyRole('admin', async (req, res) => {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const { name, description, levels } = req.body;

        try {
            const { error: exerciseError } = await supabase
                .from('exercises')
                .update({ name, description })
                .eq('id', id);

            if (exerciseError) throw new Error(exerciseError.message);

            await supabase.from('exercise_levels').delete().eq('exercise_id', id);

            const levelsData = levels.map((level) => ({
                exercise_id: id,
                difficulty: level.difficulty,
                video_url: level.video_url,
                level_description: level.level_description,
            }));

            const { error: levelsError } = await supabase.from('exercise_levels').insert(levelsData);

            if (levelsError) throw new Error(levelsError.message);

            res.status(200).json({ message: 'Exercise updated successfully' });
        } catch (error) {
            console.error('Error updating exercise:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
