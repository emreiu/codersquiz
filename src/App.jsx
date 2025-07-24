import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import AppRouter from './routes/AppRouter.jsx';
import {QuizProvider} from './context/QuizContext.jsx';

const App = () => {
    return (
        <QuizProvider>
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </QuizProvider>
    )
}

export default App;
