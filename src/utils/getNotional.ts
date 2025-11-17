export const getNotional = (
  price: string,
  currentPrice: string,
  quantity: string,
  type: "market" | "limit"
) => {
  const p =
    type === "market" && currentPrice ? parseFloat(currentPrice) : parseFloat(price) || 0
  const q = parseFloat(quantity) || 0
  return (p * q).toFixed(2)
}
