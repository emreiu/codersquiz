import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx'

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<div>Welcome to CodersQuiz</div>} />
                <Route path="groups" element={<div>Group Management Page</div>} />
                <Route path="quiz" element={<div>Quiz Overview</div>} />
                <Route path="run" element={<div>Run Quiz</div>} />
                <Route path="results" element={<div>Results Page</div>} />
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Route>
        </Routes>
    )
}

export default AppRouter;