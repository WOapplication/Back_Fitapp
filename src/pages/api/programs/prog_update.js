import { supabase } from '@/../supabase';
import { verifyRole } from '@/utils/verifyRole';

export default verifyRole('admin', async (req, res) => {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const { name, description, duration_weeks, mandatory_workouts, optional_workouts, exercises } = req.body;

        try {
            // Обновление программы
            const { error: programError } = await supabase
                .from('training_programs')
                .update({ name, description, duration_weeks, mandatory_workouts, optional_workouts })
                .eq('id', id);

            if (programError) throw new Error(programError.message);

            // Удаление старых привязок
            await supabase.from('program_exercises').delete().eq('program_id', id);

            // Добавление новых упражнений
            const programExercises = exercises.map((exercise_id) => ({
                program_id: id,
                exercise_id,
            }));

            const { error: exercisesError } = await supabase
                .from('program_exercises')
                .insert(programExercises);

            if (exercisesError) throw new Error(exercisesError.message);

            res.status(200).json({ message: 'Program updated successfully' });
        } catch (error) {
            console.error('Error updating program:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
