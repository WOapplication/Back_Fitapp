import { supabase } from '@/../supabase';
import { verifyRole } from '@/utils/verifyRole';

export default verifyRole('admin', async (req, res) => {
    if (req.method === 'POST') {
        const { name, description, duration_weeks, mandatory_workouts, optional_workouts, exercises } = req.body;

        if (!name || !duration_weeks || !Array.isArray(exercises)) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        try {
            // Создание программы
            const { data: program, error: programError } = await supabase
                .from('training_programs')
                .insert([{ name, description, duration_weeks, mandatory_workouts, optional_workouts }])
                .select('*')
                .single();

            if (programError) throw new Error(programError.message);

            // Привязка упражнений
            const programExercises = exercises.map((exercise_id) => ({
                program_id: program.id,
                exercise_id,
            }));

            const { error: exercisesError } = await supabase
                .from('program_exercises')
                .insert(programExercises);

            if (exercisesError) throw new Error(exercisesError.message);

            res.status(201).json({ message: 'Program created successfully', program });
        } catch (error) {
            console.error('Error creating program:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
