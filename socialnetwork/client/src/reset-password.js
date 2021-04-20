import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            step: 1,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submitEmail() {
        axios
            .post("/password/reset/start", {
                email: this.state.email,
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        error: false,
                        step: 2,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error submitting email: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    submitCodeAndPassword() {
        axios
            .post("/password/reset/verify", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        error: false,
                        step: 3,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error verifying code: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        const step = this.state.step;
        return (
            <div className="reset-passwd">
                <h3>Reset Password</h3>
                {this.state.error && <p>Oops, something went wrong.</p>}
                {step == 1 && (
                    <div className="form">
                        <p>Please enter your email address</p>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            key="email"
                            required
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <br />
                        <button
                            className="submit"
                            onClick={() => this.submitEmail()}
                        >
                            Submit
                        </button>
                        <br />
                    </div>
                )}
                {step == 2 && (
                    <div className="form">
                        <p>Please enter the code you received</p>
                        <input
                            name="code"
                            type="text"
                            placeholder="Code"
                            key="code"
                            required
                            onChange={(e) => this.handleChange(e)}
                        />
                        <br />
                        <p>Please enter a new password</p>
                        <input
                            name="newPassword"
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(e) => this.handleChange(e)}
                        />
                        <br />
                        <button
                            className="submit"
                            onClick={() => this.submitCodeAndPassword()}
                        >
                            Submit
                        </button>
                        <br />
                    </div>
                )}
                {step == 3 && (
                    <div className="form">
                        <h4>Success!</h4>
                        <p>
                            You can now{" "}
                            <Link to="/login" id="loginClick">
                                LOGIN
                            </Link>{" "}
                            with your new password.
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
