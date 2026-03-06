import axios from "axios";

export async function GET(req) {

  const { shop, code } = Object.fromEntries(req.nextUrl.searchParams);

  const response = await axios.post(
    `https://${shop}/admin/oauth/access_token`,
    {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code
    }
  );

  const accessToken = response.data.access_token;

  console.log("Access token:", accessToken);

  return Response.redirect(`/dashboard?shop=${shop}`);
}