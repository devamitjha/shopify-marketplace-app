import axios from "axios";
import qs from "qs";

let cachedToken = null;
let tokenExpiry = 0;

export async function getMarketplaceToken() {

  const now = Date.now();

  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const data = qs.stringify({
    username: process.env.MARKETPLACE_USERNAME,
    password: process.env.MARKETPLACE_PASSWORD,
    grant_type: "password",
    client_id: "api_access",
    scope: "openid offline_access"
  });

  const response = await axios.post(
    "https://lucira.uat.ornaverse.in/connect/token",
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  console.log("Token received");

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000);

  return cachedToken;
}