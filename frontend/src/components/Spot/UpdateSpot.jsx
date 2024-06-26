import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateCurrentSpot } from "../../store/spots";
import { useNavigate, useParams } from "react-router-dom";
import { spotDetails } from "../../store/spots";

function UpdateSpot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots[spotId]);
  // let images = spot?.SpotImages;
  // console.log(images);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [country, setCountry] = useState(spot?.country);
  const [lat] = useState(spot?.lat);
  const [lng] = useState(spot?.lng);
  const [description, setDescription] = useState(spot?.description);
  const [name, setName] = useState(spot?.name);
  // const [description, setDescription] = useState()
  const [price, setPrice] = useState(spot?.price);

  const [errors, setErrors] = useState([]);
  useEffect(() => {
    dispatch(spotDetails(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    let errorArray = [];

    if (!address) {
      errorArray.push("Address is required");
    }
    if (!city) {
      errorArray.push("City is required");
    }
    if (!state) {
      errorArray.push("State is required");
    }
    if (!country) {
      errorArray.push("Country is required");
    }
    if (!name) {
      errorArray.push("Name is required");
    }
    if (!description) {
      errorArray.push("Description should be at least 30 characters");
    }
    if (!price) {
      errorArray.push("Price is required");
    }
    setErrors(errorArray);
  }, [address, city, state, country, name, description, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSpot = {
      ownerId: sessionUser.id,
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    };
    const updatedSpot = await dispatch(updateCurrentSpot(newSpot, spotId));
    dispatch(spotDetails(updatedSpot));
    navigate(`/spots/${updatedSpot.id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        width: "500px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h1 style={{ marginLeft: "auto", marginRight: "auto" }}>
        Update your Spot
      </h1>
      <form onSubmit={handleSubmit}>
        <section
          id="inputContainer"
          style={{ paddingBottom: "15px", borderBottom: "2px solid black" }}
        >
          <h2>Where&#39;s your spot located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation
          </p>
          <label
            htmlFor="Country"
            style={{ display: "flex", flexDirection: "column" }}
          >
            Country
            <p
              style={{
                color: "red",
              }}
            >
              {errors.filter((error) => error.includes("Country"))}
            </p>
            <input
              id="Country"
              name="Country"
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label><br />
          <div id="addressInputContainer">
            <label
              htmlFor="streetAddress"
              style={{ display: "flex", flexDirection: "column" }}
            >
              Street Address
              <p
                style={{
                  color: "red",
                }}
              >
                {errors.filter((error) => error.includes("Address"))}
              </p>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                placeholder="Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
          </div><br />
          <div style={{ display: "flex", gap: "30px" }}>
            <label htmlFor="city">
              City
              <p
                style={{
                  color: "red",
                }}
              >
                {errors.filter((error) => error.includes("City"))}
              </p>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: "295px" }}
              />
            </label>
            <label htmlFor="state">
              State
              <p
                style={{
                  color: "red",
                }}
              >
                {errors.filter((error) => error.includes("State"))}
              </p>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </label>
          </div>
          <br />
          {/* <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <label htmlFor="latitude">
              Latitude
              <p
                style={{
                  color: "red",
                }}
              >
                {errors.filter((error) => error.includes("Lat"))}
              </p>
              <input
                type="number"
                id="latitude"
                name="latitude"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                style={{ width: "232px" }}
              />
            </label>
            <label htmlFor="longitude">
              Longitude
              <p
                style={{
                  color: "red",
                }}
              >
                {errors.filter((error) => error.includes("Long"))}
              </p>
              <input
                type="number"
                id="longitude"
                name="longitude"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                style={{ width: "232px" }}
              />
            </label>
          </div> */}
        </section>
        <section
          id="descriptionContainer"
          style={{ paddingBottom: "15px", borderBottom: "2px solid black" }}
        >
          <h2>Describe your place to guests!</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking
          </p>
          <textarea
            name="description"
            id="descriptionInput"
            cols="67"
            rows="5"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p
            style={{
              color: "red",
            }}
          >
            {errors.filter((error) => error.includes("Description"))}
          </p>
        </section>
        <section
          style={{ paddingBottom: "15px", borderBottom: "2px solid black" }}
        >
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests&#39; attention with a spot title that highlights what
            makes your spot special.
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            style={{ width: "490px" }}
          />
          <p
            style={{
              color: "red",
            }}
          >
            {errors.filter((error) => error.includes("Name"))}
          </p>
        </section>
        <section
          style={{ paddingBottom: "15px", borderBottom: "2px solid black" }}
        >
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </p>
          ${" "}
          <input
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "475px" }}
          />
          <p
            style={{
              color: "red",
            }}
          >
            {errors.filter((error) => error.includes("Price"))}
          </p>
        </section>
        {/* <section id="photos-input-section">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot</p> */}
        {/* <div id="photos-input-field"> */}
        {/* <label htmlFor="prevImageURL">
              Preview Image URL:{" "}
              <input
                type="text"
                placeholder="Preview Image Url"
                id="prevImageURL"
                value={previewImage.url}
                onChange={(e) =>
                  setPreviewImage((prevState) => ({
                    ...prevState,
                    url: e.target.value,
                  }))
                }
              />
            </label>
            <label htmlFor="image2Input">
              Image 2 URL
              <input
                type="text"
                placeholder="Image URL"
                id="image2Input"
                value={img2.url}
                onChange={(e) =>
                  setImg2((prevState) => ({
                    ...prevState,
                    url: e.target.value,
                  }))
                }
              />
            </label>
            <label htmlFor="image3Input">
              Image 3 URL
              <input
                id="image3Input"
                type="text"
                placeholder="Image URL"
                value={img3.url}
                onChange={(e) =>
                  setImg3((prevState) => ({
                    ...prevState,
                    url: e.target.value,
                  }))
                }
              />
            </label>
            <label htmlFor="image4Input">
              Image 4 URL
              <input
                type="text"
                id="image4Input"
                placeholder="Image URL"
                value={img4.url}
                onChange={(e) =>
                  setImg4((prevState) => ({
                    ...prevState,
                    url: e.target.value,
                  }))
                }
              />
            </label>
            <label htmlFor="image5Input">
              Image 5 URL
              <input
                type="text"
                id="image5Input"
                placeholder="Image URL"
                value={img5.url}
                onChange={(e) =>
                  setImg5((prevState) => ({
                    ...prevState,
                    url: e.target.value,
                  }))
                }
              />
            </label> */}
        {/* </div> */}
        {/* </section> */}
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // width: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10px",
          }}
        >
          Update your Spot
        </button>
      </form>
    </div>
  );
}

export default UpdateSpot;
