import React from "react";
import "./Header.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.js";
import { Link } from "react-router-dom";
import { useAuth } from "@app/auth/auth";

function Header({toggleDrawer, closeDrawer})
{
    const {auth, logout} = useAuth();

    return <div className="cont-header">
        <header className="header">
            <div className="header--title-cont">
                <Link to="" className="header--title-cont--title">Song</Link>
                <span className="header--title-cont--drawer-button" onClick={() => toggleDrawer()}>
                    <i className="fas fa-bars"></i>
                </span>
            </div>
            <nav className="header--nav">
                <Link to="/" className="header--nav--link">
                    Accueil
                </Link>
                <Link to="/catalogue" className="header--nav--link">Nos chansons</Link>

                {
                    auth.isAuth ? 
                    <>
                        <Link to="/space-member" className="header--nav--link">Espace Membre</Link>
                        <a className="header--nav--link" onClick={() => logout()} >Déconnexion</a>
                    </>
                    : <>
                        <Link to="/register" className="header--nav--link">S'inscrire</Link>
                        <Link to="/login" className="header--nav--link">S'identifier</Link>
                    </>
                }

                <Link to="/catalogue" aria-label="Recherche" className="header--nav--link icon" onClick={() => closeDrawer()}>
                    <i className="fas fa-search"></i>
                </Link>
            </nav>
        </header>
    </div>
    ;
}

export default Header;