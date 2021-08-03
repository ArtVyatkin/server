import {useState} from "react";

export default function Header(props) {
    const [page, updatePage] = useState("main");
    props.context.updatePage = updatePage;
    return (<nav className={"navbar header"} role={"navigation"} aria-label={"main navigation"}>
        <div className={"navbar-brand"}>
            <a className={"navbar-item header__project-link"} href={"/"}>
                <img alt={"logo"} src={"/static/apple-touch-iconp.png"}/>
                <h1 className={"header__project-name has-text-dark"}>Algebraic Bayesian Networks</h1>
            </a>

            <a href={'#'} role={"button"} className={"navbar-burger"} aria-label={"menu"} aria-expanded={"false"}
               data-target={"navbar-main"}>
                <span aria-hidden={"true"}/>
                <span aria-hidden={"true"}/>
                <span aria-hidden={"true"}/>
            </a>
        </div>
        <div id={"navbar-main"} className={"navbar-menu is-active"}>
            <div className="navbar-start">
                <a className={"navbar-item" + (page === 'main' ? ' is-page' : '')} href={"/"}>Knowledge Pattern</a>
            </div>
        </div>
        <div className={"navbar-end"}/>
    </nav>);
}