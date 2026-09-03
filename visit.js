export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return res.status(500).json({
      error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    });
  }

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json"
  };

  try {
    let response;

    if (req.method === "POST") {
      response = await fetch(`${url}/rest/v1/rpc/increment_site_visit`, {
        method: "POST",
        headers,
        body: "{}"
      });
    } else if (req.method === "GET") {
      response = await fetch(
        `${url}/rest/v1/site_stats?id=eq.1&select=total_visits`,
        { method: "GET", headers: { ...headers, Prefer: "return=representation" } }
      );
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const text = await response.text();
    if (!response.ok) {
      return res.status(500).json({
        error: "Supabase request failed",
        detail: text
      });
    }

    const data = text ? JSON.parse(text) : null;
    const total = req.method === "POST"
      ? Number(data)
      : Number(data?.[0]?.total_visits || 0);

    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({
      error: "Visitor counter failed",
      detail: error.message
    });
  }
}
