
const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;
const X_GAP = 200; // Horizontal spacing between leaves
const Y_GAP = 150; // Vertical spacing between levels

/**
 * Traverses the tree data to assign x and y positions.
 * Uses a "Leaf Counting" approach to ensure no overlap.
 */
export const calculateTreeLayout = (rootData) => {
    let leafIndex = 0;
    const nodes = [];
    const edges = [];

    const traverse = (node, depth, parentId) => {
        // 1. Create a temporary layout object for calculation
        const isLeaf = !node.children || node.children.length === 0 || node.isCollapsed;

        let x = 0;

        // Process children first (Post-order) to determine parent X
        const childIds = [];
        if (!isLeaf) {
            node.children.forEach((child) => {
                childIds.push(child.id);
                traverse(child, depth + 1, node.id);
            });

            // Calculate X based on children
            const firstChild = nodes.find(n => n.id === node.children[0].id);
            const lastChild = nodes.find(n => n.id === node.children[node.children.length - 1].id);

            if (firstChild && lastChild) {
                x = (firstChild.position.x + lastChild.position.x) / 2;
            }
        } else {
            // It's a visible leaf (or collapsed node acting as leaf)
            x = leafIndex * X_GAP;
            leafIndex++;
        }

        const y = depth * Y_GAP;

        // Add React Flow Node
        nodes.push({
            id: node.id,
            type: 'custom', // We will create a custom node type
            data: {
                label: node.label,
                isCollapsed: node.isCollapsed,
                hasChildren: node.children && node.children.length > 0
            },
            position: { x, y },
            sourcePosition: 'bottom',
            targetPosition: 'top',
        });

        // Add Edge if parent exists
        if (parentId) {
            edges.push({
                id: `${parentId}-${node.id}`,
                source: parentId,
                target: node.id,
                type: 'smoothstep', // or 'bezier'
                animated: false,
            });
        }
    };

    if (rootData) {
        traverse(rootData, 0, null);
    }

    return { nodes, edges };
};
