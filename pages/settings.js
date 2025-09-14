import Layout from "@/components/Layout";
import {useState, useEffect} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function SettingsPage({swal}) {
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [shippingPrice, setShippingPrice] = useState(5);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  function fetchProducts() {
    axios.get('/api/products').then(result => {
      setProducts(result.data);
    });
  }

  function fetchSettings() {
    axios.get('/api/settings').then(result => {
      if (result.data.featuredProductId) {
        setFeaturedProductId(result.data.featuredProductId);
      }
      if (result.data.shippingPrice) {
        setShippingPrice(result.data.shippingPrice);
      }
    });
  }

  async function saveSettings(ev) {
    ev.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('/api/settings', {
        featuredProductId,
        shippingPrice,
      });
      
      swal.fire({
        title: 'Success!',
        text: 'Settings saved successfully',
        icon: 'success',
      });
    } catch (error) {
      swal.fire({
        title: 'Error!',
        text: 'Failed to save settings',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Settings</h1>
      <form onSubmit={saveSettings} className="max-w-md">
        <label>Featured product</label>
        <select 
          value={featuredProductId}
          onChange={ev => setFeaturedProductId(ev.target.value)}
        >
          <option value="">Select a product</option>
          {products.length > 0 && products.map(product => (
            <option key={product._id} value={product._id}>
              {product.title}
            </option>
          ))}
        </select>
        
        <label>Shipping price (in usd)</label>
        <input 
          type="number" 
          placeholder="5"
          value={shippingPrice}
          onChange={ev => setShippingPrice(ev.target.value)}
        />
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <SettingsPage swal={swal} />
));
