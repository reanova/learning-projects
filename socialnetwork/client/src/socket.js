import {
    chatMessages,
    chatMessage,
    onlineUsersAct,
    userJoinedAct,
    userLeftAct,
} from "./actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));

        socket.on("online users", (onlineUsers) => {
            console.log("These are the connected users: ", onlineUsers);
            store.dispatch(onlineUsersAct(onlineUsers));
        });

        socket.on("adding connected user", (userJoined) => {
            console.log("this user just connected", userJoined);
            store.dispatch(userJoinedAct(userJoined));
        });

        socket.on("userLeft", (userLeft) => {
            console.log("After user is leaving: ", userLeft);
            store.dispatch(userLeftAct(userLeft));
        });
    }
};
