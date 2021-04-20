// pass 'props' as an argument to get access to the info being passed down from the parent (App)
// we can also use destructuring to pull up the properties inside props
export default function ProfilePic(props) {
    return (
        <div className={props.class1}>
            <img
                className={props.class2}
                src={props.imageUrl}
                onClick={props.toggleUploader}
            />
        </div>
    );
}
