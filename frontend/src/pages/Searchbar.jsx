import { useState, useEffect, useRef } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delay = setTimeout(() => {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setIsOpen(true);
          setActiveIndex(-1);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setIsOpen(false);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    window.open(result.link, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="search-bar" ref={containerRef}>
      <input
        type="search"
        placeholder="Search resources, quizzes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="search-results"
        aria-autocomplete="list"
        aria-label="Search the site"
      />
      {loading && <span className="search-loading">...</span>}
      {isOpen && results.length > 0 && (
        <ul id="search-results" className="search-results" role="listbox">
          {results.map((result, index) => (
            <li
              key={`${result.type}-${result.id}`}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'active' : ''}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(result)}
            >
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}
                onClick={(e) => e.preventDefault()} // prevent default navigation; we handle with window.open
              >
                <span className={`result-type ${result.type}`}>
                  {result.type === 'resource' ? '📄' : '📝'}
                </span>
                <span className="result-content">
                  <strong>{result.title}</strong>
                  <small>{result.description}</small>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;