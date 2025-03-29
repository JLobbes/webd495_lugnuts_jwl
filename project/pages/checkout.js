import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

  // fetch the items in the cart
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        const response = await fetch(`../api/cart/read_by_firebase_uid?firebase_uid=${user.uid}`);
        const data = await response.json();

        if (data && data.length > 0) {
          setCartItems(data);
          fetchProductDetails(data); 
        } else {
          setCartItems([]);  // empty cart
        }
        setLoading(false);  
      };
      fetchCart();
    }
  }, [user]);

  // fetch product details based on the cart items
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

  const handleProceedToPayment = () => {
    router.push('/payment');
  };

  // calculate total price for each item (price * quantity)
  const calculateItemTotalPrice = (productPrice, quantity) => {
    return (productPrice * quantity).toFixed(2);  // return as a formatted string
  };

  // calculate total price for all items in the cart
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
      <Nav />
      <main className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>checkout</h1>

          {step === 1 && (
            <>
              <h2 className={styles.reviewTitle}>review order</h2>
              {loading ? (
                <p>loading order...</p>  
              ) : (
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
                    <p>no items in your cart.</p>  
                  )}
                </div>
              )}
              <div className={styles.orderTotal}>
                <span>total:</span>
                <span className={styles.grandTotalPrice}> ${calculateTotalPrice()}</span>
              </div>
              <button className={styles.button} onClick={() => router.push('/user_cart')}>back to cart</button>
              <button className={styles.button} onClick={() => setStep(2)}>next</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className={styles.addressTitle}>enter address</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="address" className={styles.inputLabel}>address</label>
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
                <label htmlFor="phoneNumber" className={styles.inputLabel}>phone number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <button className={styles.button} onClick={() => setStep(1)}>back</button>
              <button className={styles.button} onClick={() => setStep(3)}>next</button>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className={styles.confirmationTitle}>confirm your details</h2>
              <div className={styles.confirmationDetails}>
                <p><strong>address:</strong> {address}</p>
                <p><strong>phone number:</strong> {phoneNumber}</p>
              </div>
              <button className={styles.button} onClick={() => setStep(2)}>back</button>
              <button className={styles.button} onClick={handleProceedToPayment}>proceed to payment</button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
