import { supabase } from '@/../supabase';
import { verifyRole } from '@/utils/verifyRole';

export default verifyRole('admin', async (req, res) => {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            // Удаляем привязки упражнений
            await supabase.from('program_exercises').delete().eq('program_id', id);

            // Удаляем саму программу
            const { error } = await supabase.from('training_programs').delete().eq('id', id);

            if (error) throw new Error(error.message);

            res.status(200).json({ message: 'Program deleted successfully' });
        } catch (error) {
            console.error('Error deleting program:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
