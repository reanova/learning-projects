import { Component } from "react";
import axios from "./axios";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
        };
    }

    componentDidMount() {
        console.log("bio passed to BioEditor:", this.props.bio);
        if (this.props.bio) {
            this.setState({
                bio: this.props.bio,
            });
        } else {
            this.setState({
                edit: false,
            });
        }
    }

    handleChange(e) {
        this.setState({ draftBio: e.target.value });
    }

    addBio() {
        if (this.state.draftBio !== undefined) {
            let bioData = {
                bio: this.state.draftBio,
            };
            axios
                .post("/bio", bioData)
                .then((response) => {
                    this.props.updateBioInApp(response.data);
                    this.setState({ draftBio: undefined, edit: false });
                })
                .catch((error) => {
                    console.log("error from axios addbio: ", error);
                });
        } else {
            this.setState({ edit: false });
        }
    }

    editBio() {
        this.setState({ edit: true });
    }

    render() {
        if (this.props.bio && !this.state.edit) {
            return (
                <div className="edit-bio">
                    <p id="bioinfo">{this.props.bio}</p>
                    <button className="submit" onClick={() => this.editBio()}>
                        Edit Bio
                    </button>
                </div>
            );
        } else if (this.state.edit) {
            return (
                <div className="add-bio">
                    <textarea
                        onChange={(e) => this.handleChange(e)}
                        key="bioText"
                        name="bioText"
                        defaultValue={this.props.bio}
                    ></textarea>
                    <br />
                    <br />
                    <button className="save" onClick={() => this.addBio()}>
                        Save Bio
                    </button>
                </div>
            );
        } else {
            return (
                <div className="edit-bio">
                    <p id="mysterious" onClick={() => this.editBio()}>
                        You are quite mysterious. Wanna add some info?
                    </p>
                </div>
            );
        }
    }
}
