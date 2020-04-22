import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Alert,
    FormInput,
    FormGroup
} from "shards-react";
import LoginStatus from '../data/singleton/LoginStatus';
import { Link } from 'react-router-dom';
import util from '../util';

class LoginPage extends Component {
    componentDidMount() {
        if (LoginStatus.logined) {
            this.props.history.replace('/');
        }
    }

    state = {
        email: '',
        password: '',
        waiting: false,
        errorMessage: ''
    }

    onLoginClick = async () => {
        this.setState({ waiting: true });
        const result = await LoginStatus.login(this.state.email, this.state.password);
        if (result.success) {
            this.setState({ errorMessage: '', waiting: false });
            if (this.props.location ?.state ?.redirectionGoBack) {
                this.props.history.goBack();
            } else {
                this.props.history.replace('/');
            }
        } else {
            this.setState({ errorMessage: (result.message || '로그인에 실패했습니다.'), waiting: false });
        }
    }

    render() {
        return (
            <>
                {
                    this.state.errorMessage && <Container fluid className="px-0">
                        <Alert className="mb-0" theme="danger">
                            <i className="fa fa-exclamation-circle mx-2"></i> {this.state.errorMessage}
                        </Alert>
                    </Container>
                }
                <div style={styles.container}>
                    <Row style={styles.row}>
                        <Col md="5">
                            <Card small className="mb-4" style={util.isIe() ? { height: 250 } : undefined}>
                                <Col md="12" className="mt-3">
                                    <strong className="text-muted d-block mb-2">Login</strong>
                                    <Form>
                                        <FormGroup>
                                            <FormInput
                                                placeholder="Email"
                                                value={this.state.email}
                                                onChange={(e) => {
                                                    this.setState({ email: e.target.value });
                                                }}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <FormInput
                                                placeholder="Password"
                                                type="password"
                                                value={this.state.password}
                                                onChange={(e) => {
                                                    this.setState({ password: e.target.value });
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.keyCode === 13) {
                                                        this.onLoginClick();
                                                    }
                                                }}
                                            />
                                        </FormGroup>
                                        <Button disabled={this.state.waiting} className="mb-3 full" onClick={this.onLoginClick}>로그인</Button>
                                    </Form>
                                </Col>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    row: {
        width: '100%',
        justifyContent: 'center'
    }
};

export default LoginPage;