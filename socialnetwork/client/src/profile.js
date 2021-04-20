import Bioeditor from "./bioeditor";
import ProfilePic from "./profilepic";

export default function Profile(props) {
    return (
        <div>
            <h2 id="hello">Hello {props.first}</h2>
            <div className="profile">
                <ProfilePic
                    imageUrl={props.imageUrl}
                    toggleUploader={() => props.toggleUploader()}
                    class1="bio-pic"
                    class2="large-image-pic"
                />
                <Bioeditor
                    bio={props.bio}
                    updateBioInApp={props.updateBioInApp}
                />
            </div>
        </div>
    );
}
