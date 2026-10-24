
import { useState } from "react";

function Subscribe() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    console.log("Subscribe button clicked");

    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim()
        })
      });

      const data = await response.json();

      console.log("Backend response:", response.status, data);

      setMessage(
        data.message ||
          (response.ok
            ? "Request completed."
            : "Subscription failed. Please try again.")
      );

      if (response.ok) {
        setEmail("");
      }
    } catch (error) {
      console.error("Subscribe request failed:", error);
      setMessage(
        "Unable to connect to the newsletter server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="subscribe">
      <h2>Subscribe to DEV@Deakin</h2>

      <p>Get the latest articles and technology news in your inbox.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      <p className="subscribe-message" role="status">
        {message}
      </p>
    </section>
  );
}

export default Subscribe;
