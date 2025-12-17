export const initialTreeData = {
  id: "root",
  label: "Root System",
  role: "System",
  status: "active",
  isCollapsed: false,
  children: [
    {
      id: "A",
      label: "Module A",
      role: "Module",
      status: "active",
      isCollapsed: false,
      children: [
        {
          id: "A1",
          label: "Sub-Module A1",
          role: "Sub-Module",
          status: "active",
          children: [
            { id: "A1-1", label: "Component A1-Alpha", role: "Component", status: "stable", children: [] },
            { id: "A1-2", label: "Component A1-Beta", role: "Component", status: "review", children: [] }
          ]
        },
        {
          id: "A2",
          label: "Sub-Module A2",
          role: "Sub-Module",
          status: "active",
          children: [
            {
              id: "A2-1",
              label: "Deep Component",
              role: "Component",
              status: "warning",
              children: [
                {
                  id: "A2-1-1",
                  label: "Level 5 Node",
                  role: "Node",
                  status: "active",
                  children: [
                    { id: "A2-1-1-1", label: "Level 6 Leaf", role: "Leaf", status: "active" }
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
      role: "Module",
      status: "maintenance",
      isCollapsed: false,
      children: [
        {
          id: "B1",
          label: "Sub-Module B1",
          role: "Sub-Module",
          status: "locked",
          isCollapsed: true,
          children: [
            { id: "B1-1", label: "Worker B1-East", role: "Worker", status: "idle", children: [] },
            { id: "B1-2", label: "Worker B1-West", role: "Worker", status: "busy", children: [] }
          ]
        },
        { id: "B2", label: "Sub-Module B2", role: "Sub-Module", status: "active", children: [] }
      ]
    },
    {
      id: "C",
      label: "Module C (Isolated)",
      role: "Module",
      status: "offline",
      children: []
    }
  ]
};
