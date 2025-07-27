import { useState } from 'react';
import { useQuizContext } from '../../context/QuizContext';
import { ResultService } from '../../services/ResultService';
import { useNavigate } from 'react-router-dom';

const QuizRunner = () => {
    const { state, setState } = useQuizContext();
    const { activeQuiz, players } = state;
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [locked, setLocked] = useState(false);
    const [answers, setAnswers] = useState({});
    const [correctTeams, setCorrectTeams] = useState([]);

    if (!activeQuiz) return <div className="alert alert-warning">No quiz selected.</div>;

    const currentQuestion = activeQuiz.questions[currentIndex];
    const teams = [...new Set(players.map(p => p.team))];

    const handleInputChange = (team, value) => {
        setAnswers(prev => ({ ...prev, [team]: value }));
    };

    const handleLock = () => {
        const validAnswers = currentQuestion.answers.map(a => a.trim().toLowerCase());
        const correct = teams.filter(team => {
            const input = (answers[team] || '').trim().toLowerCase();
            return validAnswers.includes(input);
        });

        setCorrectTeams(correct);
        setLocked(true);
    };

    const handleNext = async () => {
        const results = players.map(p => {
            const isCorrect = correctTeams.includes(p.team);
            const prev = state.results.find(r => r.playerId === p.id);
            return {
                playerId: p.id,
                team: p.team,
                score: (prev?.score || 0) + (isCorrect ? 1 : 0)
            };
        });

        if (currentIndex < activeQuiz.questions.length - 1) {
            setState(prev => ({ ...prev, results }));
            setCurrentIndex(prev => prev + 1);
            setAnswers({});
            setCorrectTeams([]);
            setLocked(false);
        } else {
            const runData = {
                id: crypto.randomUUID(),
                quizId: activeQuiz.id,
                groupId: activeQuiz.groupId,
                subgroupName: activeQuiz.subgroupName,
                timestamp: new Date().toISOString(),
                players: results
            };

            try {
                await ResultService.addRun(runData);
                setState(prev => ({ ...prev, results }));
                navigate('/results');
            } catch (e) {
                console.error('Failed to save results');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-body">
                    <h5 className="card-title">Q{currentIndex + 1}: {currentQuestion.question}</h5>
                </div>
            </div>

            <div className="mt-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {teams.map(team => (
                    <div key={team} className="input-group mb-2">
                        <span className="input-group-text">{team}</span>
                        <input
                            type="text"
                            className="form-control"
                            disabled={locked}
                            value={answers[team] || ''}
                            onChange={e => handleInputChange(team, e.target.value)}
                        />
                    </div>
                ))}

                {!locked && (
                    <button className="btn btn-warning w-100 mt-3" onClick={handleLock}>
                        Lock Answers
                    </button>
                )}

                {locked && (
                    <>
                        <div className="card mt-4">
                            <div className="card-body">
                                <h6 className="card-title">Correct Teams</h6>
                                {correctTeams.length > 0 ? (
                                    <ul>
                                        {correctTeams.map(team => (
                                            <li key={team}>{team}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No team answered correctly.</p>
                                )}
                            </div>
                        </div>

                        <button className="btn btn-primary w-100 mt-3" onClick={handleNext}>
                            {currentIndex < activeQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizRunner;
