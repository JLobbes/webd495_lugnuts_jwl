import { useState } from 'react';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`/api/products/search?query=${query}`);
    const data = await response.json();
    setProducts(data);
  };

  return (
    <div>
      <h1>Search Products</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div>
        <h2>Results</h2>
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product.PRODUCT_ID}>
                <h3>{product.PRODUCT_NAME}</h3>
                <p>{product.PRODUCT_DESCRIPTION}</p>
                <p>Price: ${product.PRODUCT_PRICE}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}
