import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import cls from "./ResetForm.module.scss";
import padlock from "../../../../shared/assets/padlock.svg";

export const ResetForm = () => {
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmailOrUsername = emailOrUsername.trim();

    // Проверка email или username
    if (!normalizedEmailOrUsername) {
      setError("Please enter your email or username.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: normalizedEmailOrUsername,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Something went wrong. Please try again.",
        );
        return;
      }

      setMessage(
        data.message ||
          "If an account exists with this email or username, we've sent instructions to reset your password.",
      );
    } catch (error) {
      console.error("Password reset request error:", error);

      setMessage(
        "Unable to connect to the server. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={cls.upperBox}>
        <form onSubmit={handleSubmit}>
          <img src={padlock} alt="Padlock sign" />

          <h3>Trouble logging in?</h3>

          <p>
            Enter your email or username and we'll send you a link to get back
            into your account.
          </p>

          <div className={cls.inputBox}>
            <input
              id="emailOrUsername"
              placeholder="Email or Username"
              type="text"
              value={emailOrUsername}
              onChange={(event) => setEmailOrUsername(event.target.value)}
              disabled={isLoading}
            />

            {error && (
              <p className={cls.errorMessage}>{error}</p>
            )}
          </div>

          <button
            className={cls.resetButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Reset your password"}
          </button>

          {message && (
            <p className={cls.successMessage}>{message}</p>
          )}

          <div className={cls.divider}>
            <span>OR</span>
          </div>

          <button
            className={cls.newAccountButton}
            type="button"
            onClick={() => navigate("/register")}
            disabled={isLoading}
          >
            Create new account
          </button>
        </form>
      </div>

      <div className={cls.lowerBox}>
        <button
          className={cls.backToLogInButton}
          type="button"
          onClick={() => navigate("/login")}
          disabled={isLoading}
        >
          Back to login
        </button>
      </div>
    </>
  );
};