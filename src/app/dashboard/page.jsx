"use client";

import Link from "next/link";

export default function Dashboard() {

  return (

    <div style={{ padding: 40 }}>

      <h1>Shopify ERP Integration</h1>

      <div style={{ marginTop: 20 }}>

        <Link href="/logs">
          View Order Logs
        </Link>

      </div>

    </div>

  );
}