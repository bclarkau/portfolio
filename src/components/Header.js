import React, { Component } from "react";

import { Button } from './Typography.js';

class Navigation extends Component {
    render() {
        return (
            <nav className="navigation">
                <ul className="menu">
                    <li><Button href="#about" text="About"/></li>
                    <li><Button href="#work" text="Work"/></li>
                    <li><Button href="#contact" text="Contact"/></li>
                </ul>
            </nav>
        );
    }
}

class Header extends Component {
    render() {
        return (
            <header id="header">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col">
                            <a href="/" className="button title">
                                <h1>benclark.dev</h1>
                            </a>
                            <p className="intro">Hello! My name's Ben and I'm a web developer based in Sydney.</p>
                            <Navigation />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;