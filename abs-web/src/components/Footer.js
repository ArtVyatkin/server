export default function Footer(){
    return (<footer className={"footer"} >
        <div className="content is-size-6">
            <div className="">
                Created by <a className={"link"} href="https://github.com/sthfaceless">@sthfaceless</a>
            </div>
            <div className="">
                <a href={"https://github.com/sthfaceless/abs-web"}><img alt={"github"} className={"footer__github-link"} src={"/static/github-alt.png"}/></a>
            </div>

        </div>
    </footer>);
}