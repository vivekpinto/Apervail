import { useState, useEffect } from 'react';

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

function luminance({ r, g, b }) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(fg, bg) {
  const lum1 = luminance(hexToRgb(fg));
  const lum2 = luminance(hexToRgb(bg));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const ColorContrastChecker = () => {
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ratio, setRatio] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const r = contrastRatio(fgColor, bgColor);
    setRatio(r.toFixed(2));
    let message = '';
    if (r >= 7) {
      message = 'Passes AAA for normal text and AA for large text.';
    } else if (r >= 4.5) {
      message = 'Passes AA for normal text and AAA for large text.';
    } else if (r >= 3) {
      message = 'Passes only for large text (AA).';
    } else {
      message = 'Fails WCAG contrast requirements.';
    }
    setStatus(message);
  }, [fgColor, bgColor]);

  return (
    <div className="contrast-checker">
      <h3>Color Contrast Checker</h3>
      <div className="color-inputs">
        <label>
          Foreground color:
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            aria-label="Foreground color"
          />
        </label>
        <label>
          Background color:
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            aria-label="Background color"
          />
        </label>
      </div>
      <div
        className="preview"
        style={{ backgroundColor: bgColor, color: fgColor, padding: '1rem', marginTop: '1rem' }}
      >
        Sample text
      </div>
      <div className="result" aria-live="polite">
        <p>Contrast ratio: {ratio}</p>
        <p>Status: {status}</p>
      </div>
    </div>
  );
};

export default ColorContrastChecker;