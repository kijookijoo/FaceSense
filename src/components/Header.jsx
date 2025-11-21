import { Link } from 'react-router-dom'

function Header() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/">FaceSense</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/detector">Detector</Link>
                        </li>
                    </ul>
                    <div className="navbar-nav external-links">

                    <a
                            className="nav-link portfolio-link"
                            href="https://kijoo.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            My Portfolio
                        </a>



                        <a
                            className="nav-link github-link"
                            href="https://github.com/kijookijoo"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button id="github-button" style={{ border: 'none', background: 'none', padding: 0 }}>
                                <img className="github-image" src="./github-logo.png" alt="GitHub" style={{ width: '50px', height: '50px' }} />
                            </button>
                        </a>
                        <a
                            className="nav-link linkedin-link"
                            href="https://www.linkedin.com/in/kijooyoon/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button id="linkedin-button" style={{ border: 'none', background: 'none', padding: 0 }}>
                                <img
                                    className="linkedin-image"
                                    src="./linkedin-logo.png"
                                    alt="LinkedIn"
                                    style={{ width: '50px', height: '50px' }}
                                />
                            </button>
                        </a>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;