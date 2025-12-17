import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronDown } from 'lucide-react';

const CustomNode = ({ data, id }) => {
    return (
        <div className="custom-node">
            <Handle type="target" position={Position.Top} className="custom-node__handle" />

            <div className="custom-node__label">{data.label}</div>

            {data.hasChildren && (
                <button
                    type="button"
                    aria-label={data.isCollapsed ? 'Expand node' : 'Collapse node'}
                    onClick={(e) => {
                        e.stopPropagation();
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
