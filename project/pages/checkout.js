import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';  
import Nav from '../components/nav';
import Footer from '../components/footer';
import styles from '../styles/checkout.module.css';
import checkAuth from '../hooks/checkAuth';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const user = checkAuth();
  const router = useRouter();

  // Fetch cart items
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const response = await fetch('/api/cart/read_by_firebase_uid', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firebase_uid: user.uid,
              idToken: user.accessToken,  
            }),
          });

          const data = await response.json();
          
          if (data && data.length > 0) {
            setCartItems(data);
            fetchProductDetails(data);
          } else {
            setCartItems([]);
          }

        } catch (error) {
          console.error('Error fetching cart:', error);
          setError('Failed to load cart items');
        }
      };

      fetchCart();
    }
  }, [user]);

  // fetch product details for cart items
  const fetchProductDetails = async (cartData) => {
    const productDetailsMap = {};

    for (let i = 0; i < cartData.length; i++) {
      const productId = cartData[i].PRODUCT_ID;
      const response = await fetch(`/api/products/read_by_id?id=${productId}`);
      const product = await response.json();

      if (product) {
        productDetailsMap[productId] = product;
      }
    }

    setProductDetails(productDetailsMap);
  };

  const handleProceedToPayment = async () => {
    const orderTotalAmount = calculateTotalPrice();
    
    const response = await fetch('/api/stripe/prepare_checkout_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebase_uid: user.uid,
        idToken: user.accessToken,
        cartItems: cartItems,
        ORDER_TOTAL_AMOUNT: parseFloat(orderTotalAmount),
        ORDER_SHIPPING_ADDRESS: address,
        phone: phoneNumber,
      }),
    });
  
    if (!response.ok) {
      console.error('Failed to prepare checkout');
      alert('Failed to prepare checkout');
      return;
    }
  
    const { sessionId } = await response.json();
  
    // Step 2: Redirect to Stripe Checkout
    const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    await stripe.redirectToCheckout({ sessionId });
  };
  
  // per item price
  const calculateItemTotalPrice = (productPrice, quantity) => {
    return (productPrice * quantity).toFixed(2);  // return as a formatted string
  };

  // grand total price
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = productDetails[item.PRODUCT_ID];
      if (product) {
        const itemTotal = calculateItemTotalPrice(product.PRODUCT_PRICE, item.CART_ITEM_QUANTITY);
        return total + parseFloat(itemTotal);  // add each item's total price
      }
      return total;
    }, 0).toFixed(2);  // return final total price as string
  };

  return (
    <>
      <Head>
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      <Nav />
      <main className={styles.mainContainer}>
        <div className={styles.formContainer}>
          {/* <h1 className={styles.formTitle}>Checkout</h1> */}

          {step === 1 && (
            <>
              <h2 className={styles.reviewTitle}>Review Order</h2>
                <div className={styles.orderList}>  
                  {cartItems.length > 0 ? (
                    cartItems.map((item, index) => {
                    
                      const product = productDetails[item.PRODUCT_ID];
                      if (!product) return null;

                      const totalItemPrice = calculateItemTotalPrice(product.PRODUCT_PRICE, item.CART_ITEM_QUANTITY);

                      return (
                        <div key={index} className={styles.orderItem}>
                          <div className={styles.itemName}>{product.PRODUCT_NAME}</div>
                          <div className={styles.itemPrice}>${product.PRODUCT_PRICE}</div>
                          <div className={styles.itemQty}>qt: {item.CART_ITEM_QUANTITY}</div>
                          <div className={styles.itemSubtotal}>${totalItemPrice}</div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ textAlign: 'center', padding: '50px' }} >loading cart...</p>
                  )}
                </div>
              <div className={styles.orderTotal}>
                <span>total:</span>
                <span className={styles.grandTotalPrice}> ${calculateTotalPrice()}</span>
              </div>
              <button className={styles.button} onClick={() => router.push('/user_cart')}>Go back to my cart 🛒</button>
              <button className={styles.button} onClick={() => setStep(2)}>Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className={styles.addressTitle}>Enter Address</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="address" className={styles.inputLabel}>Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phoneNumber" className={styles.inputLabel}>Phone number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <button className={styles.button} onClick={() => setStep(1)}>Back</button>
              <button className={styles.button} onClick={() => setStep(3)}>Next</button>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className={styles.confirmationTitle}>Confirm your details</h2>
              <div className={styles.confirmationDetails}>
                <p><strong>Address:</strong> {address}</p>
                <p><strong>Phone number:</strong> {phoneNumber}</p>
              </div>
              <button className={styles.button} onClick={() => setStep(2)}>Back</button>
              <button className={styles.button} onClick={handleProceedToPayment}>Proceed to payment</button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
