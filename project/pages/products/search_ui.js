import { useState } from 'react';
import checkAuth from '../../hooks/checkAuth';  
import styles from '../../styles/search_ui.module.css'; 

const Main = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);

  const user = checkAuth();

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
      alert('Please log in to add products to the cart');
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
    } else {
      alert('Failed to add product to cart');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (!user) {
      alert('Please log in to remove products from the cart');
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
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message); 
    } else {
      alert('Failed to remove product from cart');
    }
  };

  return (
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
                  <p>Price: ${product.PRODUCT_PRICE}</p>
                  <div className={styles.productButtons}>
                    <button onClick={() => handleAddToCart(product.PRODUCT_ID)}>Add to Cart</button>
                    <button onClick={() => handleRemoveFromCart(product.PRODUCT_ID)}>Delete from Cart</button>
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
  );
};

export default Main;
