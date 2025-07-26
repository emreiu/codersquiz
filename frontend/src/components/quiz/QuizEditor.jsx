import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QuizService } from '../../services/QuizService.js';
import QuestionList from './QuestionList';
import QuestionEditor from './QuestionEditor';

const QuizEditor = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editQuestion, setEditQuestion] = useState(null);

    useEffect(() => {
        QuizService.getAll()
            .then(all => {
                const found = all.find(q => q.id === quizId);
                if (found) {
                    setQuiz(found);
                } else {
                    setError('Quiz not found');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load quiz');
                setLoading(false);
            });
    }, [quizId]);

    const updateQuiz = (updatedQuiz) => {
        QuizService.update(updatedQuiz.id, updatedQuiz)
            .then(() => setQuiz(updatedQuiz))
            .catch(() => setError('Failed to save changes'));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!quiz) return null;

    return (
        <div>
            <h3>Edit Quiz: <em>{quiz.title}</em></h3>
            <p><strong>Group:</strong> {quiz.groupId} | <strong>Subgroup:</strong> {quiz.subgroupName}</p>

            <QuestionEditor
                quiz={quiz}
                onUpdateQuiz={updateQuiz}
                editQuestion={editQuestion}
                onClearEdit={() => setEditQuestion(null)}
            />

            <QuestionList
                questions={quiz.questions}
                onEdit={question => setEditQuestion(question)}
                onDelete={deletedQuestion => {
                    const updated = {
                        ...quiz,
                        questions: quiz.questions.filter(q => q.id !== deletedQuestion.id)
                    };
                    updateQuiz(updated);
                }}
            />
        </div>
    );
};

export default QuizEditor;
