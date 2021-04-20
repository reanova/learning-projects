import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveConnectionsWannabes,
    acceptFriendRequest,
    unfriend,
} from "./actions";
import FriendsList from "./friendslist";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("dispatching receive action on mount");
        dispatch(receiveConnectionsWannabes());
    }, []);

    const connections = useSelector(
        (state) =>
            state.connections &&
            state.connections.filter(
                (connection) => connection.accepted === true
            )
    );
    const wannabes = useSelector(
        (state) =>
            state.connections &&
            state.connections.filter(
                (connection) => connection.accepted === false
            )
    );

    return (
        <>
            <h3 className="titleFriends">
                People who want to connect with you:
            </h3>
            {wannabes && wannabes.length > 0 ? (
                <div className="connections">
                    <FriendsList
                        users={wannabes}
                        buttonText={"Accept"}
                        otherButtonText={"Reject"}
                        handleAccept={acceptFriendRequest}
                        handleReject={unfriend}
                    />
                </div>
            ) : (
                <div className="connectionsnot">
                    <h4>It is a bit empty here</h4>
                </div>
            )}
            <h3 className="titleFriends">Your current connections:</h3>
            {connections && connections.length > 0 ? (
                <div className="connections">
                    <FriendsList
                        users={connections}
                        buttonText={"Remove"}
                        handleRemove={unfriend}
                    />
                </div>
            ) : (
                <div className="connectionsnot">
                    <h4>It is a bit empty here</h4>
                </div>
            )}
        </>
    );
}
