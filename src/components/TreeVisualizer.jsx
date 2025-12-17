import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, Layout, Maximize } from 'lucide-react';

import { initialTreeData } from '../data/initialData';
import { calculateTreeLayout } from '../utils/treeLayout';
import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };

const TreeVisualizerContent = () => {
    const [treeData, setTreeData] = useState(initialTreeData);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [direction, setDirection] = useState('TB'); // 'TB' or 'LR'
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const { fitView } = useReactFlow();

    // Handler for selection
    const onSelect = useCallback((id) => {
        setSelectedNodeId(prev => prev === id ? null : id); // Toggle selection
    }, []);

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

    // Handle Search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setTreeData(prev => {
                const resetHighlights = (node) => ({
                    ...node,
                    isHighlighted: false,
                    children: node.children ? node.children.map(resetHighlights) : []
                });
                return resetHighlights(prev);
            });
            return;
        }

        const query = searchQuery.toLowerCase();

        setTreeData(prevData => {
            const checkMatchRecursive = (node) => {
                const isMatch = node.label.toLowerCase().includes(query);

                let hasChildMatch = false;
                let newChildren = [];

                if (node.children) {
                    newChildren = node.children.map(child => {
                        const { node: updatedChild, hasMatch } = checkMatchRecursive(child);
                        if (hasMatch) hasChildMatch = true;
                        return updatedChild;
                    });
                }

                const shouldExpand = hasChildMatch;

                return {
                    node: {
                        ...node,
                        children: newChildren,
                        isCollapsed: shouldExpand ? false : node.isCollapsed,
                        isHighlighted: isMatch
                    },
                    hasMatch: isMatch || hasChildMatch
                };
            };

            const { node: newData } = checkMatchRecursive(prevData);
            return newData;
        });

    }, [searchQuery]);

    // Layout Effect
    useEffect(() => {
        const layout = calculateTreeLayout(treeData, direction);

        const nodesWithState = layout.nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                onToggle,
                onSelect,
                isHighlighted: node.data ? node.data.isHighlighted : false,
                isSelected: node.id === selectedNodeId
            },
        }));

        setNodes(nodesWithState);
        setEdges(layout.edges);

        // Optional: Auto fit view on layout change? 
        // fitView({ duration: 800 }); // Can be jarring on minor expands
    }, [treeData, onToggle, onSelect, selectedNodeId, setNodes, setEdges, direction]);

    const toggleDirection = () => {
        setDirection(prev => prev === 'TB' ? 'LR' : 'TB');
        setTimeout(() => fitView({ duration: 800 }), 100);
    };

    // Handler for status change
    const onStatusChange = (newStatus) => {
        if (!selectedNodeId) return;

        setTreeData(prev => {
            const updateStatusRecursive = (node) => {
                if (node.id === selectedNodeId) {
                    return { ...node, status: newStatus };
                }
                if (node.children) {
                    return {
                        ...node,
                        children: node.children.map(updateStatusRecursive),
                    };
                }
                return node;
            };
            return updateStatusRecursive(prev);
        });
    };

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc', position: 'relative' }}>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    style: { stroke: '#cbd5e1', strokeWidth: 2 },
                    animated: false,
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#cbd5e1" gap={20} size={1} />

                <Panel position="top-left" className="flex flex-col gap-2">
                    <div className="bg-white p-2 rounded-lg shadow-md border border-slate-200 flex items-center gap-2 w-72">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </Panel>

                <Panel position="top-right" className="flex flex-col gap-2 items-end">
                    <div className="flex gap-2">
                        <button
                            onClick={toggleDirection}
                            className="p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                            title="Toggle Orientation"
                        >
                            <Layout size={20} className={direction === 'LR' ? 'rotate-90' : ''} />
                        </button>
                        <button
                            onClick={() => fitView({ duration: 800 })}
                            className="p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                            title="Fit View"
                        >
                            <Maximize size={20} />
                        </button>
                    </div>

                </Panel>

                <Controls showInteractive={false} className="!bg-white !border-slate-200 !shadow-md !m-4" />
                <MiniMap
                    nodeColor={n => n.data.isHighlighted ? '#6366f1' : '#e2e8f0'}
                    maskColor="rgba(241, 245, 249, 0.7)"
                    className="!bottom-4 !right-4 !m-0 !border !border-slate-200 !shadow-md !rounded-lg"
                />
            </ReactFlow>
        </div>
    );
};

const TreeVisualizer = () => (
    <ReactFlowProvider>
        <TreeVisualizerContent />
    </ReactFlowProvider>
);

export default TreeVisualizer;
