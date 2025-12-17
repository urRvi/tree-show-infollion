import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search } from 'lucide-react';

import { initialTreeData } from '../data/initialData';
import { calculateTreeLayout } from '../utils/treeLayout';
import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };

const TreeVisualizerContent = () => {
    const [treeData, setTreeData] = useState(initialTreeData);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { fitView } = useReactFlow();

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

    // Helper to find path to a node and expand parents
    const expandPathToNode = (currentData, targetId, path = []) => {
        if (currentData.id === targetId) return path;

        if (currentData.children) {
            for (const child of currentData.children) {
                const result = expandPathToNode(child, targetId, [...path, currentData.id]);
                if (result) return result;
            }
        }
        return null;
    };

    // Handle Search
    useEffect(() => {
        if (!searchQuery.trim()) {
            // Reset highlights only
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

        // 1. Find matches and paths to expand
        let nodesToExpand = new Set();
        let matchesFound = false;

        const findMatches = (node) => {
            const isMatch = node.label.toLowerCase().includes(query);
            if (isMatch) matchesFound = true;

            if (node.children) {
                node.children.forEach(findMatches);
            }

            if (isMatch) {
                // Find path from root to this node (inefficient but safe for small tree)
                // Or we could have done it during traversal.
                // Let's us the helper from topstate
                // Note: we need to run this against the CURRENT treeData structure
            }
        };


        // Better approach: Recursive update of treeData
        // - Mark matched nodes as highlighted
        // - If child matched, expand parent
        setTreeData(prevData => {
            let foundAny = false;

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

                // Expand if children match
                const shouldExpand = hasChildMatch;

                if (isMatch || hasChildMatch) foundAny = true;

                return {
                    node: {
                        ...node,
                        children: newChildren,
                        isCollapsed: shouldExpand ? false : node.isCollapsed, // Auto-expand
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
        const layout = calculateTreeLayout(treeData);

        // Inject handlers and highlight state
        const nodesWithState = layout.nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                onToggle,
                // Pass highlight state from treeData reference? 
                // calculateTreeLayout needs to preserve isHighlighted or we pass it down?
                // treeLayout currently rebuilds nodes. We need to pass isHighlighted in treeLayout logic or map it here.
                // easier to update treeLayout to pass strict props.
                // WAIT: calculateTreeLayout reads from 'treeData'. If we updated treeData with isHighlighted, it should be in the node object passed to traverse.
                // Let's check treeLayout.js. It reads 'node.label', 'node.isCollapsed'. It needs to read 'node.isHighlighted' too.
                isHighlighted: node.data ? node.data.isHighlighted : false // Checking how treeLayout constructs this. 
            },
        }));

        setNodes(nodesWithState);
        setEdges(layout.edges);
    }, [treeData, onToggle, setNodes, setEdges]);

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc', position: 'relative' }}>

            {/* Search Overlay */}
            <div className="absolute top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-slate-200 flex items-center gap-2 w-72">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search nodes..."
                    className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

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
                <Controls showInteractive={false} className="!bg-white !border-slate-200 !shadow-md" />
            </ReactFlow>
        </div>
    );
};

// Wrap in provider
const TreeVisualizer = () => (
    <ReactFlowProvider>
        <TreeVisualizerContent />
    </ReactFlowProvider>
);

export default TreeVisualizer;
