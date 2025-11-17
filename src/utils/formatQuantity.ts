export const formatQuantity = (quantity: number) => {
  return quantity.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}
