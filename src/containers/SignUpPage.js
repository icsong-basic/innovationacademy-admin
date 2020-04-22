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
import apis from '../apis';
import LoginStatus from '../data/singleton/LoginStatus';
import '../countries';
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
        passwordRepeat: '',
        waiting: false,
        errorMessage: ''
    }

    onLoginClick = async () => {
        if (!this.state.password) {
            alert('비밀번호를 입력하셔야 합니다.');
            return;
        }

        if (!this.state.email) {
            alert('이메일을 입력하셔야 합니다.');
            return;
        }

        if (this.state.password !== this.state.passwordRepeat) {
            alert('패스워드가 일치하지 않습니다.');
            return;
        }

        this.setState({ waiting: true });
        try {
            await apis.accountController.post({
                email: this.state.email,
                password: this.state.password
            });
            this.props.history.replace('/');
        } catch (error) {
            this.setState({ errorMessage: util.getErrorMessage(error), waiting: false });
        }
    }

    renderInput({ name, placeholder, stateKey, type = "text", wrapWithGroup = true, style }) {
        const formInput = <FormInput
            type={type}
            name={name}
            style={style}
            placeholder={placeholder}
            value={this.state[stateKey]}
            onChange={(e) => {
                this.setState({ [stateKey]: e.target.value });
            }}
        />;

        return wrapWithGroup ? <FormGroup>{formInput}</FormGroup> : formInput;
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
                            <Card small className="mb-4" style={util.isIe() ? { height: 510 } : undefined}>
                                <Col md="12" className="mt-3">
                                    <strong className="text-muted d-block mb-2">회원가입</strong>
                                    <Form>
                                        {this.renderInput({ name: 'email', placeholder: '이메일', stateKey: 'email' })}
                                        {this.renderInput({ name: 'password', placeholder: '비밀번호', type: "password", stateKey: 'password' })}
                                        {this.renderInput({ name: 'password-repeat', placeholder: '비밀번호 확인', type: "password", stateKey: 'passwordRepeat' })}
                                        <Button size="lg" disabled={this.state.waiting} className="mb-3 full" onClick={this.onLoginClick}>가입</Button>
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