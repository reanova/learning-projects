export default function Video() {
    return (
        <div>
            <video id="videoBG" poster="backgroundpic.jpeg" autoPlay muted loop>
                <source src="/backgroundvid.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
