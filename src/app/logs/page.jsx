"use client";

import { useEffect, useState } from "react";

export default function LogsPage() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {

  async function loadLogs() {

    try {

      const res = await fetch("/api/logs");

      const data = await res.json();

      setLogs(data);

    } catch (err) {

      console.error("Failed to load logs:", err);

    }

  }

  loadLogs();

}, []);

  return (

    <div style={{ padding: 40 }}>

      <h2>Order Sync Logs</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {logs.map(log => (

            <tr key={log.id}>

              <td>{log.order_id}</td>
              <td>{log.status}</td>
              <td>
                {new Date(log.created_at).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}