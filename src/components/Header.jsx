import React, { memo, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
// import BellIcon from "../assets/images/icons/bell.svg";
// import BookIcon from "../assets/images/icons/book.svg";
import UserIcon from "../assets/images/icons/user.svg";
// import CreditCardIcon from "../assets/images/icons/credit-card.svg";
// import APIIcon from "../assets/images/icons/api.svg";
import LogoutIcon from "../assets/images/icons/log-out.svg";

export const Header = memo(({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const { companyId } = useParams();

  const [userState, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_user")) || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const updated = JSON.parse(localStorage.getItem("admin_user")) || null;
        setUserState(updated);
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const userName = userState?.name || "User";
  const userEmail = userState?.email || "";
  const companyName = userState?.company?.name || "";

  return (
    <nav className="navbar navbar-light bg-white border-bottom navbar-expand-lgg top-header sticky-top py-2" data-bs-theme="light" style={{ minHeight: "61px" }}>
      <div className="container-fluid gap-2 flex-nowrap">
        <div className="left-sec d-flex align-items-center justify-content-start gap-3">
          <span className="pointer" onClick={toggleSidebar}><i className={`fs-3 bi ${!collapsed ? 'bi-caret-left-square' : 'bi-caret-right-square'} lh-sm`}></i></span>
        </div>

        <ul className="right-sec d-flex align-items-center justify-content-end gap-1 gap-sm-2 m-0 p-0">
          {/* <li className="nav-item dropdown">
            <NavLink to={'/'} className="nav-link p-2">
              <img src={BellIcon} alt="Bell Icon" className="img-fluid" style={{minWidth:'24px'}} />
            </NavLink>
          </li>
          <li className="nav-item dropdown">
            <NavLink to={'/'} className="nav-link active me-2 me-md-0 p-2">
              <img src={BookIcon} alt="Book Icon" className="img-fluid" style={{minWidth:'24px'}} />
            </NavLink>
          </li> */}
          <div className="divider vr d-none d-md-block mx-2"></div>
          <Dropdown align="end" className="account-menu">
            <Dropdown.Toggle variant="white" className="bg-transparent border-0 p-0" id="dropdown-basic">
              <div className="chip-wrapper d-flex align-items-center gap-2 text-truncate">
                <div className="chip-img bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center rounded-circle overflow-hidden">
                  {/* <div className="user-shortname fs-16 fw-medium text-black text-opacity-75 text-uppercase">K</div> */}
                  <div className="user-shortname fs-16 fw-medium text-black text-opacity-75 text-uppercase">
                    {userName?.charAt(0) || "U"}
                  </div>

                  {/* <img className="w-100 h-100" src={require("../assets/images/dummy-user.jpeg")} alt="User" /> */}
                </div>
                {/* <div className="user-info text-start text-truncate d-none d-sm-block">
                  <div className="username fs-14 fw-medium text-black text-opacity-75 text-capitalize">kapil Prajapati</div>
                  <div className="user-email fs-12 text-muted text-lowercase text-truncate">kapil@virtualemployee.com</div>
                </div> */}
                <div className="user-info text-start text-truncate d-none d-sm-block">
                  <div className="username fs-14 fw-medium text-black text-opacity-75 text-capitalize">
                    {userName}
                  </div>
                  <div className="user-email fs-12 text-muted text-lowercase text-truncate">
                    {userEmail}
                  </div>
                   <div className="user-email fs-12 text-muted  text-truncate">
                    {companyName}
                  </div>
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm rounded-3">
              <Dropdown.Item href={`/settings/company-info/${companyId}`} className="">
                <img src={UserIcon} alt="User Icon" className="img-fluid" /> Profile
              </Dropdown.Item>
              {/* <Dropdown.Divider /> */}
              {/* <Dropdown.Item href="/billing" className="text-theme3">
                <img src={CreditCardIcon} alt="Credit Card Icon" className="img-fluid" /> Billing
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="/api" className="text-theme3">
                <img src={APIIcon} alt="API Icon" className="img-fluid" /> API
              </Dropdown.Item> */}
              <Dropdown.Divider />
              {/* <Dropdown.Item href="/logout"   onClick={() => {
                                        navigate('/login');
                                        localStorage.removeItem("token");
                                    }} className="text-theme3">
                <img src={LogoutIcon} alt="Logout Icon" className="img-fluid" /> Log out
              </Dropdown.Item> */}
              <Dropdown.Item
                as="button"
                onClick={() => {
                  navigate('/login');
                  localStorage.removeItem("token");
                }}
                className=""
              >
                <img
                  src={LogoutIcon}
                  alt="Logout Icon"
                  className="img-fluid"
                />{" "}
                Log out
              </Dropdown.Item>
              <Dropdown.Divider />
              <div className="fs-12 d-flex align-items-center px-3">
                <Link to={'#'} className="text-theme3 text-decoration-none p-0">Terms of Service</Link>
                <span><i className="bi bi-dot fs-4 lh-1"></i></span>
                <Link to={'#'} className="text-theme3 text-decoration-none p-0">Privacy</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
      </div>
    </nav>
  );
});
