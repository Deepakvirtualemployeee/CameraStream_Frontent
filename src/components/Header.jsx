import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BellIcon from "../assets/images/icons/bell.svg";
import BookIcon from "../assets/images/icons/book.svg";

export const Header = () => {

  // Start: Mobile sidebar offcanvas code
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)

  const openOffcanvas = () => {
    setIsOffcanvasOpen(true);
  };

  // console.log(user.first_name)
  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  return (
    <nav className="navbar navbar-light bg-white navbar-expand-lgg top-header sticky-top shadow-sm py-2" data-bs-theme="light" style={{ minHeight: "61px" }}>
      <div className="container-fluid gap-2">
        <div className="left-sec col d-flex align-items-center justify-content-start gap-3">
          <Button variant="link" className="navbar-togglerr border-0 bg-transparent text-primary d-lg-none p-0" onClick={openOffcanvas}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>

          {/* <div className="icon text-primary d-none d-lg-block">
            <div className="searchfield-wrapper">
              <input type="search" className="form-control bg-secondary bg-opacity-10" placeholder="Search keywords..." autoComplete="off" style={{ width: '280px' }}/>
              <img src={SearchIcon} alt="Search Icon" className="position-absolute top-50 end-0 translate-middle-y pe-3" />
            </div>
          </div> */}

          <Link to={'/'} className='sidebar-logo text-decoration-none border-bottom border-white border-opacity-25 d-flex align-items-center' style={{ width: '130px' }}>
            <img className="img-fluid" src={require('../assets/images/logo.png')} alt="Logo" />
          </Link>
        </div>

        <div className="middle-sec col text-center">
          <Link className="navbar-brand d-flex flex-column d-lg-none align-items-center p-0 px-2 m-0" to="/" >
            <div className="d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={require("../assets/images/logo.png")} alt="Logo" />
              {/* <span className="text-body ms-2 fs-4 fw-bold lh-sm">Biome4Pets</span> */}
            </div>
          </Link>
        </div>

        {/* Start: Mobile Sidebar Drawer */}
        <Offcanvas show={isOffcanvasOpen} onHide={closeOffcanvas} style={{ maxWidth: "230px" }}>
          <div className="sidebar-wrapper" style={{ display: "block" }}>
            <Sidebar closeOffcanvas={closeOffcanvas} />
          </div>
        </Offcanvas>

        {/* {isOffcanvasOpen && (
          <div className="offcanvas-backdrop fade show"></div>
        )} */}

        {/* End: Mobile Sidebar Drawer */}

        <ul className="right-sec col d-flex align-items-center justify-content-end gap-3 m-0 p-0">
          <li className="nav-item dropdown">
            <Link to={'/'}>
              <img src={BellIcon} alt="Bell Icon" className="img-fluid" />
            </Link>
          </li>
          <li className="nav-item dropdown">
            <Link to={'/'}>
              <img src={BookIcon} alt="Book Icon" className="img-fluid" />
            </Link>
          </li>
          <div className="divider vr"></div>
          <li className="nav-item dropdown user-logout">
            <button className="nav-link text-white text-center border-0 bg-transparent p-0" data-bs-toggle="dropdown" aria-expanded="false">
              <div className="chip-wrapper d-flex align-items-center gap-2">
                <div className="chip-img bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center rounded-circle overflow-hidden">
                  <div className="user-shortname fs-16 fw-medium text-black text-opacity-75 text-uppercase">K</div>
                  {/* <img className="w-100 h-100" src={require("../assets/images/dummy-user.jpeg")} alt="User" /> */}
                </div>
                <div className="user-info text-start">
                  <div className="username fs-14 fw-medium text-black text-opacity-75 text-capitalize">kapil Prajapati</div>
                  <div className="user-email fs-12 text-muted text-lowercase">kapil@virtualemployee.com</div>
                </div>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end caret-indicator shadow-lg p-3 pb-4 mt-2" style={{ width: "300px" }}>
              <div className="d-flex justify-content-between gap-2">
                <div className="orgainization-name title-label fw-medium">Company name</div>
                <Link to="/login" className="signout title-label text-primary fw-medium">Sign out</Link>
              </div>
              <div className="d-flex align-items-center gap-2 mt-3">
                <div className="chip-wrapper">
                  <div className="chip-img bg-primary d-flex align-items-center justify-content-center rounded-pill border border-primary overflow-hidden" style={{ height: "70px", width: "70px" }}>
                    {/* <div className='user-shortname text-light fs-3'>VA</div> */}
                    <img className="w-100 h-100" src={require("../assets/images/dummy-user.jpeg")} alt="User" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div className="user-info overflow-hidden">
                  <div className="user-name fw-semibold text-capitalize text-truncate lh-sm">Vasheem Ahmad</div>
                  <div className="user-email title-label text-truncate text-lowercase">vasheemahmad@virtualemployee.com</div>
                  <div className="title-label">
                    <Link to={"#"} className="btn-link">View account </Link>
                  </div>
                </div>
              </div>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};
