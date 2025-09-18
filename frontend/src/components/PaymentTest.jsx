// Create: components/PaymentTest.jsx (temporary test component)
import React, { useEffect } from 'react';
import { validateRazorpayConfig, formatAmount, loadRazorpayScript } from '../utils/razorpayUtils';

const PaymentTest = () => {
  useEffect(() => {
    console.log('🧪 Testing Razorpay Utils...');
    
    // Test 1: Configuration validation
    const configValid = validateRazorpayConfig();
    console.log('Config validation:', configValid);
    
    // Test 2: Amount formatting
    console.log('Amount format test:', formatAmount(1234.56));
    console.log('Amount format test (whole):', formatAmount(500));
    
    // Test 3: Script loading
    loadRazorpayScript().then(loaded => {
      console.log('Script loaded:', loaded);
    });
  }, []);

  return (
    <div className="p-4 bg-gray-100 m-4 rounded">
      <h3>Payment Utils Test</h3>
      <p>Check console for test results</p>
    </div>
  );
};

export default PaymentTest;
