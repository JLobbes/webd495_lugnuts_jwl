import { useState, useEffect } from 'react';
import styles from '../styles/admin_ui.module.css'; 
import Nav from '../components/nav';  
import Footer from '../components/footer';  
import checkAuth from '../hooks/checkAuth';  

const checkRole = async (firebase_uid, accessToken) => {
  try {
    const response = await fetch('/api/users/read_role', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ 
        firebase_uid: firebase_uid, 
        idToken: accessToken
      }),
    });
    const data = await response.json();
    const role = data[0].USER_ROLE
    return role;  // Returns the role, e.g., 'admin' or 'user'
  } catch (error) {
    console.error("Error checking role:", error);
    return null;  // Handle the case where role couldn't be fetched
  }
};

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    PRODUCT_NAME: '',
    PRODUCT_DESCRIPTION: '',
    PRODUCT_PRICE: '',
    PRODUCT_CATEGORY: '',
    PRODUCT_IMAGE_URL: '',
    PRODUCT_STOCK: '',
  });

  const [loading, setLoading] = useState(true);  
  const [user, setUser] = useState(null);  
  const [isAdmin, setIsAdmin] = useState(false);  // Keep track of whether user is admin

  const authUser = checkAuth();  

  useEffect(() => {
    const fetchRoleAndProducts = async () => {
      if (authUser) {
        const role = await checkRole(authUser.uid, authUser.accessToken);
        setIsAdmin(role === 'admin');  // Set isAdmin state based on the role
        setUser(authUser);
        fetchProducts(); // Fetch products if user is logged in
      } else {
        setLoading(false); // Stop loading if not authenticated
      }
    };
    
    fetchRoleAndProducts(); // Call the async function
  }, [authUser]); // Dependency array ensures this runs when authUser changes

  // Fetch products only when the user is authenticated
  const fetchProducts = async () => {
    const response = await fetch('/api/products/read_all');
    const data = await response.json();
    setProducts(data);
    setLoading(false); // Stop loading once data is fetched
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.PRODUCT_NAME || !newProduct.PRODUCT_PRICE || !newProduct.PRODUCT_DESCRIPTION) {
      alert("Please fill in all required fields.");
      return;
    }

    const response = await fetch('/api/products/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          firebase_uid: user.uid, 
          idToken: user.accessToken,
          newProduct: {...newProduct}
         }
      ),
    });

    const data = await response.json();
    console.log('data:', data);
    if (data.message === 'Product created') {
      setProducts([...products, data.product]);
      setNewProduct({
        PRODUCT_NAME: '',
        PRODUCT_DESCRIPTION: '',
        PRODUCT_PRICE: '',
        PRODUCT_CATEGORY: '',
        PRODUCT_IMAGE_URL: '',
        PRODUCT_STOCK: '',
      });
    } else {
      alert("Failed to add product. Please try again.");
    }
  };

  const handleEditProduct = async (productId) => {
    const response = await fetch(`/api/products/read_by_id?id=${productId}`);
    const data = await response.json();
    if (data) {
      setEditProduct(data);
    } else {
      console.error("Error setting Product");
    }
  };

  const handleSaveEditedProduct = async (e) => {
    e.preventDefault();

    if (!editProduct.PRODUCT_ID) {
      console.error("Product ID is missing!");
      return;
    }

    if (!editProduct.PRODUCT_NAME || !editProduct.PRODUCT_PRICE || !editProduct.PRODUCT_DESCRIPTION) {
      alert("Please fill in all required fields.");
      return;
    }

    const response = await fetch('/api/products/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          firebase_uid: user.uid, 
          idToken: user.accessToken,
          editProduct: {...editProduct}
         }
      ),
    });

    if (response.status === 200) {
      const updatedResponse = await fetch('/api/products/read_all');
      const updatedProducts = await updatedResponse.json();
      setProducts(updatedProducts);
      setEditProduct(null);
    } else {
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    const response = await fetch('/api/products/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          firebase_uid: user.uid, 
          idToken: user.accessToken,
          id: productId
         }
      ),
    });

    const data = await response.json();
    if (data.success) {
      setProducts(products.filter(p => p.PRODUCT_ID !== productId));
    } else {
      alert("Failed to delete product. Please try again.");
    }
  };

  // if (loading) {
  //   return <div className={styles.loadingOverlay}>
  //     <div className={styles.spinner}></div>
  //   </div>;
  // }

  if (!isAdmin) {
    return <div>Checking to verify your admin rights.</div>;  // Show message if not authenticated
  }

  return (
    <>
      <Nav />

      <main className={styles.mainContainer}>
        <h1>Admin Product Management</h1>

        {/* Add Product Form */}
        <div className={styles.formContainer}>
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.PRODUCT_NAME}
              onChange={(e) => setNewProduct({ ...newProduct, PRODUCT_NAME: e.target.value })}
              className={styles.formInput}
            />
            <textarea
              placeholder="Product Description"
              value={newProduct.PRODUCT_DESCRIPTION}
              onChange={(e) => setNewProduct({ ...newProduct, PRODUCT_DESCRIPTION: e.target.value })}
              className={styles.formTextarea}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.PRODUCT_PRICE}
              onChange={(e) => setNewProduct({ ...newProduct, PRODUCT_PRICE: e.target.value })}
              className={styles.formInput}
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.PRODUCT_CATEGORY}
              onChange={(e) => setNewProduct({ ...newProduct, PRODUCT_CATEGORY: e.target.value })}
              className={styles.formInput}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.PRODUCT_IMAGE_URL}
              onChange={(e) => setNewProduct({ ...newProduct, PRODUCT_IMAGE_URL: e.target.value })}
              className={styles.formInput}
            />
            <input
              type="number"
              placeholder="Stock Level"
              value={newProduct.PRODUCT_STOCK}
              onChange={(e) => setNewProduct({ ...newProduct, PRODUCT_STOCK: e.target.value })}
              className={styles.formInput}
            />
            <button type="submit" className={styles.formButton}>Add Product</button>
          </form>
        </div>

        {/* Edit Product Form */}
        {editProduct && (
          <div className={styles.formContainer}>
            <h2>Edit Product</h2>
            <form onSubmit={handleSaveEditedProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={editProduct.PRODUCT_NAME}
                onChange={(e) => setEditProduct({ ...editProduct, PRODUCT_NAME: e.target.value })}
                className={styles.formInput}
              />
              <textarea
                placeholder="Product Description"
                value={editProduct.PRODUCT_DESCRIPTION}
                onChange={(e) => setEditProduct({ ...editProduct, PRODUCT_DESCRIPTION: e.target.value })}
                className={styles.formTextarea}
              />
              <input
                type="number"
                placeholder="Price"
                value={editProduct.PRODUCT_PRICE}
                onChange={(e) => setEditProduct({ ...editProduct, PRODUCT_PRICE: e.target.value })}
                className={styles.formInput}
              />
              <input
                type="text"
                placeholder="Category"
                value={editProduct.PRODUCT_CATEGORY}
                onChange={(e) => setEditProduct({ ...editProduct, PRODUCT_CATEGORY: e.target.value })}
                className={styles.formInput}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editProduct.PRODUCT_IMAGE_URL}
                onChange={(e) => setEditProduct({ ...editProduct, PRODUCT_IMAGE_URL: e.target.value })}
                className={styles.formInput}
              />
              <input
                type="number"
                placeholder="Stock Level"
                value={editProduct.PRODUCT_STOCK}
                onChange={(e) => setEditProduct({ ...editProduct, PRODUCT_STOCK: e.target.value })}
                className={styles.formInput}
              />
              <button type="submit" className={styles.formButton}>Save Changes</button>
            </form>
          </div>
        )}

        {/* Display Products */}
        <div className={styles.resultsContainer}>
          <h2>Product List</h2>
          <div className={styles.productList}>
            {products.map((product) => (
              <div key={product.PRODUCT_ID} className={styles.productTile}>
                <div className={styles.productImageContainer}>
                  <img
                    src={product.PRODUCT_IMAGE_URL}
                    alt={product.PRODUCT_NAME}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.PRODUCT_NAME}</h3>
                  <p>{product.PRODUCT_DESCRIPTION}</p>
                  <p>Price: ${product.PRODUCT_PRICE}</p>
                  <p>Stock Level: {product.PRODUCT_STOCK}</p>
                  <button onClick={() => handleEditProduct(product.PRODUCT_ID)} className={styles.formButton}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.PRODUCT_ID)} className={styles.formButton}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminPage;
