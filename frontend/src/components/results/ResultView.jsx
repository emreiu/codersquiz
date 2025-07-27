import { useQuizContext } from '../../context/QuizContext';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ResultView = () => {
    const { state } = useQuizContext();
    const { players, results } = state;

    const data = results.map(r => {
        const player = players.find(p => p.id === r.playerId);
        return {
            name: player?.name || 'Unknown',
            team: player?.team || '?',
            score: r.score
        };
    });

    const chartData = {
        labels: data.map(d => `${d.name} (${d.team})`),
        datasets: [
            {
                label: 'Score',
                data: data.map(d => d.score),
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderRadius: 6
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        }
    };

    return (
        <div className="container mt-4">
            <h3>Final Results</h3>
            {data.length === 0 ? (
                <div className="alert alert-secondary mt-3">No results available.</div>
            ) : (
                <div className="mt-4">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
};

export default ResultView;
