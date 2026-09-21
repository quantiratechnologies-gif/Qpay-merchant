import React from 'react';

export interface FilterTab {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
}

export interface FilterPillsProps {
  tabs: FilterTab[];
  activeId: string;
  onSelect: (id: string) => void;
  variant?: 'segmented' | 'pills';
  className?: string;
  style?: React.CSSProperties;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  tabs,
  activeId,
  onSelect,
  variant = 'segmented',
  className = '',
  style,
}) => {
  if (variant === 'segmented') {
    return (
      <div
        role="tablist"
        className={`filter-segmented-track ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card, #111726)',
          borderRadius: 'var(--radius-md, 12px)',
          padding: '4px',
          border: '1px solid var(--border, #1E293B)',
          width: '100%',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;

          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onSelect(tab.id)}
              className="interactive-tap"
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm, 8px)',
                fontSize: '12.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: isActive
                  ? '1px solid var(--border-focus, #334155)'
                  : '1px solid transparent',
                backgroundColor: isActive
                  ? 'var(--bg-inset, #161F30)'
                  : 'transparent',
                color: isActive
                  ? 'var(--text-primary, #FFFFFF)'
                  : 'var(--text-secondary, #94A3B8)',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
            >
              {isActive && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-green, #00C853)',
                    flexShrink: 0,
                  }}
                />
              )}
              {tab.icon && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isActive
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'var(--border, #1E293B)',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted, #64748B)',
                    marginLeft: '2px',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      className={`filter-pills-container ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2, 8px)',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className="filter-pill interactive-tap"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full, 9999px)',
              fontSize: '12.5px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: isActive
                ? '1px solid var(--accent-green, #00C853)'
                : '1px solid var(--border, #1E293B)',
              backgroundColor: isActive
                ? 'rgba(0, 200, 83, 0.15)'
                : 'var(--bg-inset, #161F30)',
              color: isActive
                ? 'var(--accent-green-bright, #00C853)'
                : 'var(--text-secondary, #94A3B8)',
              transition: 'all 0.15s ease',
              outline: 'none',
              flexShrink: 0,
            }}
          >
            {tab.icon && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive ? 'var(--accent-green, #00C853)' : 'inherit',
                }}
              >
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full, 9999px)',
                  backgroundColor: isActive
                    ? 'rgba(0, 200, 83, 0.25)'
                    : 'var(--border, #1E293B)',
                  color: isActive ? '#FFFFFF' : 'var(--text-primary, #FFFFFF)',
                  marginLeft: '2px',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterPills;
