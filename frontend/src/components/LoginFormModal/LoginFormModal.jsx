import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import homeIcon from "../../../public/assets/home-icon.png";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [submitBlock, setSubmitBlock] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        if (parseInt(res.status) === 401) {
          setErrorMessage("The provided credentials were invalid");
        }
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    if (credential.length < 4 || password.length < 6) {
      setSubmitBlock(true);
    }
    if (credential.length >= 4 && password.length >= 6) {
      setSubmitBlock(false);
    }
  }, [credential, password]);

  return (
    <div className="loginBox" style={{ display: "flex" }}>
      <h1 style={{ textAlign: "center" }}>Log In</h1>
      <img
        src={homeIcon}
        alt="No"
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          overflow: "hidden",
          paddingBottom: "8px",
        }}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "450px",
          display: "flex",
          flexDirection: "column",
          marginLeft: "auto",
          marginRight: "auto",
          gap: "8px",
          paddingBottom: "8px",
        }}
      >
        <label>
          Username or Email: <br />
          <input
            style={{
              width: "442px",
            }}
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password: <br />
          <input
            style={{
              width: "442px",
            }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button
          type="submit"
          disabled={submitBlock}
          style={
            submitBlock === false
              ? {
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: "red",
                }
              : { cursor: "not-allowed" }
          }
        >
          Log In
        </button>
        <button
          type="submit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setCredential("Demo-lition"), setPassword("password");
          }}
        >
          Login as Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
