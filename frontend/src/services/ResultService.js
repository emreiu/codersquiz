const API_URL = 'http://localhost:3000/api/results';

export const ResultService = {
    async getAll() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch results');
        return await response.json();
    },

    async addRun(run) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(run)
        });
        if (!response.ok) throw new Error('Failed to save result');
        return await response.json();
    }
};
