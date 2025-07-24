import React, {useState} from 'react';
import {useQuizContext} from '../../context/QuizContext.jsx';
import SubgroupList from './SubgroupList.jsx';

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
        const trimmedName = groupName.trim();

        if (!trimmedName) {
            setError('Group name cannot be empty');
            return;
        }

        const nameExists = state.groups.some(
            (group) => group.name.toLowerCase() === trimmedName.toLowerCase()
        )

        if (nameExists) {
            setError('Group already exists');
            return;
        }

        const newGroup = createNewGroup(trimmedName);

        setState(prev => ({
            ...prev,
            groups: [...prev.groups, newGroup]
        }))

        setGroupName('');
        setError('');
    }

    const handleUpdateGroup = (updatedGroup) => {
        setState(prev => ({
            ...prev,
            groups: prev.groups.map(group =>
            group.id === updatedGroup.id ? updatedGroup : group
            )
        }))
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
                        <div>{group.name}</div>
                        <SubgroupList group={group} onUpdateGroup={handleUpdateGroup} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GroupManager;