import axios from "axios";

export async function sendOrderToMarketplace(payload, token) {

  try {

    console.log("Sending payload to Marketplace:");
    console.log(JSON.stringify(payload, null, 2));

    const response = await axios.post(
      "https://lucira.live.ornaverse.in/Services/MarketPlace/Order/Generate",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        timeout: 20000
      }
    );

    console.log("Marketplace SUCCESS:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;

  } catch (error) {

    console.log("Marketplace API ERROR");

    if (error.response) {

      console.log("Status:", error.response.status);
      console.log(
        "Response:",
        JSON.stringify(error.response.data, null, 2)
      );

    } else if (error.request) {

      console.log("No response received from server");

    } else {

      console.log("Error:", error.message);

    }

    throw error;
  }
}