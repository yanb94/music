import { useAuth } from "@app/auth/auth";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Drawer.scss";
import ListLegalLink from "@app/layout/listLegalLink/ListLegalLink";

export default function Drawer({drawerOpen, toggleDrawer, legals})
{
    const {auth, logout} = useAuth()

    return <>
        <div className={"drawer--background"+(drawerOpen ? " open": "")} onClick={() => toggleDrawer()}></div>
        <div className={"drawer"+(drawerOpen ? " open": "")}>
            <div className="drawer--head">
                Song
            </div>
            <div className="drawer--body">
                <div className="drawer--body--list">
                    <Link className="drawer--body--list--item" to="/" onClick={() => toggleDrawer()}>
                        Accueil
                    </Link>
                    <Link className="drawer--body--list--item" to="/catalogue" onClick={() => toggleDrawer()}>
                        Nos Chansons
                    </Link>
                    { auth.isAuth ? 
                        <>
                            <Link className="drawer--body--list--item" to="/space-member" onClick={() => toggleDrawer()}>
                                Espace Membre
                            </Link>
                            <a className="drawer--body--list--item" to="/login" onClick={() => { 
                                toggleDrawer()
                                logout()
                            }}>
                                Déconnexion
                            </a>
                        </>
                    :
                        <>
                            <Link className="drawer--body--list--item" to="/register" onClick={() => toggleDrawer()}>
                                S'inscrire
                            </Link>
                            <Link className="drawer--body--list--item" to="/login" onClick={() => toggleDrawer()}>
                                S'identifier
                            </Link>
                        </>
                    }
                    <Link className="drawer--body--list--item" to="/about" onClick={() => toggleDrawer()}>
                        A propos
                    </Link>
                    <Link className="drawer--body--list--item" to="/contact" onClick={() => toggleDrawer()}>
                        Contact
                    </Link>
                    <ListLegalLink legals={legals} classLink="drawer--body--list--item"/>
                </div>
            </div>
        </div>
    </>;
}

