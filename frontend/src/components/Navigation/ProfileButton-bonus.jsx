import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useNavigate, NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button
        onClick={toggleMenu}
        style={{
          position: "relative",
          left: "-15px",
          borderRadius: "40%",
          border: "none",
          width: "60px",
          height: "40px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        <span
          className="far fa-address-card"
          style={{ position: "relative", fontSize: "36px", cursor: "pointer" }}
        />
      </button>
      <br />
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            {/* <li>{user.username}</li> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              <span>
                Hello, {user.firstName}
              </span>
              <br />
              {/* <li>{user.username}</li> */}
              <span>{user.email}</span>
              <br />
            </div>
            <div style={{ width: "148px", borderBottom: "1px solid black", borderTop: "1px solid black" }}>
              <NavLink to="/manage" style={{ paddingLeft: "18px" }}>
                Manage Spots
              </NavLink>
              <br />
            </div>
            <span>
              <button onClick={logout}>Log Out</button>
            </span>
          </>
        ) : (
          <div className="profilemenu" style={{ alignItems: "left" }}>
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
