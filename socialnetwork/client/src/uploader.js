import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        console.log("props in Uploader: ", props);
    }

    componentDidMount() {
        console.log("uploader mounted!");
    }

    handleChange(e) {
        console.log("upload file selected!");
        this.file = e.target.files[0];
    }

    uploadImage() {
        const formData = new FormData();
        formData.append("file", this.file);
        axios
            .post("/user/uploadimage", formData)
            .then((response) => {
                console.log("Image upload response data: ", response.data);
                console.log("Image: ", response.data.imageUrl);
                this.props.setProfilePic(response.data.imageUrl);
            })
            .catch((err) => {
                console.log("Error uploading image: ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div id="modal">
                <p className="close" onClick={this.props.toggleUploader}>
                    X
                </p>
                <h3>Want to upload a profile picture?</h3>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="file"
                    type="file"
                    accept="image/*"
                />
                <br />
                <button id="upload" onClick={() => this.uploadImage()}>
                    UPLOAD
                </button>
            </div>
        );
    }
}
