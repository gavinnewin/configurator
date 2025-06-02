import { useState } from 'react';

export default function Accordion({ field, title, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(null);
  
  const handlePick = label => {
    setPicked(label);
    onSelect(field, label);
  };
  
  return (
    <div className={`accordion-item ${open ? 'active' : ''}`} data-field={field}>
      <div className="accordion-header" onClick={() => setOpen(o => !o)}>
        <span>{picked ? `${title} – ${picked}` : title}</span>
        <i className='bx bx-chevron-down'></i>
      </div>
      {open && (
        <div className="accordion-content">
          {options.map(opt => (
            <div
              key={opt.label}
              className={`color-option ${picked===opt.label ? 'selected':''}`}
              data-label={opt.label}
              style={{ backgroundColor: opt.color }}
              onClick={() => handlePick(opt.label)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
