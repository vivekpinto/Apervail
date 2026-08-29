import { useState, useEffect } from 'react';

const LeaderboardPage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboard/`)
      .then((res) => res.json())
      .then((data) => {
        setScores(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load leaderboard');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main>
      <h1>Leaderboard</h1>
      {scores.length === 0 ? (
        <p>No scores yet. Take a quiz to get on the board!</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Quiz</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id}>
                <td>{index + 1}</td>
                <td>{score.user_id}</td> {/* We only have ID; later we can join to get name */}
                <td>{score.quiz_id}</td>
                <td>{score.score_percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default LeaderboardPage;