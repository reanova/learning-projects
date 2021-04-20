import { useState, useEffect } from "react";
import axios from "./axios";

export function RequestButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState("Friend Request");
    const [error, setError] = useState(false);

    useEffect(() => {
        console.log("Other user ID: ", otherUserId);
        axios.get(`/friendship-status/${otherUserId}`).then(({ data }) => {
            if (data.success) {
                console.log("Got state of friendship!");
                if (data.accepted) {
                    setButtonText("End Friendship");
                } else if (data.awaitingUserAction) {
                    setButtonText("Accept Friend Request");
                } else if (data.awaitingOtherAction) {
                    setButtonText("Cancel Friend Request");
                }
            } else {
                console.log("No current friendship status");
                setButtonText("Friend Request");
            }
        });
    }, []);

    const handleClick = () => {
        if (buttonText == "Friend Request") {
            axios
                .post(`/make-friend-request/${otherUserId}`)
                .then(({ data }) => {
                    if (data.success) {
                        setButtonText("Cancel Friend Request");
                    } else {
                        setError(true);
                    }
                });
        } else if (buttonText == "Accept Friend Request") {
            axios.post(`/add-friendship/${otherUserId}`).then(({ data }) => {
                if (data.success) {
                    setButtonText("End Friendship");
                } else {
                    setError(true);
                }
            });
        } else {
            axios.post(`/end-friendship/${otherUserId}`).then(({ data }) => {
                if (data.success) {
                    setButtonText("Friend Request");
                } else {
                    setError(true);
                }
            });
        }
    };
    return (
        <>
            <button className="requestButton" onClick={handleClick}>
                {buttonText}
            </button>
            {error && <h3 className="error">Oops, something went wrong</h3>}
        </>
    );
}
