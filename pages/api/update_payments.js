import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { paymentId, newStatus } = req.body;
  if (!paymentId || !newStatus) return res.status(400).json({ error: "Missing parameters" });

  const { error } = await supabase
    .from("payments")
    .update({ status: newStatus })
    .eq("id", paymentId);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
