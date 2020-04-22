import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Nav, NavItem } from "shards-react";
import util from "../../../util"

const MainFooter = ({ contained, menuItems, copyright }) => (
  <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
    <Container fluid={contained}>
      <Row>
        <Nav>
          {menuItems.map((item, idx) => (
            <NavItem key={idx}>
              <a className="nav-link" href={item.to} target="_blank" rel="noopener noreferrer">{item.title}</a>
            </NavItem>
          ))}
        </Nav>
        <span className="copyright ml-auto my-auto mr-2">{copyright}</span>
      </Row>
    </Container>
  </footer>
);

MainFooter.propTypes = {
  /**
   * Whether the content is contained, or not.
   */
  contained: PropTypes.bool,
  /**
   * The menu items array.
   */
  menuItems: PropTypes.array,
  /**
   * The copyright info.
   */
  copyright: PropTypes.string
};

MainFooter.defaultProps = {
  contained: false,
  copyright: "Copyright © 2019 Innovation Academy Inc. All rights reserved.",
  menuItems: [
    {
      title: "Innovation Academy",
      to: util.isProduction() ? "https://innovationacademy.kr" : "https://test.innovationacademy.kr"
    },
    {
      title: "42 Seoul",
      to: util.isProduction() ? "https://42seoul.kr" : "https://42seoul-test.azy.kr"
    },
    {
      title: "Swagger",
      to: "/api/swagger-ui.html"
    }
  ]
};

export default MainFooter;
