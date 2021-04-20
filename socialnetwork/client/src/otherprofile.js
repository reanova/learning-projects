import { Component } from "react";
import axios from "./axios";
import { RequestButton } from "./requestbutton";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        console.log("id: ", id);
        axios.get(`/user/${id}.json`).then(({ data }) => {
            if (data.success) {
                console.log("Successfully fetched other user data: ", data);
                const { first, last, image_url, bio, loggedUserId } = data;
                console.log("id of loggeduser", loggedUserId);
                this.setState(
                    {
                        id: id,
                        first: first,
                        last: last,
                        imageUrl: image_url || "/randomuser.png",
                        bio: bio,
                        loggedUserId: loggedUserId,
                    },
                    () => console.log("Other profile state: ", this.state)
                );
            } else {
                console.log("Error fetching user data");
            }
        });
    }

    render() {
        return (
            <div>
                <h2 id="othername">
                    {this.state.first} {this.state.last}
                </h2>
                <div className="otherprofile">
                    <div className="bio-pic">
                        <img
                            className="large-image-pic"
                            src={this.state.imageUrl}
                        />
                    </div>
                    <p id="otherbio">{this.state.bio || "Sui Generis"}</p>
                </div>
                {this.state.loggedUserId != this.state.id && (
                    <RequestButton otherUserId={this.props.match.params.id} />
                )}
            </div>
        );
    }
}
