import React from "react";
import "./Footer.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.js";
import { Link } from "react-router-dom";
import ListLegalLink from "@app/layout/listLegalLink/ListLegalLink";

function Footer({legals})
{
    return <footer className="footer">
        <div className="footer--infos">
            <div className="footer--infos--title">
                Song
            </div>
            <div className="footer--infos--desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Vestibulum lobortis consectetur quam nec consectetur. 
            Mauris euismod velit vitae massa euismod, a feugiat tellus molestie.
            </div>
            <div className="footer--infos--links">
                <Link className="footer--infos--links--item" to="/about">
                    A propos
                </Link>
                <Link className="footer--infos--links--item" to="/contact">
                    Contact
                </Link>
                <ListLegalLink legals={legals} classLink="footer--infos--links--item"/>
            </div>
        </div>
        <div className="footer--social">
            <div className="footer--social--cont">
                <div className="footer--social--cont--title">Réseaux sociaux</div>
                <div className="footer--social--cont--links">
                    <div className="footer--social--cont--links--item">
                        <i className="fab fa-twitter"></i>
                    </div>
                    <div className="footer--social--cont--links--item">
                        <i className="fab fa-facebook-square"></i>
                    </div>
                </div>
            </div>
        </div>
    </footer>
}

export default Footer