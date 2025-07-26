import React, {useState} from 'react';
import {useQuizContext} from '../../context/QuizContext.jsx';
import SubgroupList from './SubgroupList.jsx';
import {GroupService} from '../../services/GroupService.js'

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

        GroupService.create(newGroup)
            .then(savedGroup => {
                setState(prev => ({
                    ...prev,
                    groups: [...prev.groups, savedGroup]
                }));
            })
            .catch(err => {
                console.error('Failed to create group:', err);
                setError('Failed to create group');
            })

        setGroupName('');
        setError('');
    }

    const handleUpdateGroup = (updatedGroup) => {
        GroupService.update(updatedGroup)
            .then(() => {
                setState(prev => ({
                    ...prev,
                    groups: prev.groups.map(group =>
                        group.id === updatedGroup.id ? updatedGroup : group
                    )
                }));
            })
            .catch(err => {
                console.error('Failed to update group:', err);
                setError('Failed to update group');
            });
    }

    const handleDeleteGroup = (groupId) => {
        if (!window.confirm('Are you sure you want to delete this group?')) {
            return;
        }

        GroupService.remove(groupId)
            .then(() => {
                setState(prev => ({
                    ...prev,
                    groups: prev.groups.filter(group =>
                        group.id !== groupId)
                }));
            })
            .catch(err => {
                console.error('Failed to delete group:', err);
            });
    };


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
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <div className="fw-bold">{group.name}</div>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteGroup(group.id)}
                            >
                                Delete
                            </button>
                        </div>
                        <SubgroupList group={group} onUpdateGroup={handleUpdateGroup}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GroupManager;