import React, { useState } from 'react';

const QuizManager = ({ subgroup, onUpdateSubgroup }) => {
    const [quizTitle, setQuizTitle] = useState('');
    const [error, setError] = useState('');

    const handleAddQuiz = () => {
        const trimmedTitle = quizTitle.trim();

        if (!trimmedTitle) {
            setError('Quiz title cannot be empty');
            return;
        }

        const titleExists = subgroup.quizzes?.some(
            (quiz) => quiz.title.toLowerCase() === trimmedTitle.toLowerCase()
        )

        if (titleExists) {
            setError('Quiz title already exists');
            return;
        }

        const newQuiz = {
            id: crypto.randomUUID(),
            title: trimmedTitle,
            questions: []
        }

        const updatedSubgroup = {
            ...subgroup,
            quizzes: [...(subgroup.quizzes || []), newQuiz]
        }

        onUpdateSubgroup(updatedSubgroup);
        setQuizTitle('');
        setError('');
    }

    return (
        <div className="ms-3 mt-3">
            <h6>Quizzes</h6>

            <div className="mb-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter quiz title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                />
                <button className="btn btn-sm btn-outline-success mt-1" onClick={handleAddQuiz}>
                    Add Quiz
                </button>
                {error && <div className="text-danger mt-1">{error}</div>}
            </div>

            <ul className="list-group">
                {subgroup.quizzes?.map((quiz) => (
                    <li key={quiz.id} className="list-group-item py-1">
                        {quiz.title}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default QuizManager