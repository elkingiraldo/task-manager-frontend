import React, { Component } from 'react'
import AuthenticationService from '../service/AuthenticationService';

class LoginComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: 'elkingiraldo91',
            password: 'elkinpassword',
            hasLoginFailed: false,
            showSuccessMessage: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.loginClicked = this.loginClicked.bind(this)
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]
                    : event.target.value
            }
        )
    }

    loginClicked() {
        AuthenticationService
            .executeJwtAuthenticationService(this.state.username, this.state.password)
            .then((res) => {
                AuthenticationService.registerSuccessfulLoginForJwt(this.state.username, res.data.token)
                this.props.history.push(`/v1.0/tasks`)
            }).catch(() => {
                this.setState({ showSuccessMessage: false })
                this.setState({ hasLoginFailed: true })
            })
    }

    render() {
        return (
            <div className="container">

                <div className="inline_container">
                    <div className="title_column">
                        <h1>Sign In</h1>
                    </div>
                </div>

                <div className="container">
                    {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
                    {this.state.showSuccessMessage && <div>Login Sucessful</div>}

                    <div className="form-group">
                        <label>User Name</label>
                        <input type="text" className="form-control" placeholder="Enter email" name="username" value={this.state.username} onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" onClick={this.loginClicked}>Login</button>
                    {/*<p className="forgot-password text-right">Forgot <a href="#">password?</a></p>*/}
                </div>

            </div>
        )
    }
}

export default LoginComponent