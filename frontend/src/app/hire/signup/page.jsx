"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HireSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [location, setLocation] = useState("");
  const [expectedWage, setExpectedWage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm || !location || !expectedWage) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/employer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          location,
          expected_wage: parseFloat(expectedWage),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/hire/login");
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Hire – Sign Up</h2>

      <form onSubmit={handleSignup} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Enter full name"
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          style={styles.input}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter your location"
          style={styles.input}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="number"
          placeholder="Expected wage"
          style={styles.input}
          value={expectedWage}
          onChange={(e) => setExpectedWage(e.target.value)}
        />

        <button disabled={loading} type="submit" style={styles.button}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p style={styles.linkText}>
        Already have an account?{" "}
        <span style={styles.link} onClick={() => router.push("/hire/login")}>
          Log in here
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #eee",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    background: "black",
    color: "white",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  linkText: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "blue",
    textDecoration: "underline",
    cursor: "pointer",
  },
};
