import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { spotDetails } from "../../store/spots";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { deleteReviewThunk, spotReviews } from "../../store/reviews";
import MakeReview from "../Reviews/MakeReview";
import "../../index.css";
import "./Spot.css";
import "./modal.css";
import noImg from "./noImg.jpg";

function DetailsPage() {
  let { spotId } = useParams();
  let dispatch = useDispatch();
  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    dispatch(spotDetails(spotId));
    dispatch(spotReviews(spotId));
  }, [dispatch, spotId, trigger]);

  let spot = useSelector((state) => state.spots);
  let selected = spot[spotId];
  let reviews = useSelector((state) => state.reviews);
  let rv = Object.values(reviews);
  //console.log("Reviews: " + rv);
  let reversedReviews = rv.reverse();
  //console.log("reversedReviews: " + reversedReviews);
  const handleDelete = async () => {
    const reviewToDelete = rv.find(
      (review) => review.userId === sessionUser.id,
    );
    if (reviewToDelete) {
      await dispatch(deleteReviewThunk(reviewToDelete.id));
      toggleDeleteModal();
    }
    //console.log(reviewToDelete);
  };
  //console.log(reversedReviews);
  let sum = 0;
  rv.forEach((review) => {
    sum += review.stars;
  });
  //   console.log(sum);
  let average = (sum / rv.length).toFixed(1);
  //   console.log(average);
  let stringAvg = average.toString();
  let sessionUser = useSelector((state) => state.session.user);
  let existing = rv.find((review) => review.userId === sessionUser?.id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to open and close modal
  const toggleModal = () => {
    setShowModal(!showModal);
    setTrigger(!trigger);
  };

  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  const closeModal = () => {
    setTrigger(!trigger);
    setShowModal(false);
    dispatch(spotReviews(spotId));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div>
      {selected && (
        <div
          className="spotPage"
          style={{ width: "1000px", marginRight: "auto", marginLeft: "auto" }}
        >
          <header>
            <h2>{selected.name}</h2>
            <h3>
              {selected.city}, {selected.state}, {selected.country}
            </h3>
          </header>
          <div className="spotDetailsImages">
            <img
              src={selected?.SpotImages?.[0]?.url || noImg}
              alt={`Spot ${spotId} preview image`}
              className="largeThumbnail"
            />
            <div className="smallImagesContainer">
              <img
                src={selected.SpotImages?.[1]?.url || noImg}
                alt="small spot picture one"
              />
              <img
                src={selected.SpotImages?.[2]?.url || noImg}
                alt="small spot picture 2"
              />
              <img
                src={selected.SpotImages?.[3]?.url || noImg}
                alt="small spot picture 3"
              />
              <img
                src={selected.SpotImages?.[4]?.url || noImg}
                alt="small spot picture 4"
              />
            </div>
            <div className="spotInfo">
              <div className="description">
                <h3>{`Hosted by ${selected.Owner?.firstName} ${selected.Owner?.lastName}`}</h3>
                <p>{selected.description}</p>
                <span className="spotPrice">{`$${selected.price} / night`}</span>{" "}
                <br />
                <span className="spotStars">
                  <div className="reviewBoard">
                    <div
                      className="reviewHeader"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <h3>
                        {/* {rv.length > 0 ? ( */}
                        <FaStar style={{ color: "#EAAA00" }} />
                        {/* ) : null} */}
                        {rv.length > 0
                          ? average % 1 !== 0
                            ? ` ${average} Stars · `
                            : ` ${stringAvg} Stars · `
                          : ""}
                      </h3>

                      <h3>
                        {rv.length === 0
                          ? "New"
                          : rv.length > 1
                            ? `${rv.length} reviews`
                            : `1 review`}
                        {/* {rv.length > 1
                          ? ` ${rv.length} reviews`
                          : ` ${rv.length} review`} */}
                      </h3>
                    </div>
                    {/* Review button */}
                    {sessionUser &&
                      sessionUser.id !== selected.ownerId &&
                      !existing && (
                        <button
                          onClick={toggleModal}
                          style={{
                            fontWeight: "550",
                            border: "1px solid grey",
                            borderRadius: "10%",
                            backgroundColor: "grey",
                            color: "white",
                          }}
                        >
                          {rv.length > 0
                            ? "Post Your Review!"
                            : "Be the first to leave a review!"}
                        </button>
                      )}
                    <ul style={{ listStyle: "none" }}>
                      {reversedReviews.map((review) => (
                        <li key={review.id}>
                          <h4>
                            {review?.User?.firstName +
                              `, ${
                                months[review.createdAt?.slice(5, 6) - 1]
                              } ${review.createdAt?.slice(0, 4)}`}
                          </h4>
                          <p>
                            <FaStar style={{ color: "#EAAA00" }} />
                            <b> {review.stars} Stars</b>
                          </p>
                          <p>{review.review}</p>
                          {sessionUser && sessionUser.id === review.userId && (
                            <button onClick={toggleDeleteModal}>Delete</button>
                          )}
                          {showDeleteModal && (
                            <div className="modal" onClick={toggleDeleteModal}>
                              <div
                                className="modal-content"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span
                                  className="close"
                                  style={{ cursor: "pointer" }}
                                  onClick={toggleDeleteModal}
                                >
                                  X
                                </span>
                                <h2>Confirm Delete</h2>
                                <p>
                                  Are you sure you want to delete this review?
                                </p>
                                <button
                                  style={{ backgroundColor: "red", color:"white" }}
                                  onClick={() => {
                                    handleDelete(); // console.log(review.id);
                                  }}
                                >
                                  {`Yes (Delete Review)`}
                                </button>
                                <button
                                  style={{
                                    backgroundColor: "grey",
                                    color: "White",
                                  }}
                                  onClick={toggleDeleteModal}
                                >{`No (Keep Review)`}</button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </span>
              </div>
            </div>
            <div className="reserveBox">
              <div
                style={{
                  position: "sticky",
                  right: "12px",
                  width: "480px",
                  height: "150px",
                  border: "3px solid rgb(0, 40, 85)",
                  borderRadius: "5%",
                }}
              >
                <h3 style={{ marginLeft: "20px" }}>
                  ${selected.price} per night
                </h3>
                <h4 style={{ marginLeft: "20px" }}>
                  <FaStar />
                  {rv.length > 0 ? ` ${average} Stars · ` : null}
                  {rv.length === 0
                    ? "New"
                    : rv.length > 1
                      ? `${rv.length} reviews`
                      : `1 review`}
                </h4>
                {sessionUser && sessionUser?.id !== selected.ownerId && (
                  <button
                    onClick={() => window.alert("Feature coming soon...")}
                    style={{
                      marginLeft: "10px",
                      marginRight: "15px",
                      cursor: "pointer",
                      width: "460px",
                      height: "30px",
                      backgroundColor: "red",
                      color: "white",
                      fontSize: "1em",
                    }}
                  >
                    Reserve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span
              className="close"
              style={{ cursor: "pointer" }}
              onClick={toggleModal}
            >
              X
            </span>
            <MakeReview className="reviewModal" closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailsPage;
