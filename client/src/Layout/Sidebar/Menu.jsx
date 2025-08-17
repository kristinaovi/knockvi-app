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
    ],
  },

  {
    menucontent: "Ready to use Apps",
    Items: [
      {
        title: "Purchase Order",
        icon: "project",
        type: "sub",
        badge: "badge badge-light-secondary",
        active: false,
        path: `${process.env.PUBLIC_URL}/sales/purchase-order`, type: "link", title: "Purchase Order" },

      {
        title: "Invoice",
        icon: "home",
        type: "sub",
        active: false,
        path: `${process.env.PUBLIC_URL}/invoice`, type: "link"
      },

      {
        title: "Shipping Plan",
        icon: "ecommerce",
        type: "sub",
        active: false,
        path: `${process.env.PUBLIC_URL}/shipping-plan`, type: "link"
      },

      {
        title: "Production",
        icon: "ecommerce",
        badge: "badge badge-light-secondary",
        type: "sub",
        active: false,
        path: `${process.env.PUBLIC_URL}/production`, type: "link", title: "Production"
      },

      {
        title: "Inventory",
        icon: "chat",
        type: "sub",
        active: false,
        path: `${process.env.PUBLIC_URL}/inventory`, type: "link"
      },
      
    ],
  },
];
