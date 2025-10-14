import { useEffect, useState } from "react";

export default function AdminPage() {
  const [payments, setPayments] = useState([]);

  async function loadPayments() {
    const res = await fetch("/api/get-payments");
    const data = await res.json();
    if (data.payments) setPayments(data.payments);
  }

  async function updatePayment(id, status) {
    await fetch("/api/update-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: id, newStatus: status }),
    });
    loadPayments();
  }

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard — LawBot Pakistan</h1>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Proof</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.user_id}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
              <td>
                <a href={p.payment_proof_url} target="_blank" rel="noreferrer">
                  View
                </a>
              </td>
              <td>
                <button onClick={() => updatePayment(p.id, "approved")}>Approve</button>
                <button onClick={() => updatePayment(p.id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
