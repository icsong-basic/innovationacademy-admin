import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink } from "react-router-dom";
import { NavItem, NavLink } from "shards-react";

const SidebarNavItem = ({ item }) => {
  return <NavItem>
    <NavLink tag={RouteNavLink} to={item.to}>
      {item.navIconName && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.navIconName }}
        />
      )}
      {item.title && <span>{item.title}</span>}
    </NavLink>
  </NavItem>
}


SidebarNavItem.propTypes = {
  /**
   * The item object.
   */
  item: PropTypes.object
};

export default SidebarNavItem;
