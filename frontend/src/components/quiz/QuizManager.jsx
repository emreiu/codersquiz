import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QuizService } from '../../services/QuizService.js';
import { v4 as uuidv4 } from 'uuid';

const QuizManager = ({ groupId, subgroupName }) => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        QuizService.getAll()
            .then(all => {
                const relevant = all.filter(q => q.groupId === groupId && q.subgroupName === subgroupName);
                setQuizzes(relevant);
            })
            .catch(() => setError('Failed to load quizzes'));
    }, [groupId, subgroupName]);

    const handleAddQuiz = () => {
        const trimmedTitle = quizTitle.trim();

        if (!trimmedTitle) {
            setError('Quiz title cannot be empty');
            return;
        }

        const titleExists = quizzes.some(
            quiz => quiz.title.toLowerCase() === trimmedTitle.toLowerCase()
        )

        if (titleExists) {
            setError('Quiz title already exists');
            return;
        }

        const newQuiz = {
            id: uuidv4(),
            title: trimmedTitle,
            groupId,
            subgroupName,
            questions: []
        };

        QuizService.create(newQuiz)
            .then(saved => {
                setQuizzes(prev => [...prev, saved]);
                setQuizTitle('');
                setError('');
                console.log('Saved quiz:', saved);
            })
            .catch(() => setError('Failed to create quiz'));
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
                {quizzes.map((quiz) => (
                    <li key={quiz.id} className="list-group-item py-1 d-flex justify-content-between align-items-center">
                        {quiz.title}
                        <Link
                            to={`/quiz/${groupId}/${subgroupName}/${quiz.id}/edit`}
                            className="btn btn-sm btn-outline-secondary"
                        >
                            Edit
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default QuizManager