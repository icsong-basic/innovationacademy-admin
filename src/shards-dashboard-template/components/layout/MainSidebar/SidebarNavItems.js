import React from "react";
import { Nav } from "shards-react";

import { observer } from 'mobx-react';
import { NavItem, NavLink } from "shards-react";
import routes from "../../../../routes";
import { NavLink as RouteNavLink } from "react-router-dom";

@observer
class SidebarNavItems extends React.Component {
  render() {
    return (
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {routes.filter((route => {
            return route.showInNav ?.() || false;
          })).map((item, idx) => (
            <NavItem key={idx}>
              <NavLink tag={RouteNavLink} to={item.path}>
                {item.htmlBefore && (
                  <div
                    className="d-inline-block item-icon-wrapper"
                    dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
                  />
                )}
                {item.title && <span>{item.title}</span>}
                {item.htmlAfter && (
                  <div
                    className="d-inline-block item-icon-wrapper"
                    dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
                  />
                )}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    )
  }
}

export default SidebarNavItems;
