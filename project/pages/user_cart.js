import { useState, useEffect } from 'react';
import checkAuth from '../hooks/checkAuth';  
import Nav from '../components/nav'; 
import Footer from '../components/footer'; 
import styles from '../styles/user_cart.module.css'; 
import Link from 'next/link';  // Import Link component from next/link

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = checkAuth();

  // Fetch cart items
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        const response = await fetch(`../api/cart/read_by_firebase_uid?firebase_uid=${user.uid}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCartItems(data);
          fetchProductDetails(data);
        } else {
          setCartItems([]);
          setLoading(false);
        }
      };
      fetchCart();
    }
  }, [user]);

  // Fetch product details for each item in the cart
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
    setLoading(false);
  };

  const handleRemoveFromCart = async (productId) => {
    if (!user) {
      alert('Please log in to remove products');
      return;
    }

    const firebaseUid = user.uid;

    const response = await fetch('/api/cart/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebase_uid: firebaseUid,
        product_id: productId,
        removeComplete: true, 
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message); 
      setCartItems(prev => prev.filter(item => item.PRODUCT_ID !== productId)); // Remove item from state
      setProductDetails(prev => {
        const updated = { ...prev };
        delete updated[productId]; // Remove product details as well
        return updated;
      });
    } else {
      alert('Failed to remove product from cart');
    }
  };

  const increaseQuantity = async (productId) => {
    if (!user) {
      alert('Please log in to update the cart');
      return;
    }

    const firebaseUid = user.uid; 
    const quantity = 1;

    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebase_uid: firebaseUid,
        product_id: productId,
        quantity: quantity,
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message); 
      setCartItems(prev => prev.map(item => 
        item.PRODUCT_ID === productId ? { ...item, CART_ITEM_QUANTITY: item.CART_ITEM_QUANTITY + quantity } : item
      ));
    } else {
      alert('Failed to increase product quantity');
    }
  };

  const decreaseQuantity = async (productId) => {
    if (!user) {
      alert('Please log in to update the cart');
      return;
    }

    const firebaseUid = user.uid;

    const response = await fetch('/api/cart/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebase_uid: firebaseUid,
        product_id: productId,
        removeComplete: false, 
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message); 
      setCartItems(prev => prev.map(item => 
        item.PRODUCT_ID === productId && item.CART_ITEM_QUANTITY > 1
          ? { ...item, CART_ITEM_QUANTITY: item.CART_ITEM_QUANTITY - 1 }
          : item
      ));
    } else {
      alert('Failed to decrease product quantity');
    }
  };

  return (
    <>
      <Nav /> {/* Render the Nav bar */}
      <main className={styles.mainContainer}>
        <h1>Your Cart</h1>
        {loading ? (
          <p>Loading cart...</p>
        ) : (
          <div className={styles.resultsContainer}>
            {cartItems.length > 0 ? (
              <div className={styles.productList}>
                {cartItems.map((item) => {
                  const product = productDetails[item.PRODUCT_ID];

                  if (!product) return null; // Ensure product details are fetched before rendering the item

                  return (
                    <div key={item.PRODUCT_ID} className={styles.productTile}>
                      <div className={styles.productImageContainer}>
                        <img
                          src={product.PRODUCT_IMAGE_URL}
                          alt={product.PRODUCT_NAME}
                          className={styles.productImage}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <h3>{product.PRODUCT_NAME}</h3>
                        <p>{product.PRODUCT_DESCRIPTION.slice(0, 100)}...</p>
                        <p>Price: ${product.PRODUCT_PRICE}</p>
                        <div className={styles.productButtons}>
                          <span>{item.CART_ITEM_QUANTITY} in cart</span>
                          <button onClick={() => decreaseQuantity(item.PRODUCT_ID)}>-</button>
                          <button onClick={() => increaseQuantity(item.PRODUCT_ID)}>+</button>
                          <button onClick={() => handleRemoveFromCart(item.PRODUCT_ID)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
        )}
        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <div className={styles.checkoutButtonContainer}>
            <Link href="/checkout">
              <button className={styles.checkoutButton}>Proceed to Checkout</button>
            </Link>
          </div>
        )}
      </main>
      <Footer /> {/* Render the Footer */}
    </>
  );
};

export default UserCart;
