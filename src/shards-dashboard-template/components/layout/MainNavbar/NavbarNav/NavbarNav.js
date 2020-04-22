import React from "react";
import { Nav } from "shards-react";

import UserActions from "./UserActions";

export default (props) => (
  <Nav navbar className="border-left flex-row" style={props.style}>
    {/* <Notifications /> */}
    <UserActions />
  </Nav>
);
