export const MENUITEMS = [
  {
    menucontent: "Dashboards",
    Items: [
      {
        title: "Dashboard",
        icon: "home",
        badge: "badge badge-light-primary",
        active: false,
        path: `${process.env.PUBLIC_URL}/dashboard/default`,
        type: "link",
      },
    ],
  },

  {
    menucontent: "Ready to use Apps",
    Items: [
      {
        title: "Purchase Order",
        icon: "project",
        badge: "badge badge-light-secondary",
        active: false,
        path: `${process.env.PUBLIC_URL}/sales/purchase-order`,
        type: "link",
      },

      {
        title: "Invoice",
        icon: "ecommerce",
        badge: "badge badge-light-primary",
        active: false,
        path: `${process.env.PUBLIC_URL}/invoice`,
        type: "link",
      },

      {
        title: "Shipping Plan",
        icon: "shipping",
        badge: "badge badge-light-primary",
        active: false,
        path: `${process.env.PUBLIC_URL}/shipping-plan`,
        type: "link",
      },

      {
        title: "Production",
        icon: "production",
        badge: "badge badge-light-secondary",
        active: false,
        path: `${process.env.PUBLIC_URL}/production`,
        type: "link",
      },

      {
        title: "Inventory",
        icon: "inventory",
        badge: "badge badge-light-primary",
        active: false,
        path: `${process.env.PUBLIC_URL}/inventory`,
        type: "link",
      },

      {
        title: "User Management",
        icon: "chat",
        badge: "badge badge-light-primary",
        active: false,
        path: `${process.env.PUBLIC_URL}/user-management`,
        type: "link",
      },
    ],
  },
];
