import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden ${
        hoverEffect ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  title,
  subtitle,
  action,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {title || subtitle || icon ? (
        <div className="flex items-center gap-3">
          {icon && <div className="shrink-0 text-slate-500">{icon}</div>}
          <div>
            {title && (
              typeof title === 'string' ? (
                <h3 className="text-sm font-bold text-slate-900 leading-5">{title}</h3>
              ) : (
                title
              )
            )}
            {subtitle && (
              typeof subtitle === 'string' ? (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              ) : (
                subtitle
              )
            )}
            {children}
          </div>
        </div>
      ) : (
        children
      )}
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end gap-2 ${className}`} {...props}>
    {children}
  </div>
);
