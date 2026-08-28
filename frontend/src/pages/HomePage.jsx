import { Link } from 'react-router-dom';

const sections = [
  { key: 'design-system', label: 'Design System', color: '#8e44ad', description: 'Design tokens, color contrast, typography, and accessible design principles.' },
  { key: 'framework-library', label: 'Framework Library', color: '#2980b9', description: 'Accessible component libraries and frameworks for building UIs.' },
  { key: 'standards', label: 'Standards & Guidelines', color: '#27ae60', description: 'WCAG, ARIA, and other official accessibility specifications.' },
  { key: 'best-practices', label: 'Best Practices & Usability', color: '#f39c12', description: 'Research, user insights, and practical accessibility tips.' },
];

const HomePage = () => {
  return (
    <main>
      <h1>A11yLearn Resource Hub</h1>
      <section aria-labelledby="sections-heading">
        <h2 id="sections-heading">Explore by Topic</h2>
        <div className="category-grid">
          {sections.map((sec) => (
            <Link
              key={sec.key}
              to={`/${sec.key}`}
              className="category-card"
              style={{ borderTopColor: sec.color }}
            >
              <h3 style={{ color: sec.color }}>{sec.label}</h3>
              <p>{sec.description}</p>
              <span className="view-all">View all →</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="quiz-heading">
        <h2 id="quiz-heading">Test Your Knowledge</h2>
        <div className="quiz-section">
          <p>Ready to check your accessibility skills?</p>
          <Link to="/quiz" className="quiz-cta">Start a Quiz</Link>
          <div className="leaderboard-preview">
            <h3>Top Performers</h3>
            <ul>
              <li>1. Alex – 95%</li>
              <li>2. Sam – 90%</li>
              <li>3. Jordan – 85%</li>
            </ul>
            <Link to="/leaderboard">View full leaderboard</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;