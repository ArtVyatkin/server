export default function Code404() {
    return <div className={'httpcode'}>
        <div className="card httpcode__card">
            <div className="card-content">
                <p className="title">
                    404
                </p>
                <p className="subtitle">
                    Not found
                </p>
            </div>
            <div className="card-footer">
                <p className="card-footer-item">
                  <span>
                    <a href="/" className={'httpcode__card__link'}>Main page</a>
                  </span>
                </p>
            </div>
        </div>
    </div>
}