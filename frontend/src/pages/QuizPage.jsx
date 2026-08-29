import { useState, useEffect } from 'react';


const QuizPage = () => {
  const [name, setName] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // AI generation states
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generatedQuizId, setGeneratedQuizId] = useState(null);

  // Fetch available quizzes on mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    fetch(`/api/quizzes/`)
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => setError('Failed to load quizzes'));
  };

  const handleQuizSelect = (quizId) => {
    setSelectedQuiz(quizId);
    setQuestions([]);
    setAnswers({});
    setScore(null);
    setFeedback('');
    setError(null);
    if (quizId) {
      setLoading(true);
      fetch(`/api/quizzes/${quizId}/questions/`)
        .then((res) => res.json())
        .then((data) => {
          setQuestions(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load questions');
          setLoading(false);
        });
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!selectedQuiz) {
      alert('Please select a quiz');
      return;
    }
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions');
      return;
    }

    // Create user
    let userId;
    try {
      const userRes = await fetch(`/api/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!userRes.ok) throw new Error('User creation failed');
      const userData = await userRes.json();
      userId = userData.id;
    } catch (err) {
      alert('Error creating user');
      return;
    }

    // Submit quiz
    const submission = {
      user_id: userId,
      answers: questions.map((q) => ({
        question_id: q.id,
        selected_answer: answers[q.id],
      })),
    };

    try {
      const submitRes = await fetch(`/api/quizzes/${selectedQuiz}/submit/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (!submitRes.ok) throw new Error('Submission failed');
      const scoreData = await submitRes.json();
      setScore(scoreData.score_percent);
      setFeedback(scoreData.feedback || '');
    } catch (err) {
      alert('Error submitting quiz');
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) {
      alert('Please enter a topic for the quiz');
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, num_questions: aiNumQuestions }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const quiz = await res.json();
      setGeneratedQuizId(quiz.id);
      setAiTopic('');
      await fetchQuizzes(); // Refresh quiz list
      alert(`Quiz "${quiz.title}" created successfully!`);
    } catch (err) {
      setError('AI quiz generation failed: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main>
      <h1>Take a Quiz</h1>

      {/* AI Quiz Generation */}
      <section className="ai-generator">
        <h2>Generate a New Quiz with AI</h2>
        <form onSubmit={handleGenerateQuiz}>
          <div className="form-group">
            <label htmlFor="ai-topic">Topic</label>
            <input
              id="ai-topic"
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g., ARIA, WCAG 2.2, screen readers"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ai-num">Number of Questions</label>
            <input
              id="ai-num"
              type="number"
              min="1"
              max="10"
              value={aiNumQuestions}
              onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 5)}
            />
          </div>
          <button type="submit" disabled={generating}>
            {generating ? 'Generating...' : 'Generate Quiz'}
          </button>
        </form>
        {generatedQuizId && <p>New quiz created! You can select it above.</p>}
      </section>

      {/* Quiz Selection and Taking */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quiz-select">Choose a Quiz:</label>
          <select
            id="quiz-select"
            value={selectedQuiz || ''}
            onChange={(e) => handleQuizSelect(e.target.value)}
          >
            <option value="">-- Select --</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>

        {loading && <p>Loading questions...</p>}
        {error && <p className="error">{error}</p>}

        {questions.length > 0 && (
          <div className="questions-list">
            {questions.map((q) => {
              const options = JSON.parse(q.options);
              return (
                <fieldset key={q.id} className="question">
                  <legend>{q.question_text}</legend>
                  {options.map((opt) => (
                    <label key={opt} className="option">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleAnswerChange(q.id, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </fieldset>
              );
            })}
          </div>
        )}

        <button type="submit" disabled={!selectedQuiz || questions.length === 0}>
          Submit Answers
        </button>
      </form>

      {score !== null && (
        <div className="score-result" role="status">
          <h2>Your Score: {score}%</h2>
          {feedback && <p className="ai-feedback">{feedback}</p>}
          <p>Thanks for participating! Check the leaderboard to see how you rank.</p>
        </div>
      )}
    </main>
  );
};

export default QuizPage;