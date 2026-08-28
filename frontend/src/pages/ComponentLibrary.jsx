import { Link } from 'react-router-dom';

const components = [
  {
    name: 'Color Contrast Checker',
    section: '/design-system',
    description: 'Check contrast ratios for text and background colors.',
  },
];

const ComponentLibrary = () => {
  return (
    <main>
      <h1>Accessible Component Library</h1>
      <p>A collection of accessible components built from scratch.</p>
      <div className="component-grid">
        {components.map((comp) => (
          <Link key={comp.name} to={comp.section} className="component-card">
            <h2>{comp.name}</h2>
            <p>{comp.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ComponentLibrary;