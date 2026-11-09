import {
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";

import cls from "./LoginForm.module.scss";

import logo from "../../../../shared/assets/logo.svg";

import { useAppDispatch } from "../../../../app/store/hooks";

import { setUser } from "../../../../entities/User/model/userSlice";

import { login } from "../../../../shared/api/auth";

export const LoginForm = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [usernameOrEmail, setUsernameOrEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [errors, setErrors] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [message, setMessage] =
    useState("");

  const [isError, setIsError] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    const normalizedUsernameOrEmail =
      usernameOrEmail.trim();

    const newErrors = {
      usernameOrEmail: "",
      password: "",
    };

    if (!normalizedUsernameOrEmail) {
      newErrors.usernameOrEmail =
        "Please enter your username or email.";
    }

    if (!password) {
      newErrors.password =
        "Please enter your password.";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    setErrors(newErrors);

    if (
      Object.values(newErrors).some(Boolean)
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const user = await login({
        usernameOrEmail:
          normalizedUsernameOrEmail,
        password,
      });

      dispatch(setUser(user));

      setMessage("Login successful.");
      setIsError(false);

      navigate(`/profile/${user._id}`);
    } catch (error) {
      console.error(
        "Login error:",
        error,
      );

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Unable to connect to the server. Please try again later.",
        );
      }

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={cls.upperBox}>
        <form onSubmit={handleSubmit}>
          <img
            src={logo}
            alt="ICHGram logo"
          />

          <div className={cls.inputBox}>
            <input
              id="usernameOrEmail"
              placeholder="Username or email"
              type="text"
              value={usernameOrEmail}
              onChange={(event) =>
                setUsernameOrEmail(
                  event.target.value,
                )
              }
              disabled={isLoading}
            />

            {errors.usernameOrEmail && (
              <p
                className={
                  cls.errorMessage
                }
              >
                {
                  errors.usernameOrEmail
                }
              </p>
            )}
          </div>

          <div className={cls.inputBox}>
            <input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              disabled={isLoading}
            />

            {errors.password && (
              <p
                className={
                  cls.errorMessage
                }
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            className={cls.logInButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Logging in..."
              : "Log in"}
          </button>

          <div className={cls.divider}>
            <span>OR</span>
          </div>

          <button
            className={
              cls.forgotPasswordButton
            }
            type="button"
            onClick={() =>
              navigate("/reset")
            }
            disabled={isLoading}
          >
            Forgot Password?
          </button>

          {message && (
            <p
              className={
                isError
                  ? cls.serverErrorMessage
                  : cls.successMessage
              }
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <div className={cls.lowerBox}>
        <p>Don't have an account?</p>

        <button
          className={cls.signUpButton}
          type="button"
          onClick={() =>
            navigate("/register")
          }
        >
          Sign Up
        </button>
      </div>
    </>
  );
};