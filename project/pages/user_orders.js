import { useEffect, useState } from 'react';
import checkAuth from '../hooks/checkAuth';
import Nav from '../components/nav';
import Footer from '../components/footer';
import styles from '../styles/user_orders.module.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = checkAuth();

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/orders/read_by_firebase_uid', {
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
          console.log('data:', data);
          setOrders(data || []);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user]);

  if(!user) return <>
    <p style={{ textAlign: 'center', padding: '50px' }}>Must be signed in to view page</p>
  </>

  return (
    <>
      <Nav />
      <main className={styles.mainContainer}>
        <h1>Your Orders</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>You have no orders.</p>
        ) : (
          <div className={styles.resultsContainer}>
            {orders.map(order => (
              <div key={order.ORDER_ID} className={styles.orderTile}>
                <div style={{ flex: 1 }}>
                  <h3 className={styles.orderHeader}>
                    Order &rarr; ABC{order.ORDER_ID.toString().padStart(9, '0')}
                  </h3>
                  <p>Status: {order.ORDER_STATUS}</p>
                  <p>Placed on: {new Date(order.ORDER_DATE).toLocaleString()}</p>
                  <p>
                    Payment: {order.TRANSACTION_PAYMENT_STATUS} on{' '}
                    {new Date(order.TRANSACTION_PAYMENT_DATE).toLocaleString()}
                  </p>
                  <p>Shipping to: {order.ORDER_SHIPPING_ADDRESS}</p>
                </div>

                <div className={styles.itemsTable}>
                  {order.items.map((product) => {
                    const subtotal = ((Number(product.PRODUCT_PRICE) * Number(product.ORDER_ITEM_QUANTITY)).toFixed(2));
                    return (
                      <div key={product.PRODUCT_ID} className={styles.itemRow}>
                        <span className={styles.productName}>{product.PRODUCT_NAME}</span>
                        <span>Qt: {product.ORDER_ITEM_QUANTITY}</span>
                        <span>Price: ${product.PRODUCT_PRICE}</span>
                        <span>Subtotal: ${subtotal}</span>
                      </div>
                    );
                  })}
                  <div className={styles.totalRow}>
                    Order Total: ${order.ORDER_TOTAL_AMOUNT}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default UserOrders;
