import axios from "./axios";

export async function receiveConnectionsWannabes() {
    const { data } = await axios.get("/connections-wannabes");
    console.log("Connections: ", data);
    if (data.success) {
        return {
            type: "RECEIVE_CONNECTIONS_WANNABES",
            connectionsWannabes: data.connectionsWannabes,
        };
    }
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post(`/add-friendship/${id}`);
    if (data.success) {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id,
        };
    }
}

export async function unfriend(id) {
    const { data } = await axios.post(`/end-friendship/${id}`);
    if (data.success) {
        return {
            type: "UNFRIEND",
            id,
        };
    }
}

export function chatMessages(msgs) {
    // console.log("Already added message history", msgs);
    return {
        type: "MESSAGE_HISTORY",
        msgs,
    };
}

export function chatMessage(msg) {
    // console.log("actions new message", msg);
    return {
        type: "NEW_MESSAGE",
        msg,
    };
}

export async function onlineUsersAct(onlineUsers) {
    console.log("data in action", onlineUsers);
    return {
        type: "ONLINE_USERS",
        users: onlineUsers,
    };
}

export function userJoinedAct(userJoined) {
    // console.log("userJoined action!");
    return {
        type: "USER_JOINED",
        user: userJoined,
    };
}

export function userLeftAct(userLeft) {
    // console.log("userLeft action!");
    return {
        type: "USER_LEFT",
        user: userLeft,
    };
}
