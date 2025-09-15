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
        title: 'Успех!',
        text: 'Настройките са запазени успешно',
        icon: 'success',
      });
    } catch (error) {
      swal.fire({
        title: 'Грешка!',
        text: 'Неуспешно запазване на настройките',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Настройки</h1>
      <form onSubmit={saveSettings} className="max-w-md">
        <label>Препоръчан продукт</label>
        <select 
          value={featuredProductId}
          onChange={ev => setFeaturedProductId(ev.target.value)}
        >
          <option value="">Избери продукт</option>
          {products.length > 0 && products.map(product => (
            <option key={product._id} value={product._id}>
              {product.title}
            </option>
          ))}
        </select>
        
        <label>Цена на доставка (в BGN)</label>
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
          {loading ? 'Запазване...' : 'Запази настройките'}
        </button>
      </form>
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <SettingsPage swal={swal} />
));
