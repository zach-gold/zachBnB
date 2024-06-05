import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createASpot, spotDetails } from "../../store/spots";

function CreateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sessionUser = useSelector((state) => state.session.user);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(90);
  const [lng, setLng] = useState(180);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [previewImage, setPreviewImage] = useState({ url: "", preview: true });
  const [img2, setImg2] = useState({ url: "", preview: true });
  const [img3, setImg3] = useState({ url: "", preview: true });
  const [img4, setImg4] = useState({ url: "", preview: true });
  const [img5, setImg5] = useState({ url: "", preview: true });

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let errArr = [];
    if (name.length < 5) {
      errArr.push("Name is required (Must be at least 5 characters)");
    }
    if (name.length > 30) {
      errArr.push("Name must be less than 50 characters");
    }
    if (address.length < 5) {
      errArr.push("Street address is required");
    }
    if (city.length < 1) {
      errArr.push("City is required");
    }
    if (state.length < 1) {
      errArr.push("State is required");
    }
    if (country.length < 1) {
      errArr.push("Country is required");
    }
    if (lat < -90 || lat > 90) {
      errArr.push("Latitude must be within -90 and 90");
    }
    if (lng < -180 || lng > 180) {
      errArr.push("Longitude must be within -180 and 180");
    }
    if (description.length < 30) {
      errArr.push("Description needs 30 or more characters");
    }
    if (!price) {
      errArr.push("Price per night is required");
    }
    if (previewImage.url.length < 1) {
      errArr.push("Preview image URL is required");
    }
    if (
      previewImage.url.length &&
      !(
        previewImage.url.endsWith(".png") ||
        previewImage.url.endsWith(".jpg") ||
        previewImage.url.endsWith(".jpeg") ||
        previewImage.url.endsWith(".webp")
      )
    )
      errArr.push("Preview Image URL needs to end in png or jpg (or jpeg)");
    if (
      img2.url.length &&
      !(
        img2.url.endsWith(".png") ||
        img2.url.endsWith(".jpg") ||
        img2.url.endsWith(".jpeg") ||
        img2.url.endsWith(".webp")
      )
    )
      errArr.push("Image URL 2 needs to end in png or jpg (or jpeg)");
    if (
      img3.url.length &&
      !(
        img3.url.endsWith(".png") ||
        img3.url.endsWith(".jpg") ||
        img3.url.endsWith(".jpeg") ||
        img3.url.endsWith(".webp")
      )
    )
      errArr.push("Image URL 3 needs to end in png or jpg (or jpeg)");
    if (
      img4.url.length &&
      !(
        img4.url.endsWith(".png") ||
        img4.url.endsWith(".jpg") ||
        img4.url.endsWith(".jpeg") ||
        img4.url.endsWith(".webp")
      )
    )
      errArr.push("Image URL 4 needs to end in png or jpg (or jpeg)");
    if (
      img5.url.length &&
      !(
        img5.url.endsWith(".png") ||
        img5.url.endsWith(".jpg") ||
        img5.url.endsWith(".jpeg") ||
        img5.url.endsWith(".webp")
      )
    )
      errArr.push("Image URL 5 needs to end in png or jpg (or jpeg)");

    setErrors(errArr);
  }, [
    name,
    address,
    city,
    state,
    country,
    lat,
    lng,
    description,
    price,
    previewImage.url,
    img2.url,
    img3.url,
    img4.url,
    img5.url,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();

    let spot = {
      ownerId: sessionUser.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    let images = {
      previewImage,
      img2,
      img3,
      img4,
      img5,
    };
    let newSpot = await dispatch(createASpot(spot, images));
    await dispatch(spotDetails(newSpot.id));
    navigate(`/spots/${newSpot.id}`);
  }

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
        Create a New Spot
      </h1>
      <form>
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
          </label>
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
                {errors.filter((error) => error.includes("address"))}
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
          </div>
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
          <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
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
          </div>
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
        <section
          id="photos-input-section"
          style={{ paddingBottom: "15px", borderBottom: "2px solid black" }}
        >
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot</p>
          <div
            id="photos-input-field"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <p
              style={{
                color: "red",
              }}
            >
              {errors.filter((error) =>
                error.includes("Preview image URL is required"),
              )}
            </p>
            <p
              style={{
                color: "red",
              }}
            >
              {errors.filter((error) =>
                error.includes(
                  "Preview Image URL needs to end in png or jpg (or jpeg)",
                ),
              )}
            </p>
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
            <p
              style={{
                color: "red",
              }}
            >
              {errors.filter((error) =>
                error.includes(
                  "Image URL 2 needs to end in png or jpg (or jpeg)",
                ),
              )}
            </p>
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
            <p
              style={{
                color: "red",
              }}
            >
              {errors.filter((error) =>
                error.includes(
                  "Image URL 3 needs to end in png or jpg (or jpeg)",
                ),
              )}
            </p>
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
            <p
              style={{
                color: "red",
              }}
            >
              {errors.filter((error) =>
                error.includes(
                  "Image URL 4 needs to end in png or jpg (or jpeg)",
                ),
              )}
            </p>
            <input
              id="image4Input"
              type="text"
              placeholder="Image URL"
              value={img4.url}
              onChange={(e) =>
                setImg4((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
            />
            <p
              style={{
                color: "red",
              }}
            >
              {errors.filter((error) =>
                error.includes(
                  "Image URL 5 needs to end in png or jpg (or jpeg)",
                ),
              )}
            </p>
            <input
              id="image5Input"
              type="text"
              placeholder="Image URL"
              value={img5.url}
              onChange={(e) =>
                setImg5((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
            />
          </div>
        </section>
        <button
          onClick={handleSubmit}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10px",
          }}
          disabled={errors.length}
        >
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpot;
