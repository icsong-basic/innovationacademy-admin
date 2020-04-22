// @flow

import React from "react";
import PageTitle from "../shards-dashboard-template/components/common/PageTitle";
import { observer } from 'mobx-react';
import LoginStatus from "../data/singleton/LoginStatus";
import type { User } from "../apiModelTypes";
import {
  Container,
  Card,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput
} from "shards-react";

const UserProfile = () => {
  const user: User = LoginStatus.user;
  return <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title="User Profile" md="12" className="ml-sm-auto mr-sm-auto" />
    </Row>
    <Row>
      <Col lg="8">
        <Card small className="mb-4">
          <ListGroup flush>
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form>
                    <Row form>
                      {/* Id */}
                      <Col md="3" className="form-group">
                        <label htmlFor="user_id">id</label>
                        <FormInput
                          id="user_id"
                          placeholder="id"
                          disabled
                          value={user.id}
                          onChange={() => { }}
                        />
                      </Col>
                    </Row>
                    <Row form>
                      {/* Email */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">Email</label>
                        <FormInput
                          type="email"
                          id="feEmail"
                          placeholder="Email Address"
                          value={user.email}
                          onChange={() => { }}
                          autoComplete="email"
                        />
                      </Col>
                    </Row>
                    {
                      /* TODO: 수정기능이 추가되면 설정
                      <Button theme="accent">Update Account</Button>
                      */
                    }
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  </Container>
};

export default observer(UserProfile);
