import { useState, useEffect } from 'react';
import checkAuth from '../hooks/checkAuth';  
import styles from '../styles/product_search.module.css'; 
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useRouter } from 'next/router';

const Main = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [cartItems, setCartItems] = useState({});  
  
  const router = useRouter();
  const user = checkAuth();

  useEffect(() => {
    if (router.query.query) {
      setQuery(router.query.query);
    }
  }, [router.query]);
  
  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  // fetch cart items if user is logged in
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
            const cartData = {};
            data.forEach(item => {
              cartData[item.PRODUCT_ID] = item.CART_ITEM_QUANTITY;
            });
            setCartItems(cartData);
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

  const handleSearch = async () => {
    const response = await fetch(`/api/products/search?query=${query}`);
    const data = await response.json();
    setProducts(data);
  };

  const handleExpandProduct = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('please log in to add products');
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
      // update cart state after adding item
      setCartItems(prev => ({ ...prev, [productId]: (prev[productId] || 0) + quantity }));
    } else {
      alert('failed to add product to cart');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (!user) {
      alert('please log in to remove products');
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
        removeComplete: true,  // remove completely
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message); 
      // update cart state after removing item
      setCartItems(prev => {
        const updated = { ...prev };
        delete updated[productId];  // remove item from cart
        return updated;
      });
    } else {
      alert('failed to remove product from cart');
    }
  };

  const increaseQuantity = async (productId) => {
    if (!user) {
      alert('please log in to update the cart');
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
      // update cart state after increasing quantity
      setCartItems(prev => ({ ...prev, [productId]: (prev[productId] || 0) + quantity }));
    } else {
      alert('failed to increase product quantity');
    }
  };

  const decreaseQuantity = async (productId) => {
    if (!user) {
      alert('please log in to update the cart');
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
        removeComplete: false,  // just decrease quantity
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message); 
      // update cart state after decreasing quantity
      setCartItems(prev => {
        const updated = { ...prev };
        if (updated[productId] > 1) {
          updated[productId] -= 1;
        } else {
          delete updated[productId];  // remove item if quantity is 0
        }
        return updated;
      });
    } else {
      alert('failed to decrease product quantity');
    }
  };

  return (
    <>
      <Nav />
      <main className="main-container">
        <h1>Search Products</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className={styles.resultsContainer}>
          <h2>Results</h2>
          {products.length > 0 ? (
            <div className={styles.productList}>
              {products.map((product) => (
                <div
                  key={product.PRODUCT_ID}
                  className={`${styles.productTile} ${expandedProduct === product.PRODUCT_ID ? styles.productTileExpanded : ''}`}
                  onClick={() => handleExpandProduct(product.PRODUCT_ID)}
                >
                  <div className={styles.productImageContainer}>
                    <img
                      src={product.PRODUCT_IMAGE_URL}
                      alt={product.PRODUCT_NAME}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.PRODUCT_NAME}</h3>
                    <p className={styles.productDescription}>
                      {expandedProduct === product.PRODUCT_ID
                        ? product.PRODUCT_DESCRIPTION
                        : product.PRODUCT_DESCRIPTION.slice(0, 100) + '...'}
                    </p>
                    <p>Stock: {product.PRODUCT_STOCK}</p>
                    <p>Price: ${product.PRODUCT_PRICE}</p>
                    <div className={styles.productButtons}>
                      {cartItems[product.PRODUCT_ID] ? (
                        <>
                          <span>{cartItems[product.PRODUCT_ID]} in cart</span>
                          <button onClick={() => handleRemoveFromCart(product.PRODUCT_ID)}>Remove from Cart</button>
                          <button onClick={() => decreaseQuantity(product.PRODUCT_ID)}>-</button>
                          <button onClick={() => increaseQuantity(product.PRODUCT_ID)}>+</button>
                        </>
                      ) : (
                        <button onClick={() => handleAddToCart(product.PRODUCT_ID)}>Add to Cart</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No products found</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Main;
