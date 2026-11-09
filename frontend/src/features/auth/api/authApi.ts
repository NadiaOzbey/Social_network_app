import { useState } from "react";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <form>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>

      <label>
        Email
        <input
          type="email"
          name="email"
          required
        />
      </label>

      {!isLogin && (
        <>
          <label>
            Full name
            <input
              type="text"
              name="fullName"
              required
            />
          </label>

          <label>
            Username
            <input
              type="text"
              name="username"
              required
            />
          </label>
        </>
      )}

      <label>
        Password
        <input
          type="password"
          name="password"
          required
        />
      </label>

      <button type="submit">
        {isLogin ? "Login" : "Sign Up"}
      </button>

      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Need an account? Sign Up"
          : "Already have an account? Login"}
      </button>
    </form>
  );
};
