import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SectionPage from './pages/SectionPage';
import ComponentLibrary from './pages/ComponentLibrary';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SearchBar from './pages/Searchbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <header>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li><a href="/">Home</a></li>
            <li><a href="/components">Component Library</a></li>
            <li><a href="/quiz">Quiz</a></li>
            <li><a href="/leaderboard">Leaderboard</a></li>
          </ul>
        </nav>
        <SearchBar />
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/design-system" element={<SectionPage section="design-system" />} />
        <Route path="/framework-library" element={<SectionPage section="framework-library" />} />
        <Route path="/standards" element={<SectionPage section="standards" />} />
        <Route path="/best-practices" element={<SectionPage section="best-practices" />} />
        <Route path="/components" element={<ComponentLibrary />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;