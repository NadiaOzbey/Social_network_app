import { useState, type FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import cls from "./SignUpForm.module.scss";

import logo from "../../../../shared/assets/logo.svg";

import { register } from "../../../../shared/api/auth";

export const SignUpForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });

  const [emailServerError, setEmailServerError] = useState("");
  const [usernameServerError, setUsernameServerError] = useState("");
  const [serverError, setServerError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmailServerError("");
    setUsernameServerError("");
    setServerError("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullName = fullName.trim();
    const normalizedUsername = username.trim().toLowerCase();

    const newErrors = {
      email: "",
      fullName: "",
      username: "",
      password: "",
    };

    // Проверка email
    if (!normalizedEmail) {
      newErrors.email = "Please enter your email.";
    }

    // Проверка Full Name
    if (!normalizedFullName) {
      newErrors.fullName = "Please enter your full name.";
    } else if (normalizedFullName.length < 2) {
      newErrors.fullName =
        "Full name must contain at least 2 characters.";
    }

    // Проверка username
    if (!normalizedUsername) {
      newErrors.username = "Please enter your username.";
    } else if (
      normalizedUsername.length < 3 ||
      normalizedUsername.length > 30
    ) {
      newErrors.username =
        "Username must be between 3 and 30 characters.";
    } else {
      const usernameRegex = /^[a-zA-Z0-9._]+$/;

      if (!usernameRegex.test(normalizedUsername)) {
        newErrors.username =
          "Username can contain only letters, numbers, dots and underscores.";
      }
    }

    // Проверка пароля
    if (!password) {
      newErrors.password = "Please enter your password.";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    setErrors(newErrors);

    // Если есть ошибки — запрос на сервер не отправляем
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    try {
      setIsLoading(true);

      const user = await register({
        email: normalizedEmail,
        fullName: normalizedFullName,
        username: normalizedUsername,
        password,
      });

      console.log("Registered user:", user);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please try again later.";

      if (message === "This email is already taken") {
        setEmailServerError(message);
      } else if (message === "This username is already taken") {
        setUsernameServerError(message);
      } else {
        setServerError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={cls.upperBox}>
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="ICHGram logo" />

          <p className={cls.signUpToSee}>
            Sign up to see photos and videos from your friends.
          </p>

          <div className={cls.inputBox}>
            <input
              id="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailServerError("");
              }}
              disabled={isLoading}
            />

            {errors.email && (
              <p className={cls.errorMessage}>
                {errors.email}
              </p>
            )}

            {emailServerError && (
              <p className={cls.serverErrorMessage}>
                {emailServerError}
              </p>
            )}
          </div>

          <div className={cls.inputBox}>
            <input
              id="fullName"
              placeholder="Full Name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              disabled={isLoading}
            />

            {errors.fullName && (
              <p className={cls.errorMessage}>
                {errors.fullName}
              </p>
            )}
          </div>

          <div className={cls.inputBox}>
            <input
              id="username"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setUsernameServerError("");
              }}
              disabled={isLoading}
            />

            {errors.username && (
              <p className={cls.errorMessage}>
                {errors.username}
              </p>
            )}

            {usernameServerError && (
              <p className={cls.serverErrorMessage}>
                {usernameServerError}
              </p>
            )}
          </div>

          <div className={cls.inputBox}>
            <input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
            />

            {errors.password && (
              <p className={cls.errorMessage}>
                {errors.password}
              </p>
            )}
          </div>

          {serverError && (
            <p className={cls.serverErrorMessage}>
              {serverError}
            </p>
          )}

          <div className={cls.textBox}>
            <p className={cls.text}>
              People who use our service may have uploaded your contact
              information to Instagram. <span>Learn More</span>
            </p>

            <p className={cls.text}>
              By signing up, you agree to our{" "}
              <span>Terms, Privacy Policy</span> and{" "}
              <span>Cookies Policy.</span>
            </p>
          </div>

          <button
            className={cls.signUpButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>

      <div className={cls.lowerBox}>
        <p>Have an account?</p>

        <button
          className={cls.logInButton}
          type="button"
          onClick={() => navigate("/login")}
          disabled={isLoading}
        >
          Log in
        </button>
      </div>
    </>
  );
};