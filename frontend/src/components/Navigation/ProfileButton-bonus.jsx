import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import {  useNavigate } from "react-router-dom";

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
          cursor:"pointer"
        }}
      >
        <span
          className="far fa-address-card"
          style={{ position: "relative", fontSize: "36px",cursor:"pointer" }}
        />
      </button>
      <br />
      <div className={ulClassName} ref={ulRef} style={{ paddingRight: "18px" }}>
        {user ? (
          <>
            {/* <li>{user.username}</li> */}
            <span>
              Hello, {user.firstName} {user.lastName}
            </span>
            <br />
            {/* <li>{user.username}</li> */}
            <span>{user.email}</span>
            <br />
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
