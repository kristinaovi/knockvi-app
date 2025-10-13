const role = localStorage.getItem("role");

const DASHBOARD_MENU = {
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
};

const APP_MENU = {
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
};

let filteredMenu = [DASHBOARD_MENU]; // always include dashboard

switch (role) {
  case "Production Staff":
    filteredMenu.push({
      ...APP_MENU,
      Items: APP_MENU.Items.filter((item) => item.title === "Production"),
    });
    break;

  case "Logistic Staff":
    filteredMenu.push({
      ...APP_MENU,
      Items: APP_MENU.Items.filter((item) => item.title === "Inventory"),
    });
    break;

  case "Admin":
  default:
    filteredMenu.push(APP_MENU);
    break;
}

export const MENUITEMS = filteredMenu;
