import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayerService } from '../../services/PlayerService';
import { GroupService } from '../../services/GroupService';
import { v4 as uuidv4 } from 'uuid';

const TeamManager = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [players, setPlayers] = useState([]);
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([GroupService.getAll(), PlayerService.getAll()])
            .then(([groups, allPlayers]) => {
                const g = groups.find(gr => gr.id === groupId);
                if (!g) {
                    setError('Group not found');
                    return;
                }
                setGroup(g);
                setPlayers(allPlayers.filter(p => p.groupId === groupId));
            })
            .catch(() => setError('Failed to load data'));
    }, [groupId]);

    const handleAddPlayer = async () => {
        const trimmed = newName.trim();
        if (!trimmed) return setError('Name cannot be empty');

        const newPlayer = {
            id: uuidv4(),
            name: trimmed,
            groupId
        };

        try {
            await PlayerService.create(newPlayer);
            setPlayers(prev => [...prev, newPlayer]);
            setNewName('');
            setError('');
        } catch (e) {
            setError('Failed to save player');
        }
    };

    const handleDeletePlayer = async (id) => {
        try {
            await PlayerService.remove(id);
            setPlayers(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            setError('Failed to delete player');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Manage Players – {group?.name}</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="input-group mb-3">
                <input
                    className="form-control"
                    placeholder="Enter player name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAddPlayer}>Add Player</button>
            </div>

            <ul className="list-group">
                {players.length === 0 && <li className="list-group-item">No players yet</li>}
                {players.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between">
                        {p.name}
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePlayer(p.id)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <button className="btn btn-secondary mt-3" onClick={() => navigate('/teams')}>
                Back to Teams
            </button>
        </div>
    );
};

export default TeamManager;