import { useMemo } from 'react';

export default function KeyboardPreview({ selected }) {
  const baseSrc = useMemo(() => {
    const parts = ['case','plate','switches']
      .map(k => selected[k]?.toLowerCase().replace(/\s+/g, '-'))
      .filter(Boolean);
    return `/images/${parts.join('-') || 'black'}.png`;
  }, [selected]);

  const capsSrc = useMemo(() => {
    if (!selected.case || !selected.keycaps) return null;
    return `/images/${selected.case.toLowerCase().replace(/\s+/g, '-')}-${selected.keycaps.toLowerCase().replace(/\s+/g, '-')}.png`;
  }, [selected]);

  return (
    <div className="keyboard-preview">
      <img id="keyboard-base" src={baseSrc} alt="Base preview" />
      {capsSrc && (
        <img
          id="keyboard-caps"
          src={capsSrc}
          alt="Keycaps overlay"
        />
      )}
    </div>
  );
}