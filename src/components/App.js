import React, { Component } from "react";

// components
import Header from './Header.js';
import { Avatar } from './Typography.js';
import { ContactForm } from './ContactForm.js';
import Website from './Website.js';
import Footer from './Footer.js';

class App extends Component {
    render() {
        return (
            <div>
                <Header />

                <section className="content">
                    <div className="container">

                        <section id="about" className="row">
                            <article className="col-12 col-sm-8 col-lg-9 col-xl-9">
                                <p>Just returned to Australia after working in London as a front-end/React developer for an 
                                    event and hotel booking company. This and my earlier roles at boutique agencies 
                                    have given me lots of experience across the stack, but my main focus is 
                                    the front-end. I enjoy puzzling out a design into a working product and fine 
                                    tuning the user interactivity on top.</p>
                                <p>Outside of coding I'm a massive tennis fan, a wannabe baker and have hiked up 
                                    Mt. Kosciuszko twice! (which if you've done it isn't much to brag about...)</p>
                            </article>
                            <article className="col-12 col-sm-4 col-lg-3 col-xl-3">
                                <Avatar yellow src="assets/avatar.png" />
                            </article>
                        </section>

                        <section id="work" className="row">
                            <div className="col-12">
                                <h2>Experience</h2>
                            </div>

                            <article className="col-12 col-md-4">
                                <h3>Front-end</h3>
                                <ul>
                                    <li>React</li>
                                    <li>Javascript (ES6)</li>
                                    <li>HTML5</li>
                                    <li>CSS3 / Sass</li>
                                    <li>jQuery</li>
                                </ul>
                            </article>

                            <article className="col-12 col-md-4">
                                <h3>Back-end</h3>
                                <ul>
                                    <li>Node.js</li>
                                    <li>MongoDB</li>
                                    <li>PHP</li>
                                    <li>SQL</li>
                                    <li>REST API</li>
                                </ul>
                            </article>

                            <article className="col-12 col-md-4">
                                <h3>Other</h3>
                                <ul>
                                    <li>WordPress (themes &amp; plugins)</li>
                                    <li>Git / Subversion (SVN)</li>
                                    <li>Sketch / Photoshop</li>
                                    <li>Documentation &amp; User Training</li>
                                    <li>JIRA / Help Desk</li>
                                </ul>
                            </article>
                                
                            <div className="col-12">
                                <h2>Recent work</h2>
                            </div>

                            <Website classes="col-12 col-md-6" 
                                title="Editable Hotel Contracts (React)" 
                                caption="An internal React project to help the company sales team create fast and consistent 
                                    hotel booking contracts to send to clients. Each contract has a unique URL and can 
                                    be edited by the client before they sign digitally. It also needed to be printable and lock 
                                    after signing to prevent further changes. This demo is a simplified version of the full app and
                                    uses a RESTful API written in Node.js and MongoDB database."
                                src="assets/ec.png" 
                                buttons={[
                                    { url : "https://demo.benclark.dev", label: "Demo" },
                                    { url : "https://github.com/bclarkau/editable-contracts", label: "Code" }
                                ]} />

                            <Website classes="col-12 col-lg-6" 
                                title="The Buzz - online newsletter platform" 
                                caption="A fully customisable theme and suite of plugins to turn WordPress into an 
                                    online newsletter creation and distribution platform. Plugins to optionally add 
                                    category sorting, calendars and email marketing integration (using the MailChimp 
                                    and Campaign Monitor APIs) were also created. User training was provided 
                                    and extensive documentation was written to further help customers."
                                src="assets/thebuzz.jpg"
                                buttons={[
                                    { url : "https://www.thebuzz.net.au/", label : "Website" },
                                    { url : "https://demo.thebuzz.net.au/", label : "Demos" },
                                    { url : "https://www.thebuzz.net.au/docs", label : "Docs" },
                                ]} />

                            <Website classes="col-12 col-md-6 col-lg-4" 
                                title="Seeing Machines" 
                                caption="Bespoke WordPress theme with pre-styled content blocks allowing the client 
                                    to create varied content with the same template. The hero image at the top 
                                    of each content page includes a logo overlay with surrounding blur effect, 
                                    accomplished with CSS and SVG filters. On the homepage live statistics are 
                                    obtained using AJAX and then animated with the TweenMax library."
                                src="assets/seeingmachines.jpg"
                                buttons={[
                                    { url : "https://www.seeingmachines.com" }
                                ]} />

                            <Website classes="col-12 col-md-6 col-lg-4" 
                                title="Hunter Valley Grammar School" 
                                caption="This custom-built WordPress theme was coded with a focus on automatically 
                                    linking related content through categories and tags. A suite of components 
                                    were also created to allow the client to embed interactive video sets, 
                                    carousels and related content links on any page. Small hover animations 
                                    were added with CSS to some elements at the clients' request."
                                src="assets/hvgs.jpg"
                                buttons={[
                                    { url : "https://www.hvgs.nsw.edu.au" }
                                ]} />

                            <Website classes="col-12 col-md-6 col-lg-4" 
                                title="Afloat Magazine" 
                                caption="WordPress theme built from scratch using the CSS framework Tailwind. The   
                                homepage features an animated magazine layout alongside product carousels and forms 
                                that filter user-created classifieds listings. PHP and CSS was used to prefix specific 
                                headings with a maritime signal flag icon corresponding to the first letter in the string."
                                src="assets/afloat.jpg"
                                buttons={[
                                    { url : "https://www.afloat.com.au/" }
                                ]} />

                        </section>

                        <section id="contact" className="row">
                            <article className="col-12 col-md-8 col-lg-6">
                                <h2>Send me a message</h2>
                                <ContactForm />
                                <p>Or email me at <a href="mailto:ben@benclark.dev">ben@benclark.dev</a></p>
                            </article>
                        </section>

                    </div>
                </section>

                <Footer />
            </div>
        );
    }
}

export default App;