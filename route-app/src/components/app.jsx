import React, { Component } from 'react';
import NavBar from './navbar';
import Home from './home';
import Linux from './linux';
import Django from './django';
import Web from './web';
import WebContent from './webCoutent';
import NotFound from './NoFound';
import {Routes, Route, Navigate } from 'react-router-dom';

class App extends Component {
    state = {  } 
    render() { 
        return (
            <React.Fragment>
                <NavBar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/linux" element={<Linux />}>
                            <Route path="homework" element={<h4>homework</h4>}></Route>
                            <Route path="terminal" element={<h4>terminal</h4>}></Route>
                            <Route path="*" element={<h4>else</h4>}></Route>
                        </Route>
                        <Route path="/django" element={<Django />} />
                        <Route path="/web" element={<Web />} />
                        <Route path="/web/content" element={<WebContent />} />
                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate replace to="/404" />} />
                    </Routes>
                </div>
            </React.Fragment>
        );
    }
}
 
export default App;
