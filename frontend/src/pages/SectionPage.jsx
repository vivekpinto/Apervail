import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import ColorContrastChecker from '../components/ColorContrastChecker';

// Temporary mapping for section info
const sectionMap = {
  'design-system': {
    label: 'Design System',
    color: '#8e44ad',
    category: 'DESIGN_SYSTEM',
    components: [<ColorContrastChecker />], // Add more components as needed
  },
  'framework-library': {
    label: 'Framework Library',
    color: '#2980b9',
    category: 'FRAMEWORK_LIBRARY',
  },
  'standards': {
    label: 'Standards & Guidelines',
    color: '#27ae60',
    category: 'STANDARDS',
  },
  'best-practices': {
    label: 'Best Practices & Usability',
    color: '#f39c12',
    category: 'BEST_PRACTICES',
  },
};

const SectionPage = ({ section }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const info = sectionMap[section] || { label: section, color: '#333', category: null };

  useEffect(() => {
    if (!info.category) return;
    fetch(`/api/resources/?category=${info.category}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch resources');
        return res.json();
      })
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [info.category]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <h1 style={{ color: info.color }}>{info.label}</h1>
      <Link to="/">← Back to Home</Link>

      {/* Component demo area */}
      <section aria-label={`${info.label} components`}>
        <h2>Components</h2>
        {/* We'll add actual components here later */}
        <p>Interactive components coming soon.</p>
      </section>

      {/* Articles / Resources */}
      <section aria-label={`${info.label} articles`}>
        <h2>Articles & Resources</h2>
        <div className="resource-list">
          {resources.length === 0 ? (
            <p>No articles yet.</p>
          ) : (
            resources.map((resource) => (
              <article key={resource.id} className="resource-card">
                <h3>{resource.title}</h3>
                <p>{resource.summary}</p>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default SectionPage;