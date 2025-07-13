export const MENUITEMS = [
  {
    menucontent: "Dashboards",
    Items: [
    {  
      title: "Dashboard",
      icon: "home",
      type: "sub",
      badge: "badge badge-light-primary",
      active: false,
      path: `${process.env.PUBLIC_URL}/dashboard/default`, title: "Dashboard", type: "link"
    },
,
    ],
  },

  {
    menucontent: "Ready to use Apps",
    Items: [
      {
        title: "Sales",
        icon: "project",
        type: "sub",
        badge: "badge badge-light-secondary",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/sales/purchase-order`, type: "link", title: "Purchase Order" },
          { path: `${process.env.PUBLIC_URL}/sales/Quotation/quotation`, type: "link", title: "Quotation" },
          { path: `${process.env.PUBLIC_URL}/app/project/new-project`, type: "link", title: "Sales Report" },
        ],
      },

      {
        title: "Customer Information",
        icon: "home",
        type: "sub",
        active: false,
        path: `${process.env.PUBLIC_URL}/app/project/project-list`, type: "link"
      },

      {
        title: "Shipping Plan",
        icon: "ecommerce",
        type: "sub",
        active: false,
        path: `${process.env.PUBLIC_URL}/app/project/project-list`, type: "link"
      },

      {
        title: "Test Request",
        icon: "ecommerce",
        type: "sub",
        active: false,
        path: `${process.env.PUBLIC_URL}/app/project/project-list`, type: "link"
      },

      {
        title: "Production",
        icon: "ecommerce",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/app/ecommerce/product`, type: "link", title: "NIPPO" },
          { path: `${process.env.PUBLIC_URL}/app/ecommerce/product`, type: "link", title: "Product List" },
        ],
      },
      {
        title: "Logistic",
        icon: "chat",
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/app/chat-app/chats`, type: "link", title: "Inventory" },
          { path: `${process.env.PUBLIC_URL}/app/chat-app/chat-video-app`, type: "link", title: "Shipping List" },
        ],
      },
      {
        title: "DLL",
        icon: "user",
        path: `${process.env.PUBLIC_URL}/app/users/profile`,
        type: "sub",
        bookmark: true,
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/app/users/profile`, type: "link", title: "DLL" },
          { path: `${process.env.PUBLIC_URL}/app/users/edit`, type: "link", title: "DLL" },
          { path: `${process.env.PUBLIC_URL}/app/users/cards`, type: "link", title: "DLL" },
        ],
      },
      
    ],
  },
];
