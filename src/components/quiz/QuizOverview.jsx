import React from 'react';
import { useQuizContext } from '../../context/QuizContext.jsx';
import { Link } from 'react-router-dom';

const QuizOverview = () => {
    const { state } = useQuizContext();

    const allQuizzes = [];

    for (const group of state.groups) {
        for (const subgroup of group.subgroups) {
            for (const quiz of subgroup.quizzes) {
                allQuizzes.push({
                    id: quiz.id,
                    title: quiz.title,
                    groupId: group.id,
                    groupName: group.name,
                    subgroupName: subgroup.name,
                });
            }
        }
    }

    if (allQuizzes.length === 0) {
        return <p>No quizzes available.</p>;
    }

    return (
        <div>
            <h2>All Quizzes</h2>
            <ul className="list-group">
                {allQuizzes.map((q) => (
                    <li key={q.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{q.title}</strong><br />
                            <small>{q.groupName} / {q.subgroupName}</small>
                        </div>
                        <Link
                            to={`/quiz/${q.groupId}/${q.subgroupName}/${q.id}/edit`}
                            className="btn btn-sm btn-outline-primary"
                        >
                            Edit
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizOverview;
