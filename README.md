# React Flow Tree Visualizer

A client-side interactive tree visualizer built with [React Flow](https://reactflow.dev/) and Vite. This project implements a recursive layout algorithm to display hierarchical data with expand/collapse functionality.

## Features

- **Recursive Tree Layout**: Custom algorithm to position nodes comfortably with proper parent-child centering.
- **Interactive Nodes**: Expand and collapse subtrees to declutter the view.
- **Smooth Animations**: Layout changes are instantaneous, and React Flow handles the viewport transitions.
- **Client-Side Only**: Runs entirely in the browser with no backend dependencies.

## Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:5173](http://localhost:5173).

## Conceptual API (Optional)

Although this application runs client-side, here is a conceptual design of how the API endpoints would look if the tree state were managed by a backend.

### 1. Get Tree Data
Retrieves the full tree structure or a specific subtree.

- **Endpoint**: `GET /api/tree`
- **Response**:
  ```json
  {
    "id": "root",
    "label": "Root",
    "children": [ ... ]
  }
  ```

### 2. Toggle Node State
Updates the collapsed/expanded state of a node.

- **Endpoint**: `POST /api/tree/{nodeId}/toggle`
- **Body**:
  ```json
  { "isCollapsed": true }
  ```
- **Response**: Returns the updated subtree or the diff of changes to the graph layout.

---

## Project Structure

- `src/components/TreeVisualizer.jsx`: Main container component.
- `src/components/CustomNode.jsx`: Node UI with expand/collapse button.
- `src/utils/treeLayout.js`: Recursive layout calculation engine.
- `src/data/initialData.js`: Static mock data.
