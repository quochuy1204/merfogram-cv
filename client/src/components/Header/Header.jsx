import React from 'react';
import { Link } from 'react-router-dom'
import './header.css'
import Menu from './components/Menu/Menu'
import Search from './components/Search/Search';
import Logo from '../../images/Logo.svg'


function Header() {
    return (
        <div className="header">
            <nav className="navbar navbar-light navbar-expand-lg justify-content-between align-middle">
                <Link className="logo" to="/" onClick={() => window.scrollTo({ top: 0 })}>
                    {/* <h4 className="navbar-brand text">Merfogram</h4> */}
                    <img src={Logo} alt="logo" style={{ objectFit: 'cover', width: '130px', height: '45px', display: 'block', top: '0' }} />
                </Link>
                <Search />
                <Menu />
            </nav>
        </div>
    );
}

export default Header;