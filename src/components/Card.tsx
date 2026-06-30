import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function Card({ title, eyebrow, action, children, className = '', ...props }: CardProps) {
  return (
    <section className={`card ${className}`} {...props}>
      {(title || eyebrow || action) && (
        <div className="card-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
