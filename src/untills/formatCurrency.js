export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "0 VNĐ";
  }

  
  return amount.toLocaleString("vi-VN") + " VNĐ";
};
