import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'Measurement ID is required' });
        }

        try {
            const { error } = await supabase
                .from('body_measurements')
                .delete()
                .eq('id', id);

            if (error) throw new Error(error.message);

            res.status(200).json({ message: 'Measurement deleted successfully' });
        } catch (error) {
            console.error('Error deleting measurement:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
