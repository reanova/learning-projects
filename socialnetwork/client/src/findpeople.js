import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export function FindPeople() {
    const [resultUsers, setResultUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(
        function () {
            if (searchTerm == "") {
                axios
                    .get("/getusers/most-recent")
                    .then(({ data }) => {
                        if (data.success) {
                            console.log(
                                "Received recent users:",
                                data.mostRecent
                            );
                            setResultUsers(data.mostRecent);
                        }
                    })
                    .catch((error) => {
                        "Error getting most recent:", error;
                    });
            }
        },
        [searchTerm]
    );

    useEffect(
        function () {
            if (searchTerm != "") {
                axios
                    .get(`/getusers/${searchTerm}`)
                    .then(({ data }) => {
                        setResultUsers(data.resultUsers);
                    })
                    .catch((error) => {
                        "Error fetching users", error;
                    });
            }
        },
        [searchTerm]
    );

    return (
        <>
            <div id="topcontainer">
                <h2>Find Other Creators</h2>
                <div className="findusers">
                    <label htmlFor="findusersinput">Search: </label>
                    <input
                        className="findusersinput"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Name or Last Name"
                    />
                </div>
                <br />
                {searchTerm == "" && (
                    <p className="titleResults">
                        Below are the most recent creators:
                    </p>
                )}
                {searchTerm != "" && (
                    <p className="titleResults">
                        Search results for: {searchTerm}
                    </p>
                )}
                <div className="containerresults">
                    {resultUsers &&
                        resultUsers.map((user) => {
                            return (
                                <div key={user.id} className="resultuserinfo">
                                    <Link
                                        to={`/user/${user.id}`}
                                        className="searchinfobio"
                                    >
                                        <div id="containersearch">
                                            <div className="search-pic">
                                                <img
                                                    className="searchimage"
                                                    src={
                                                        user.image_url ||
                                                        "/randomuser.png"
                                                    }
                                                />
                                            </div>
                                            <div className="searchinfobio">
                                                <h2 className="searchinfobio">
                                                    {user.first} {user.last}
                                                </h2>
                                                <strong>Member since: </strong>
                                                <p className="searchinfobio">
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleString()}
                                                </p>
                                                <strong>Bio: </strong>
                                                <p className="searchinfobio">
                                                    {user.bio || "Sui Generis"}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
