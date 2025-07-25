import React from 'react';

const QuestionList = ({questions, onEdit, onDelete}) => {
    if (!questions || questions.length === 0) {
        return <div className="alert alert-secondary">No questions yet.</div>
    }

    return (
        <div className="mt-4">
            <h5>Questions</h5>
            <ul className="list-group">
                {questions.map((q, index) => (
                    <li key={q.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Q{index + 1}:</strong> {q.question}
                                <div className="mt-2 d-flex flex-wrap gap-2">
                                    {q.answers.map((a, i) => (
                                        <span key={i} className="badge bg-light text-dark border rounded px-3 py-2">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => onEdit(q)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger ms-2"
                                    onClick={() => onDelete(q.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuestionList;