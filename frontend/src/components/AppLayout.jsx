import React from 'react'
import {Link, Outlet} from 'react-router-dom'

const AppLayout = () => {
    return (
        <>
            <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
                <Link to="/" className="navbar-brand">CodersQuiz</Link>
                <div className="navbar-nav">
                    <Link to="/groups" className="nav-link">Groups</Link>
                    <Link to="/quiz" className="nav-link">Quiz</Link>
                    <Link to="/run" className="nav-link">Run</Link>
                    <Link to="/results" className="nav-link">Results</Link>
                </div>
            </nav>

            <main className="container mt-4">
                <Outlet/>
            </main>
        </>
    )
}

export default AppLayout;