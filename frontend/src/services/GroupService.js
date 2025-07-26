const API_URL = 'http://localhost:3000/api/groups';

export const GroupService = {
    async getAll() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch groups')
        return await response.json();
    },

    async create(group) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(group)
        });
        if (!response.ok) throw new Error('Failed to create group');
        return await response.json();
    },

    async update(group) {
        const response = await fetch(`${API_URL}/${group.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(group)
        });
        if (!response.ok) throw new Error('Failed to update group');
        return await response.json();
    },

    async remove(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete group');
    }
}