import React, { useState } from 'react';

const SubgroupList = ({ group, onUpdateGroup }) => {
    const [subgroupName, setSubgroupName] = useState('');
    const [error, setError] = useState('');

    const handleAddSubgroup = () => {
        const trimmedName = subgroupName.trim();

        if (!trimmedName) {
            setError('Subgroup name cannot be empty');
            return;
        }
        const nameExists = group.subgroups.some(
            (subgroup) => subgroup.toLowerCase() === trimmedName.toLowerCase()
        )

        if (nameExists) {
            setError('Subgroup already exists');
            return;
        }

        const updatedGroup = {
            ...group,
            subgroups: [...group.subgroups, trimmedName]
        }

        onUpdateGroup(updatedGroup);
        setSubgroupName('');
        setError('');
    }

    return (
        <div className="ms-3 mt-2">
            <h6>Subgroups</h6>

            <div className="mb-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter subgroup name"
                    value={subgroupName}
                    onChange={(e) => setSubgroupName(e.target.value)}
                    />
                <button className="btn btn-sm btn-outline-primary mt-1" onClick={handleAddSubgroup}>
                    Add Subgroup
                </button>
                {error && <div className="text-danger mt-1">{error}</div>}
            </div>

            <ul className="list-group list-group-sm">
                {group.subgroups.map((subgroup, index) => (
                    <li key={index} className="list-group-item py-1">
                        {subgroup}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SubgroupList;