// pages/transactions/success.js
import React from 'react';
const SuccessPage = () => {

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Payment Successful!</h1>
      <p>Your payment has been processed successfully. Thank you for your purchase!</p>
      <p>View
        &nbsp; 
        <a href='/user_orders' 
          style={{ color: '#0070f3', textDecoration: 'underline', cursor: 'pointer' }}>
          order details
        </a>
        &nbsp;
        or 
        &nbsp;
        <a href='/' 
          style={{ color: '#0070f3', textDecoration: 'underline', cursor: 'pointer' }}>
          return to home
        </a>
        .
      </p>

    </div>
  );
};

export default SuccessPage;
