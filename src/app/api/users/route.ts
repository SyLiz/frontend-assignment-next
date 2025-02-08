export async function GET() {
  const baseUrl = process.env.DATA_API_URL; //https://dummyjson.com

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const res = await fetch(baseUrl + "/users", {
    headers,
  });

  if (!res.ok) {
    // Handle any errors from the fetch
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return Response.json({ data });
}
