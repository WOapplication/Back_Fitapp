import { supabase } from '@/../supabase';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { user_id, chest, arms, waist, lower_abdomen, hips, upper_leg, calf, weight, time } = req.body;

        if (!user_id || !time) {
            return res.status(400).json({ error: 'User ID and time are required' });
        }

        try {
            const { data, error } = await supabase
                .from('body_measurements')
                .insert([{ user_id, chest, arms, waist, lower_abdomen, hips, upper_leg, calf, weight, time }])
                .select('*')
                .single();

            if (error) throw new Error(error.message);

            res.status(201).json({ message: 'Measurement added successfully', measurement: data });
        } catch (error) {
            console.error('Error creating measurement:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
