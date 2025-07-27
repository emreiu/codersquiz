import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx'
import GroupManager from "../components/group/GroupManager.jsx";
import QuizEditor from '../components/quiz/QuizEditor.jsx';
import QuizOverview from "../components/quiz/QuizOverview.jsx";
import TeamManager from "../components/team/TeamManager.jsx";
import TeamOverview from "../components/team/TeamOverview.jsx";
import QuizRunnerSetup from "../components/run/QuizRunnerSetup.jsx";
import QuizRunner from "../components/run/QuizRunner.jsx";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<div>Welcome to CodersQuiz</div>} />
                <Route path="groups" element={<GroupManager />} />
                <Route path="quiz" element={<QuizOverview />} />
                <Route path="quiz/:groupId/:subgroupName/:quizId/edit" element={<QuizEditor />} />
                <Route path="quiz/:groupId/:subgroupName/:quizId/run" element={<QuizRunnerSetup />} />
                <Route path="run" element={<QuizRunner />} />
                <Route path="teams" element={<TeamOverview />} />
                <Route path="teams/:groupId/manage" element={<TeamManager />} />
                <Route path="results" element={<div>Results Page</div>} />
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Route>
        </Routes>
    )
}

export default AppRouter;