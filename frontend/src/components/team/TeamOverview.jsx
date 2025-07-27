import { useEffect, useState } from 'react';
import { GroupService } from '../../services/GroupService';
import { PlayerService } from '../../services/PlayerService';
import { Link } from 'react-router-dom';

const TeamOverview = () => {
    const [groups, setGroups] = useState([]);
    const [players, setPlayers] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([GroupService.getAll(), PlayerService.getAll()])
            .then(([groupData, playerData]) => {
                setGroups(groupData);
                setPlayers(playerData);
            })
            .catch(() => setError('Failed to load data'));
    }, []);

    const toggleExpand = (groupId) => {
        setExpanded(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    return (
        <div className="container mt-4">
            <h2>Teams / Groups</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {groups.map(group => {
                const groupPlayers = players.filter(p => p.groupId === group.id);
                return (
                    <div key={group.id} className="mb-3 border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">{group.name}</h5>
                            <div>
                                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => toggleExpand(group.id)}>
                                    {expanded[group.id] ? 'Less' : 'Show players'}
                                </button>
                                <Link to={`/teams/${group.id}/manage`} className="btn btn-sm btn-primary">
                                    Edit
                                </Link>
                            </div>
                        </div>

                        {expanded[group.id] && (
                            <ul className="mt-2 list-group">
                                {groupPlayers.length > 0 ? groupPlayers.map(p => (
                                    <li key={p.id} className="list-group-item">
                                        {p.name}
                                    </li>
                                )) : (
                                    <li className="list-group-item">No players yet</li>
                                )}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TeamOverview;
