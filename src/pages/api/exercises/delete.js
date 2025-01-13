import { supabase } from '@/../supabase';
import { verifyRole } from '@/utils/verifyRole';

export default verifyRole('admin', async (req, res) => {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
                const { error: levelsError } = await supabase
                .from('exercise_levels')
                .delete()
                .eq('exercise_id', id);

            if (levelsError) throw new Error(`Error deleting exercise levels: ${levelsError.message}`);

            const { error: exerciseError } = await supabase
                .from('exercises')
                .delete()
                .eq('id', id);

            if (exerciseError) throw new Error(`Error deleting exercise: ${exerciseError.message}`);

            res.status(200).json({ message: 'Exercise deleted successfully' });
        } catch (error) {
            console.error('Error deleting exercise:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
