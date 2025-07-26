import { createContext, useContext, useState, useEffect } from 'react';
import { GroupService } from '../services/GroupService.js';
import { QuizService } from '../services/QuizService.js';

const QuizContext = createContext();

const initialState = {
    groups: [],
    activeQuiz: null,
    players: [],
    results: []
};

export const QuizProvider = ({ children }) => {
    const [state, setState] = useState(initialState);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([GroupService.getAll(), QuizService.getAll()])
            .then(([groups, quizzes]) => {
                setState(prev => ({ ...prev, groups, quizzes }));
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <QuizContext.Provider value={{ state, setState, loading, error }}>
            {children}
        </QuizContext.Provider>
    )
}

export const useQuizContext = () => useContext(QuizContext);