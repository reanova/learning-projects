import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OnlineUsers() {
    const onlineUsers = useSelector((state) => state && state.onlineUsers);
    console.log("onlineUsers", onlineUsers);

    return (
        <>
            <h3>Currently Online : </h3>
            <div id="store-online-users">
                {onlineUsers &&
                    onlineUsers.map((onlineUser) => {
                        return (
                            <div key={onlineUser.id}>
                                <Link
                                    className="online-user-link"
                                    to={`/user/${onlineUser.id}`}
                                >
                                    <img
                                        className="online-pic"
                                        src={onlineUser.image_url}
                                        alt=""
                                    />
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
