import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import OnlineUsers from "./onlineusers";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    // console.log("chatMessages", chatMessages);

    const socket = io.connect();
    const elemRef = useRef();

    let chatMsg = "";

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        console.log("new scrollTop:", elemRef.current.scrollTop);
    }, [chatMessages]);

    function Keycheck(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            chatMsg = e.target.value;
            console.log("New chat:", chatMsg);
            e.target.value = "";
            socket.emit("chatMessage", chatMsg);
        }
    }

    return (
        <>
            <h1 className="chatTitle">Agora</h1>
            <h3 className="chatTitle">
                Communicate with the whole network of creators
            </h3>
            <div id="chat-top-container">
                <div id="chat-container" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map(function (user) {
                            return (
                                <div className="chat-block" key={user.id}>
                                    <img
                                        className="chat-pic"
                                        src={user.image_url}
                                    ></img>
                                    <div className="chat-details">
                                        <h4 className="chat-time">
                                            {user.first} {user.last} at{" "}
                                            {new Date(
                                                user.sent_at
                                            ).toLocaleString()}
                                        </h4>
                                        <p className="chat-msg">
                                            {user.message}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div id="userdash">
                    <OnlineUsers />
                    <br />
                    <textarea
                        id="chat-msg-editor"
                        onKeyDown={Keycheck}
                        placeholder="Write your message here..."
                    ></textarea>
                </div>
            </div>
        </>
    );
}
