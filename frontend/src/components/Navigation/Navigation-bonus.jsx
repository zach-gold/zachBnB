import { useNavigate } from "react-router-dom";
//import {NavLink} from "react-router-dom"
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";
import homeIcon from "../../../public/assets/home-icon.png";

function Navigation({ isLoaded }) {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        borderBottom: "1px solid gray",
        paddingLeft: "30px",
        paddingRight: "30px",
      }}
    >
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          cursor: "pointer",
        }}
      >
        <img
          src={homeIcon}
          alt="No"
          style={{
            width: "90px",
            height: "auto",
            borderRadius: "50%",
            overflow: "hidden",
            paddingBottom: "8px",
          }}
        />
      </div>

      <div
        style={{
          borderRadius: "25px ",
          border: "1px solid gray",
          marginTop: "25px",
          paddingRight: "5px",
          paddingLeft: "25px",
          width: "50px",
          height: "45px",
          boxShadow: "2px 2px 5px #002855",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {/* <li>
          <NavLink to="/" style={{ fontSize: "20px" }}>
            Home
          </NavLink>
        </li> */}
        {isLoaded && (
          <span>
            <ProfileButton user={sessionUser} />
          </span>
        )}
      </div>
    </div>
  );
}

export default Navigation;
