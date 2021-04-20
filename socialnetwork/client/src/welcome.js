import Registration from "./registration";
import Logo2 from "./logo2";
import Footer from "./footer";
import Video from "./bgvideo";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./reset-password";

export default function Welcome() {
    return (
        <div id="welcomeMain">
            <Video />
            <Logo2 />
            <h3>A network of creators blending music and colors</h3>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route
                        path="/password/reset/start"
                        component={ResetPassword}
                    />
                </div>
            </HashRouter>
            <Footer />
        </div>
    );
}
