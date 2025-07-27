const API_URL = 'http://localhost:3000/api/players';

export const PlayerService = {
    async getAll() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch players');
        return await response.json();
    },

    async create(player) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player)
        });
        if (!response.ok) throw new Error('Failed to create player');
        return await response.json();
    },

    async update(playerId, updatedData) {
        const response = await fetch(`${API_URL}/${playerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) throw new Error('Failed to update player');
        return await response.json();
    },

    async remove(playerId) {
        const response = await fetch(`${API_URL}/${playerId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete player');
    }
};
