export default function (state = {}, action) {
    if (action.type == "RECEIVE_CONNECTIONS_WANNABES") {
        state = { ...state, connections: action.connectionsWannabes };
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            connections: state.connections.map((connection) => {
                if (connection.id === action.id) {
                    return {
                        ...connection,
                        accepted: true,
                    };
                } else {
                    return connection;
                }
            }),
        };
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            connections: state.connections.filter(
                (connection) => connection.id != action.id
            ),
        };
    }
    if (action.type === "MESSAGE_HISTORY") {
        state = {
            ...state,
            chatMessages: action.msgs,
        };
    }

    if (action.type === "NEW_MESSAGE") {
        console.log("msg details from server:", action.msg);
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.msg],
        };
    }

    if (action.type === "ONLINE_USERS") {
        console.log("online users in network:", action.users);
        state = { ...state, onlineUsers: action.users };
    }

    if (action.type === "USER_JOINED") {
        console.log("user joined to network:", action.user);
        state = { ...state, onlineUsers: [...state.onlineUsers, action.user] };
    }

    if (action.type === "USER_LEFT") {
        console.log("user left from network:", action.user);
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                (user) => user.id != action.user
            ),
        };
    }
    console.log(`state in reducer for action "${action.type}":`, state);
    return state;
}
