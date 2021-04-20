import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function FriendsList({
    users,
    buttonText,
    otherButtonText,
    handleAccept,
    handleReject,
    handleRemove,
}) {
    const dispatch = useDispatch();
    const userList = users.map((user) => (
        <div className="connectionCard" key={user.id}>
            <Link className="userCard" to={"/user/" + user.id}>
                <img
                    src={user.image_url || "/randomuser.png"}
                    className="imglist"
                />
                <h3>
                    {user.first} {user.last}
                </h3>
            </Link>
            <div className="cardText">
                {otherButtonText ? (
                    <>
                        <button
                            className="save"
                            onClick={() => dispatch(handleAccept(user.id))}
                        >
                            {buttonText}
                        </button>{" "}
                        <button
                            className="save"
                            onClick={() => dispatch(handleReject(user.id))}
                        >
                            {otherButtonText}
                        </button>
                    </>
                ) : (
                    <button
                        className="save"
                        onClick={() => dispatch(handleRemove(user.id))}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    ));
    return <>{userList}</>;
}
