import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronDown } from 'lucide-react';

const CustomNode = ({ data, id }) => {
    // Determine classes based on state
    let containerClass = "custom-node";
    if (data.isSelected) containerClass += " custom-node--selected";
    if (data.isHighlighted) containerClass += " custom-node--highlighted";

    return (
        <div
            className={containerClass}
            onClick={(e) => {
                // Select the node on click
                e.stopPropagation(); // Prevent canvas click
                data.onSelect?.(id);
            }}
        >
            <Handle type="target" position={Position.Top} className="custom-node__handle" />

            <div className="custom-node__label">{data.label}</div>

            {/* Metadata Display */}
            {data.role && (
                <div className="custom-node__metadata">
                    <div className="custom-node__role">{data.role}</div>
                </div>
            )}

            {data.hasChildren && (
                <button
                    type="button"
                    aria-label={data.isCollapsed ? 'Expand node' : 'Collapse node'}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent selection when toggling
                        data.onToggle?.(id);
                    }}
                    className="custom-node__toggle"
                >
                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${data.isCollapsed ? '' : 'rotate-180'
                            } text-gray-600`}
                    />
                </button>
            )}

            <Handle type="source" position={Position.Bottom} className="custom-node__handle" />
        </div>
    );
};

export default memo(CustomNode);
