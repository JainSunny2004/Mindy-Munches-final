// utils/priceUtils.js
export const formatPrice = (price) => {
  const numPrice = Number(price);
  if (isNaN(numPrice) || !price) {
    console.log('Invalid price:', price, typeof price);
    return '₹0';
  }
  
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

export const formatPriceForRazorpay = (price) => {
  // Razorpay expects amount in paise (multiply by 100)
  const numPrice = Number(price);
  return Math.round(numPrice * 100);
};

export const formatPriceFromRazorpay = (priceInPaise) => {
  // Convert from paise to rupees (divide by 100)
  return Number(priceInPaise) / 100;
};
