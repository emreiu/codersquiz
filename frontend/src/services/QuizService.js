const API_URL = 'http://localhost:3000/api/quizzes';

export const QuizService = {
    async getAll() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        return await response.json();
    },

    async create(quiz) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quiz)
        });
        if (!response.ok) throw new Error('Failed to create quiz');
        return await response.json();
    },

    async update(quizId, data) {
        const response = await fetch(`${API_URL}/${quizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update quiz');
        return await response.json();
    },

    async remove(quizId) {
        const response = await fetch(`${API_URL}/${quizId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete quiz');
    }
};
