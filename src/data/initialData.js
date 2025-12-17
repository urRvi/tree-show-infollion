export const initialTreeData = {
  id: "root",
  label: "Root",
  isCollapsed: false,
  children: [
    {
      id: "A",
      label: "Node A",
      isCollapsed: false,
      children: [
        { id: "A1", label: "Node A1", children: [] },
        { id: "A2", label: "Node A2", children: [] }
      ]
    },
    {
      id: "B",
      label: "Node B",
      isCollapsed: false,
      children: [
        { 
          id: "B1", 
          label: "Node B1", 
          isCollapsed: true,
          children: [
            { id: "B1-1", label: "Node B1-1", children: [] },
            { id: "B1-2", label: "Node B1-2", children: [] }
          ] 
        },
        { id: "B2", label: "Node B2", children: [] }
      ]
    },
    {
      id: "C",
      label: "Node C",
      children: []
    }
  ]
};
