import axios from "axios";

// Retrieve Backend URL from .env file
const VNPAY_URL = "http://localhost:5000/api/vnpay";

// Function to create VNPay payment
export const createVNPayPayment = async (amount, orderInfo, returnUrl) => {
  try {
    const response = await axios.get(`${VNPAY_URL}/payment`, {
      params: {
        amount,
        orderInfo,
        returnUrl,
      },
    });

    return response.data.paymentUrl;
  } catch (error) {
    console.error("Error creating VNPay payment", error);
    throw error;
  }
};

// Function to handle VNPay payment return
export const handleVNPayPaymentReturn = async (requestParams) => {
  try {
    const response = await axios.get(`${VNPAY_URL}/paymentReturn`, {
      params: requestParams,
    });

    return response.data;
  } catch (error) {
    console.error("Error handling VNPay payment return", error);
    throw error;
  }
};
