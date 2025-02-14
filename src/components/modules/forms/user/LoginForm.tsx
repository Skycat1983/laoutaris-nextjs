"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
// import { GET, handler } from "../api/auth/[...nextauth]/route";

// TODO: is this unused? if yes remove
const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? "Loading..." : "Login"}
    </button>
  );
};

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call signIn from next-auth/react
    const result = await signIn("credentials", {
      //   redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      // Redirect or handle success
      window.location.href = "/dashboard"; // Or any route you want
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
};

export default LoginForm;
