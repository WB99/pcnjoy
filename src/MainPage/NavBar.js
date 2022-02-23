import React, { Component } from "react"
import SearchBar from "./SearchBar";
import Landmarks from "./Landmarks";
import SavedPlace from "./SavedPlace";
import SavedRoutes from "./SavedRoutes";

import "./NavBar.css"

class NavBar extends Component {
    render() {
        return (
            <div className="SideBar">
                <div className="title">
                    <div>PCNJOY</div>    
                            
                    <div>
                        <a className="signout" href="/Login" onClick={() => { window.location.href = '/Login'; }}>
                        Sign Out
                        </a>
                    </div>
                </div>
                <hr class="solid"></hr>
                <SearchBar/>
                <hr class="rounded"></hr>
                <Landmarks/>
                <hr class="solid"></hr>
                <SavedPlace/>
                <hr class="solid"></hr>
                <SavedRoutes/>
            </div>
        )
    };
}

export default NavBar;