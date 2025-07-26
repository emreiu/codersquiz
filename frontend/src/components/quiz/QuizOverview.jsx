import { useEffect, useState } from 'react';
import { QuizService } from '../../services/QuizService.js';
import { GroupService } from '../../services/GroupService.js';
import { Link } from 'react-router-dom';


const QuizOverview = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([QuizService.getAll(), GroupService.getAll()])
            .then(([quizzesData, groupsData]) => {
                setQuizzes(quizzesData);
                setGroups(groupsData);
            })
            .catch(() => setError('Failed to load data'));
    }, []);

    const groupedData = groups.map(group => {
        const subgroupsWithQuizzes = group.subgroups.map(subgroup => {
            const matchingQuizzes = quizzes.filter(
                quiz => quiz.groupId === group.id && quiz.subgroupName === subgroup.name
            );
            return {
                name: subgroup.name,
                quizzes: matchingQuizzes
            };
        });

        return {
            groupName: group.name,
            subgroups: subgroupsWithQuizzes
        };
    });


    return (
        <div className="container mt-4">
            <h2>Quiz Overview</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {groupedData.map((group, i) => (
                <div key={i} className="mt-4">
                    <h5>Group: {group.groupName}</h5>
                    {group.subgroups.map((sub, j) => (
                        <div key={j} className="ms-3">
                            <strong>{sub.name}</strong>
                            <ul className="list-group mb-2">
                                {sub.quizzes.map((quiz) => (
                                    <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        {quiz.title}
                                        <Link
                                            to={`/quiz/${quiz.groupId}/${quiz.subgroupName}/${quiz.id}/edit`}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            Edit
                                        </Link>
                                    </li>
                                ))}
                                {sub.quizzes.length === 0 && <li className="list-group-item">No quizzes</li>}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

};

export default QuizOverview;
