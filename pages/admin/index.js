import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminPanel() {
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    fetchPayments();
  }, []);

  async function fetchPayments() {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("status", "pending");
    if (error) alert(error.message);
    else setPayments(data);
  }

  async function updatePayment(id, action) {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    const resp = await fetch("/api/admin/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentId: id,
        newStatus: action,
        adminReason: action === "rejected" ? "Rejected manually" : null,
      }),
    });
    const j = await resp.json();
    if (j.ok) {
      alert("Done!");
      fetchPayments();
    } else alert(j.error || "Error");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>👑 Admin Panel</h2>
      <p>{user ? `Logged in: ${user.email}` : "Not logged in"}</p>
      <hr />
      {payments.length === 0 ? (
        <p>No pending payments</p>
      ) : (
        payments.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <p>
              <b>{p.payer_name}</b> — Rs.{p.amount}
            </p>
            <p>Ref: {p.payer_ref}</p>
            <a href={p.file_url} target="_blank">View Screenshot</a>
            <div style={{ marginTop: 10 }}>
              <button onClick={() => updatePayment(p.id, "approved")}>✅ Approve</button>
              <button onClick={() => updatePayment(p.id, "rejected")} style={{ marginLeft: 10 }}>❌ Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
