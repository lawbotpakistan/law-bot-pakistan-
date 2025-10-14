// pages/api/admin/approve.js
export const config = { runtime: "nodejs" };

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const { data: userData, error: userErr } = await supabaseClient.auth.getUser(token);
    if (userErr || !userData?.user) return res.status(401).json({ error: "Invalid token" });
    const user = userData.user;

    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    if (profileErr) return res.status(500).json({ error: "Failed to load profile" });
    if (!profile?.is_admin) return res.status(403).json({ error: "Not admin" });

    const { paymentId, newStatus, adminReason } = req.body;
    if (!paymentId || !["approved", "rejected"].includes(newStatus)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const { error: updateErr } = await supabaseAdmin
      .from("payments")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        admin_reason: adminReason || null,
        processed_by: user.id
      })
      .eq("id", paymentId);

    if (updateErr) return res.status(500).json({ error: updateErr.message });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("admin/approve error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
