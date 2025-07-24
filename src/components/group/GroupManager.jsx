import React, {useState} from 'react';
import {useQuizContext} from '../../context/QuizContext.jsx';

const GroupManager = () => {
    const {state, setState} = useQuizContext();
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

    const createNewGroup = (name) => ({
        id: crypto.randomUUID(),
        name,
        subgroups: []
    })

    const handleAddGroup = () => {
        const nameExists = state.groups.some(
            (group) => group.name.toLowerCase() === groupName.trim().toLowerCase()
        )

        if (nameExists) {
            setError('Group name already exists')
            return;
        }

        if (!groupName.trim()) {
            setError('Group name cannot be empty')
            return;
        }

        const newGroup = createNewGroup(groupName);

        setState(prev => ({
            ...prev,
            groups: [...prev.groups, newGroup]
        }))

        setGroupName('');
        setError('');
    }


    return (
        <div>
            <h2>Manage Groups</h2>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleAddGroup}>
                    Add Group
                </button>
                {error && <div className="text-danger mt-1">{error}</div>}
            </div>

            <ul className="list-group">
                {state.groups.map((group) => (
                    <li key={group.id} className="list-group-item">
                        {group.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GroupManager;