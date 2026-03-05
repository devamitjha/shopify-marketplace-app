"use client";

async function retryOrder(id) {

  await fetch("/api/retry-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  });

  alert("Retry sent to queue");
}

export default function OrdersTable({ orders }) {

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Order</th>
          <th>Status</th>
          <th>Retry</th>
        </tr>
      </thead>

      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.order_number}</td>
            <td>{order.status}</td>

            <td>
              {order.status === "failed" && (
                <button onClick={() => retryOrder(order.id)}>
                  Retry
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}