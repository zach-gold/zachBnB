import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../store/spots";
import "./Homepage.css";
import { FaStar } from "react-icons/fa";

const Homepage = () => {
  const dispatch = useDispatch();

  let spots = useSelector((state) => state.spots);

  spots = Object.values(spots);

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);
  return (
    <>
      <div className="spotContainer">
        {spots &&
          spots.map((spot) => (
            <div className="tile" key={spot.id}>
              <NavLink className="spotLink" to={`/spots/${spot.id}`}>
                <img
                  src={spot.previewImage}
                  alt={`Preview image for ${spot.name}`}
                  className="tileThumbnail"
                />
                <div className="spotInfo">
                  <span className="spotName">{`${spot.name}`}</span>
                  <div
                    className="spotLocation"
                    style={{ fontSize: "18px",fontWeight: "550" }}
                  >{`${spot.city}, ${spot.state}`}</div>

                  <div className="price">{`$${spot.price}`}/ night</div>
                  <div className="stars">
                    <FaStar className="star" />
                    <span className="howMany" style={{ fontWeight: "650" }}>
                      {spot.avgRating !== 0 ? `${spot.avgRating} stars` : "New"}
                    </span>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
      </div>
    </>
  );
};

export default Homepage;
