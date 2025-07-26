import React, {useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

const QuestionEditor = ({quiz, onUpdateQuiz, editQuestion, onClearEdit}) => {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editQuestion) {
            setQuestionText(editQuestion.question);
            setAnswers(editQuestion.answers || ['']);
        } else {
            setQuestionText('');
            setAnswers(['']);
        }
    }, [editQuestion]);

    const handleChangeAnswer = (index, value) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleAddAnswer = () => {
        setAnswers([...answers, '']);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedQuestion = questionText.trim();
        const trimmedAnswers = answers.map(a => a.trim()).filter(Boolean);

        if (!trimmedQuestion) return setError('Question cannot be empty');
        if (trimmedAnswers.length === 0) return setError('At least one answer required');

        const updatedQuiz = { ...quiz };

        if (editQuestion) {
            updatedQuiz.questions = quiz.questions.map(q =>
                q.id === editQuestion.id
                    ? { ...editQuestion, question: trimmedQuestion, answers: trimmedAnswers }
                    : q
            );
            onClearEdit();
        } else {
            updatedQuiz.questions.push({
                id: uuidv4(),
                question: trimmedQuestion,
                answers: trimmedAnswers
            });
        }

        onUpdateQuiz(updatedQuiz);
        setQuestionText('');
        setAnswers(['']);
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <h5>{editQuestion ? 'Edit Question' : 'Add New Question'}</h5>

            <div className="mb-3">
                <label className="form-label">Question</label>
                <input
                    type="text"
                    className="form-control"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Answers</label>
                {answers.map((answer, index) => (
                    <input
                        key={index}
                        type="text"
                        className="form-control mb-1"
                        value={answer}
                        onChange={(e) => handleChangeAnswer(index, e.target.value)}
                    />
                ))}
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary mt-1"
                    onClick={handleAddAnswer}
                >
                    Add Answer
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-success">
                {editQuestion ? 'Update Question' : 'Save Question'}
            </button>

            {editQuestion && (
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={onClearEdit}
                >
                    Cancel
                </button>
            )}
        </form>
    );
}

export default QuestionEditor;