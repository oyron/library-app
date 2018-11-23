import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { authContext } from './adal-config';
import Books from "./components/Books";


class Page extends React.Component {
    render() {
        const user = authContext.getCachedUser();
        const isAdmin = user.profile.roles.indexOf("LibraryAdmin") !== -1;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-0 col-lg-2"/>
                    <div className="col-12 col-lg-8">

                        <div style={{float: 'right'}}>{user.profile.name}<br/><span style={{fontSize: "8px"}}>{user.userName.toLowerCase()} {isAdmin ? ("ADMIN") : null}</span></div>
                        <h1 style={{marginBottom: "5px"}}>Library</h1>
                        <Books isAdmin={isAdmin}/>
                    </div>
                    <div className="col-0 col-lg-2"/>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
