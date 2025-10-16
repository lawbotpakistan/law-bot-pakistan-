<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LawBot Admin Dashboard ⚖️</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 20px;
    }
    h1 {
      color: #007bff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: white;
    }
    th, td {
      padding: 12px;
      border: 1px solid #ccc;
      text-align: center;
    }
    th {
      background: #007bff;
      color: white;
    }
    button {
      padding: 6px 12px;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: 4px;
    }
    .approve { background-color: #28a745; }
    .reject { background-color: #dc3545; }
  </style>
</head>
<body>
  <h1>LawBot Admin Dashboard ⚖️</h1>
  <table id="paymentsTable">
    <thead>
      <tr>
        <th>User Email</th>
        <th>Status</th>
        <th>Screenshot</th>
        <th>Approve</th>
        <th>Reject</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <script type="module">
    import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

    const SUPABASE_URL = "https://iyakobcjerlwvcjvttwh.supabase.co";
    const SERVICE_KEY = "<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5YWtvYmNqZXJsd3ZjanZ0dHdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzNTc5MSwiZXhwIjoyMDc1NTExNzkxfQ.8lqZYWvjWHh9EsOOueIgegSOWFRzDS1Qsv8xOuwDGNk>"; // ⚠️ keep private later (Vercel env var)
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    async function loadPayments() {
      const { data, error } = await supabase
        .from("payments")
        .select("id, status, file_url, user_id, profiles(email)");

      if (error) {
        alert("Error loading payments: " + error.message);
        return;
      }

      const tbody = document.querySelector("#paymentsTable tbody");
      tbody.innerHTML = "";

      data.forEach((p) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${p.profiles?.email || "Unknown"}</td>
          <td>${p.status}</td>
          <td><a href="${p.file_url}" target="_blank">View</a></td>
          <td><button class="approve" onclick="updateStatus('${p.id}', 'approved')">Approve</button></td>
          <td><button class="reject" onclick="updateStatus('${p.id}', 'rejected')">Reject</button></td>
        `;
        tbody.appendChild(row);
      });
    }

    window.updateStatus = async function (id, status) {
      const { error } = await supabase.from("payments").update({ status }).eq("id", id);
      if (error) alert("Failed: " + error.message);
      else {
        alert("✅ Updated to " + status);
        loadPayments();
      }
    };

    loadPayments();
  </script>
</body>
</html>
