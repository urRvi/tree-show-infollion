export const initialTreeData = {
  id: "root",
  label: "Root System",
  isCollapsed: false,
  children: [
    {
      id: "A",
      label: "Module A",
      isCollapsed: false,
      children: [
        {
          id: "A1",
          label: "Sub-Module A1",
          children: [
            { id: "A1-1", label: "Component A1-Alpha", children: [] },
            { id: "A1-2", label: "Component A1-Beta", children: [] }
          ]
        },
        {
          id: "A2",
          label: "Sub-Module A2",
          children: [
            {
              id: "A2-1",
              label: "Deep Component",
              children: [
                {
                  id: "A2-1-1",
                  label: "Level 5 Node",
                  children: [
                    { id: "A2-1-1-1", label: "Level 6 Leaf" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "B",
      label: "Module B",
      isCollapsed: false,
      children: [
        {
          id: "B1",
          label: "Sub-Module B1",
          isCollapsed: true,
          children: [
            { id: "B1-1", label: "Worker B1-East", children: [] },
            { id: "B1-2", label: "Worker B1-West", children: [] }
          ]
        },
        { id: "B2", label: "Sub-Module B2", children: [] }
      ]
    },
    {
      id: "C",
      label: "Module C (Isolated)",
      children: []
    }
  ]
};
