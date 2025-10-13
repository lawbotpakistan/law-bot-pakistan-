import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      const { data, error } = await supabase.from("payments").select("*");
      if (!error) setPayments(data);
      setLoading(false);
    }
    fetchPayments();
  }, []);

  async function approvePayment(id) {
    await supabase.from("payments").update({ status: "approved" }).eq("id", id);
    alert("✅ Payment approved!");
    window.location.reload();
  }

  async function rejectPayment(id) {
    await supabase.from("payments").update({ status: "rejected" }).eq("id", id);
    alert("❌ Payment rejected!");
    window.location.reload();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>🧑‍⚖️ LawBot Admin Dashboard</h1>
      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        payments.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: 10 }}>
            <p><b>Name:</b> {p.payer_name}</p>
            <p><b>Ref:</b> {p.payer_ref}</p>
            <p><b>Status:</b> {p.status}</p>
            <p><b>Amount:</b> Rs {p.amount}</p>
            {p.file_url && <a href={p.file_url} target="_blank">📎 View Screenshot</a>}
            <br />
            {p.status === "pending" && (
              <>
                <button onClick={() => approvePayment(p.id)}>✅ Approve</button>
                <button onClick={() => rejectPayment(p.id)} style={{ marginLeft: 10 }}>
                  ❌ Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
