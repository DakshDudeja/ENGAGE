import React from 'react'; 
import "./header.css";

function Header() {
    return (
        <div className = 'header'>
            <div className = 'header-menu'>
            <i class="fi-rr-layout-fluid"></i>            
            </div>
            <div className = 'header-leftfold'>
                <label className = 'header-label'> Microsoft Teams </label>
            </div>
            <div className = 'header-rightfold'>
                <div className = 'header-search'>
                <i class="fi-rr-search"></i>
                <input placeholder='Search'/>
                </div>
                <div className = 'header-profile'>
                    <div className = 'header-options'>
                    <i class="fi-rr-menu-dots"></i>
                    </div>
                    <img className = 'header-avatar' src='https://img-premium.flaticon.com/png/128/706/premium/706807.png?token=exp=1625849959~hmac=2540153a3a45054e31581876f16ac69c'/>

                </div>
            </div>
            
        </div>
    )
}

export default Header;
