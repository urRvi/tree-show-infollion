import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { initialTreeData } from '../data/initialData';
import { calculateTreeLayout } from '../utils/treeLayout';
import CustomNode from './CustomNode';

const TreeVisualizer = () => {
    const [treeData, setTreeData] = useState(initialTreeData);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    const onToggle = useCallback((id) => {
        const toggleRecursive = (node) => {
            if (node.id === id) {
                return { ...node, isCollapsed: !node.isCollapsed };
            }

            if (node.children) {
                return {
                    ...node,
                    children: node.children.map(toggleRecursive),
                };
            }

            return node;
        };

        setTreeData(prev => toggleRecursive(prev));
    }, []);

    const layout = useMemo(() => {
        return calculateTreeLayout(treeData);
    }, [treeData]);

    useEffect(() => {
        const nodesWithToggle = layout.nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                onToggle,
            },
        }));

        setNodes(nodesWithToggle);
        setEdges(layout.edges);
    }, [layout, onToggle, setNodes, setEdges]);

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#f9fafb' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <Background gap={12} size={1} />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default TreeVisualizer;
