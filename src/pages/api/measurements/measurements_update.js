import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    const { id } = req.query;
    const { chest, arms, waist, lower_abdomen, hips, upper_leg, calf, weight } = req.body;

    if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'Measurement ID is required' });
        }

        try {
            const { error } = await supabase
                .from('body_measurements')
                .update({ chest, arms, waist, lower_abdomen, hips, upper_leg, calf, weight })
                .eq('id', id);

            if (error) throw new Error(error.message);

            res.status(200).json({ message: 'Measurement updated successfully' });
        } catch (error) {
            console.error('Error updating measurement:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
