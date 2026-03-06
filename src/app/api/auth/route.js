import crypto from "crypto";

export async function GET(req) {

  const shop = req.nextUrl.searchParams.get("shop");

  const apiKey = process.env.SHOPIFY_API_KEY;

  const redirectUri = "https://lucirajewelry.cloud/api/auth/callback";

  const scopes = "read_orders";

  const state = crypto.randomBytes(16).toString("hex");

  const installUrl = `https://${shop}/admin/oauth/authorize
  ?client_id=${apiKey}
  &scope=${scopes}
  &redirect_uri=${redirectUri}
  &state=${state}`;

  return Response.redirect(installUrl);
}