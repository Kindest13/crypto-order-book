export const normalizeOrders = (orders: [string, string][], limit: number) => {
  return orders
    .map(([price, qty]) => ({
      price: parseFloat(price),
      quantity: parseFloat(qty),
    }))
    .slice(0, limit)
    .sort((a, b) => b.price - a.price)
}
