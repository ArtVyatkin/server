import {BrowserRouter, Switch, Route} from "react-router-dom";
import Code404 from "components/codes/Code404";
import KP from "components/kp/KP";

export default function Container(props){
    return (<div className={"container main-container"}>
        <BrowserRouter>
            <Switch>
                <Route path={"/"} exact={true} render={() => {
                    props.header.updatePage("main")
                    return <KP/>
                }}/>
                <Route render={() => {
                    props.header.updatePage("unknown")
                    return <Code404/>
                }}/>
            </Switch>
        </BrowserRouter>
    </div>);
}