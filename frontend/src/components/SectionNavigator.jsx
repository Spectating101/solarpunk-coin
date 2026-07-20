import React from 'react';

export default function SectionNavigator({ label = 'On this page', items = [] }) {
  return (
    <nav className="section-navigator" aria-label={label}>
      <span>{label}</span>
      <div>
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            <strong>{item.label}</strong>
            {item.meta ? <small>{item.meta}</small> : null}
          </a>
        ))}
      </div>
    </nav>
  );
}
