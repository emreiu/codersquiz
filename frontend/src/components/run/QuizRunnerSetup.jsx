import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizService } from '../../services/QuizService';
import { PlayerService } from '../../services/PlayerService';
import { useQuizContext } from '../../context/QuizContext';

const QuizRunnerSetup = () => {
    const { groupId, subgroupName, quizId } = useParams();
    const { setState } = useQuizContext();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [players, setPlayers] = useState([]);
    const [selected, setSelected] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            QuizService.getAll(),
            PlayerService.getAll()
        ])
            .then(([allQuizzes, allPlayers]) => {
                const foundQuiz = allQuizzes.find(q => q.id === quizId);
                if (!foundQuiz) {
                    setError('Quiz not found');
                    return;
                }
                setQuiz(foundQuiz);

                const groupPlayers = allPlayers.filter(p => p.groupId === groupId);
                setPlayers(groupPlayers);

                const initial = {};
                groupPlayers.forEach(p => {
                    initial[p.id] = { selected: false, team: 'Team A' };
                });
                setSelected(initial);
            })
            .catch(() => setError('Failed to load data'));
    }, [groupId, quizId]);

    const handleToggle = (id) => {
        setSelected(prev => ({
            ...prev,
            [id]: { ...prev[id], selected: !prev[id].selected }
        }));
    };

    const handleTeamChange = (id, team) => {
        setSelected(prev => ({
            ...prev,
            [id]: { ...prev[id], team }
        }));
    };

    const handleStart = () => {
        const activePlayers = players
            .filter(p => selected[p.id]?.selected)
            .map(p => ({
                ...p,
                team: selected[p.id].team
            }));

        if (activePlayers.length === 0) {
            setError('Please select at least one player');
            return;
        }

        setState(prev => ({
            ...prev,
            activeQuiz: quiz,
            players: activePlayers,
            results: []
        }));

        navigate('/run');
    };

    return (
        <div className="container mt-4">
            <h3>Start Quiz: <em>{quiz?.title}</em></h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <h5>Select participants:</h5>
            <ul className="list-group mb-3">
                {players.map(player => (
                    <li key={player.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <input
                                type="checkbox"
                                checked={selected[player.id]?.selected || false}
                                onChange={() => handleToggle(player.id)}
                                className="form-check-input me-2"
                            />
                            {player.name}
                        </div>
                        <select
                            className="form-select form-select-sm w-auto"
                            value={selected[player.id]?.team}
                            onChange={e => handleTeamChange(player.id, e.target.value)}
                        >
                            <option>Team A</option>
                            <option>Team B</option>
                            <option>Team C</option>
                        </select>
                    </li>
                ))}
                {players.length === 0 && <li className="list-group-item">No players found for this group.</li>}
            </ul>

            <button className="btn btn-success" onClick={handleStart}>
                Start Quiz
            </button>
        </div>
    );
};

export default QuizRunnerSetup;
