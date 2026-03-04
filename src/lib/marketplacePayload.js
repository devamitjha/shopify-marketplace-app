export function buildMarketplacePayload(order) {

  return {
    channel: 4,
    order: {

      order_id: order.id,
      order_no: order.order_number,
      status: order.financial_status,

      customer: {
        id: order.customer?.id,
        first_name: order.customer?.first_name,
        last_name: order.customer?.last_name,
        email: order.customer?.email,
        phone: order.customer?.phone,
        currency: "INR",
        state: "enabled",
        verified_email: true,
        tax_exempt: false
      },

      shipping_address: order.shipping_address,
      billing_address: order.billing_address,

      items: order.line_items?.map(item => ({
        line_item_id: item.id,
        sku: item.sku || "",
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        product_id: item.product_id
      })),

      created_date: new Date().toISOString()
    }
  };
}