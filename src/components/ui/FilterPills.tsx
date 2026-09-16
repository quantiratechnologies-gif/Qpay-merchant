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
  className?: string;
  style?: React.CSSProperties;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  tabs,
  activeId,
  onSelect,
  className = '',
  style,
}) => {
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
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: isActive
                ? '1px solid var(--accent-green, #00C853)'
                : '1px solid var(--border, #1E293B)',
              backgroundColor: isActive
                ? 'var(--accent-green, #00C853)'
                : 'var(--bg-inset, #161F30)',
              color: isActive
                ? '#000000'
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
                  color: isActive ? '#000000' : 'inherit',
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
                    ? 'rgba(0, 0, 0, 0.2)'
                    : 'var(--border, #1E293B)',
                  color: isActive ? '#000000' : 'var(--text-primary, #FFFFFF)',
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
