import React from 'react';

const QuestionList = ({questions, onEdit, onDelete}) => {
    if (!questions || questions.length === 0) {
        return <div className="alert alert-secondary">No questions yet.</div>
    }

    return (
        <div className="mt-4">
            <h5>Questions</h5>
            <ul className="list-group">
                {questions.map((question, index) => (
                    <li key={question.id} className="list-group-item">
                        <strong>Q{index + 1}:</strong> {question.question}
                        <div className="mt-2 d-flex flex-wrap gap-2">
                            {question.answers.map((answer, idx) => (
                                <span key={idx} className="badge bg-success">{answer}</span>
                            ))}
                        </div>
                        <div className="mt-2">
                            <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => onEdit(question)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => onDelete(question)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuestionList;