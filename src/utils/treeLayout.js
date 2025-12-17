
const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;
const X_GAP = 200; // Horizontal spacing between leaves (for TB) or levels (for LR)
const Y_GAP = 150; // Vertical spacing between levels (for TB) or siblings (for LR)

/**
 * Traverses the tree data to assign x and y positions.
 * Uses a "Leaf Counting" approach to ensure no overlap.
 * Support 'TB' (Top-Bottom) and 'LR' (Left-Right) directions.
 */
export const calculateTreeLayout = (rootData, direction = 'TB') => {
    let leafIndex = 0;
    const nodes = [];
    const edges = [];

    const isHorizontal = direction === 'LR';

    const traverse = (node, depth, parentId) => {
        // 1. Create a temporary layout object for calculation
        const isLeaf = !node.children || node.children.length === 0 || node.isCollapsed;

        let position = 0; // Primary axis position (based on siblings/leaves)

        // Process children first (Post-order) to determine parent Position
        if (!isLeaf) {
            node.children.forEach((child) => {
                traverse(child, depth + 1, node.id);
            });

            // Calculate Position based on children center
            const firstChild = nodes.find(n => n.id === node.children[0].id);
            const lastChild = nodes.find(n => n.id === node.children[node.children.length - 1].id);

            if (firstChild && lastChild) {
                if (isHorizontal) {
                    position = (firstChild.position.y + lastChild.position.y) / 2;
                } else {
                    position = (firstChild.position.x + lastChild.position.x) / 2;
                }
            }
        } else {
            // It's a visible leaf (or collapsed node acting as leaf)
            // Use leafIndex to space them out on the secondary axis
            position = leafIndex * (isHorizontal ? 100 : X_GAP); // Smaller gap for vertical stack in LR
            leafIndex++;
        }

        const levelPosition = depth * (isHorizontal ? 250 : Y_GAP); // Wider gap for levels in LR

        let x, y;
        if (isHorizontal) {
            x = levelPosition;
            y = position;
        } else {
            x = position;
            y = levelPosition;
        }

        // Add React Flow Node
        nodes.push({
            id: node.id,
            type: 'custom',
            data: {
                label: node.label,
                role: node.role,
                status: node.status,
                isCollapsed: node.isCollapsed,
                isHighlighted: node.isHighlighted,
                hasChildren: node.children && node.children.length > 0
            },
            position: { x, y },
            sourcePosition: isHorizontal ? 'right' : 'bottom',
            targetPosition: isHorizontal ? 'left' : 'top',
        });

        // Add Edge if parent exists
        if (parentId) {
            edges.push({
                id: `${parentId}-${node.id}`,
                source: parentId,
                target: node.id,
                type: 'smoothstep',
                animated: false,
            });
        }
    };

    if (rootData) {
        traverse(rootData, 0, null);
    }

    return { nodes, edges };
};
