
require("dotenv").config();

const express = require("express");
const brevo = require("@getbrevo/brevo");

const app = express();
const PORT = 3000;

app.use(express.json());

// Log every incoming request
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

const apiInstance = new brevo.BrevoClient({
  apiKey: process.env.BREVO_API_KEY
});

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Newsletter backend is running!");
});

// Newsletter subscription
app.post("/subscribe", async (req, res) => {
  const email = req.body?.email;

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    console.log("Status Code: 400");
    console.log("Invalid email address");

    return res.status(400).json({
      message: "Please enter a valid email address."
    });
  }

  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
    console.log("Status Code: 500");
    console.log("Brevo configuration is missing");

    return res.status(500).json({
      message: "Newsletter service is not configured correctly."
    });
  }

  console.log("New subscriber:", email.trim());

  const sendSmtpEmail = {
    to: [{ email: email.trim() }],
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: "DEV@Deakin"
    },
    subject: "Welcome to DEV@Deakin!",
    textContent: "Thanks for subscribing to our newsletter."
  };

  try {
    const response =
      await apiInstance.transactionalEmails.sendTransacEmail(sendSmtpEmail);

    console.log("Brevo response:", JSON.stringify(response));
    console.log("Status: 202 Accepted - Brevo accepted the request");

    return res.status(202).json({
      message: "Successfully subscribed!"
    });
  } catch (error) {
    console.error(
      "Error sending email:",
      error?.response?.body || error?.message || error
    );

    console.log(
      "Status Code:",
      error?.statusCode || error?.response?.status || 500
    );

    return res.status(500).json({
      message: "Unable to subscribe right now. Please try again later."
    });
  }
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Waiting for subscribers...");
});

server.on("close", () => {
  console.log("Server stopped.");
});

server.on("error", (error) => {
  console.error("Server error:", error);
});
