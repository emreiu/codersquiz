import { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [state, setState] = useState({
        groups: [],
        activeQuiz: null,
        players: [],
        results: []
    })

    return (
        <QuizContext.Provider value={{ state, setState }}>
            {children}
        </QuizContext.Provider>
    )
}

export const useQuizContext = () => useContext(QuizContext);