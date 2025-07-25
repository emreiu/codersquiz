import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useQuizContext} from '../../context/QuizContext.jsx';
import QuestionList from './QuestionList';
import QuestionEditor from './QuestionEditor';

const QuizEditor = () => {
    const {groupId, subgroupName, quizId} = useParams();
    const {state, setState} = useQuizContext();
    const [editQuestion, setEditQuestion] = useState(null);

    const group = state.groups.find(g => g.id === groupId);
    if (!group) return <div className="alert alert-danger">Group not found</div>;

    const subgroup = group.subgroups.find(sg => sg.name === subgroupName);
    if (!subgroup) return <div className="alert alert-danger">Subgroup not found</div>;

    const quiz = subgroup.quizzes.find(q => q.id === quizId);
    if (!quiz) return <div className="alert alert-danger">Quiz not found</div>;

    const handleUpdateSubgroup = (updatedSubgroup) => {
        const updatedGroup= {
            ...group,
            subgroups: group.subgroups.map(sg =>
                sg.name === updatedSubgroup.name ? updatedSubgroup : sg
            )
        };

        setState(prev => ({
            ...prev,
            groups: prev.groups.map(g =>
            g.id === group.id ? updatedGroup : g
            )
        }));

        console.log(state.groups);
    }

    const handleDeleteQuestion = (questionId) => {
        const updatedQuiz = {
            ...quiz,
            questions: quiz.questions.filter(q => q.id !== questionId)
        };

        const updatedSubgroup = {
            ...subgroup,
            quizzes: subgroup.quizzes.map(q =>
                q.id === quiz.id ? updatedQuiz : q
            )
        };

        handleUpdateSubgroup(updatedSubgroup);

        if (editQuestion && editQuestion.id === questionId) {
            setEditQuestion(null);
        }
    };


    return (
        <div>
            <h3>Edit Quiz: <em>{quiz.title}</em></h3>
            <p><strong>Group:</strong> {group.name} | <strong>Subgroup:</strong> {subgroup.name}</p>

            <div className="mt-4">
                <QuestionEditor
                    quiz={quiz}
                    subgroup={subgroup}
                    onUpdateSubgroup={handleUpdateSubgroup}
                    editQuestion={editQuestion}
                    onClearEdit={() => setEditQuestion(null)}
                />
            </div>

            <div className="mt-4">
                <QuestionList
                    questions={quiz.questions}
                    onEdit={(q) => setEditQuestion(q)}
                    onDelete={handleDeleteQuestion}
                />
            </div>

        </div>
    );
}

export default QuizEditor;