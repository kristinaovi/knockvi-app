import React, { Fragment, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CustomizerContext from "../../_helper/Customizer";
import { MENUITEMS } from "./Menu";
import { Home, ShoppingCart, FileText, Users, Truck, Factory, Warehouse } from "lucide-react";

const SidebarMenuItems = ({ setMainMenu, sidebartoogle, setNavActive }) => {
  const { layout } = useContext(CustomizerContext);
  const layout1 = localStorage.getItem("sidebar_layout") || layout;

  const id = window.location.pathname.split("/").pop();
  const layoutId = id;
  const CurrentPath = window.location.pathname;

  const ICONS = {
    home: Home,
    project: ShoppingCart,
    chat: Users,
    ecommerce: FileText,
    shipping: Truck,
    production: Factory,
    inventory: Warehouse,
  };

  const { t } = useTranslation();

  const toggletNavActive = (item) => {
    if (window.innerWidth <= 991) {
      document.querySelector(".page-header").className = "page-header close_icon";
      document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon ";
    }

    MENUITEMS.forEach((a) => {
      a.Items.forEach((itm) => {
        itm.active = false;
      });
    });

    item.active = true;
    setMainMenu({ mainmenu: MENUITEMS });
  };

  return (
    <>
      {MENUITEMS.map((Item, i) => (
        <Fragment key={i}>
          <li className="sidebar-main-title">
            <div>
              <h6 className="lan-1">{t(Item.menutitle)}</h6>
            </div>
          </li>
          {Item.Items.map((menuItem, i) => {
            const IconComponent = ICONS[menuItem.icon];

            return (
              <li className="sidebar-list" key={i}>
                <Link
                  to={menuItem.path + "/" + layoutId}
                  className={`sidebar-link sidebar-title link-nav ${
                    CurrentPath.includes(menuItem.title.toLowerCase()) || menuItem.active ? "active" : ""
                  }`}
                  onClick={() => toggletNavActive(menuItem)}
                >
                  {IconComponent && <IconComponent size={18} />}
                  <span>{t(menuItem.title)}</span>
                  {menuItem.badge ? <label className={menuItem.badge}>{menuItem.badgetxt}</label> : ""}
                </Link>
              </li>
            );
          })}
        </Fragment>
      ))}
    </>
  );
};

export default SidebarMenuItems;