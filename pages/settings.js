import Layout from "@/components/Layout";
import {useState, useEffect} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from 'react-sweetalert2';

function SettingsPage({swal}) {
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [shippingPrice, setShippingPrice] = useState(5);
  const [heroVideoDesktop, setHeroVideoDesktop] = useState('');
  const [heroVideoMobile, setHeroVideoMobile] = useState('');
  const [heroTitle, setHeroTitle] = useState('Natrufenka');
  const [heroSubtitle, setHeroSubtitle] = useState('ръчно изработени бижута');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);

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
      if (result.data.heroVideoDesktop) {
        setHeroVideoDesktop(result.data.heroVideoDesktop);
      }
      if (result.data.heroVideoMobile) {
        setHeroVideoMobile(result.data.heroVideoMobile);
      }
      if (result.data.heroTitle) {
        setHeroTitle(result.data.heroTitle);
      }
      if (result.data.heroSubtitle) {
        setHeroSubtitle(result.data.heroSubtitle);
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
        heroVideoDesktop,
        heroVideoMobile,
        heroTitle,
        heroSubtitle,
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

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Hero Видео настройки</h2>
          
          <label>Заглавие на Hero секцията</label>
          <input 
            type="text" 
            placeholder="Natrufenka"
            value={heroTitle}
            onChange={ev => setHeroTitle(ev.target.value)}
          />

          <label>Подзаглавие на Hero секцията</label>
          <input 
            type="text" 
            placeholder="ръчно изработени бижута"
            value={heroSubtitle}
            onChange={ev => setHeroSubtitle(ev.target.value)}
          />

          <label>Видео за десктоп</label>
          <div className="mb-2">
            {heroVideoDesktop && (
              <div className="mb-2">
                <video 
                  src={heroVideoDesktop} 
                  controls 
                  className="w-48 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Сигурни ли сте, че искате да изтриете десктоп видеото?')) {
                      try {
                        await axios.delete('/api/settings', {
                          data: { videoType: 'desktop' }
                        });
                        setHeroVideoDesktop('');
                        swal.fire({
                          title: 'Успех!',
                          text: 'Десктоп видеото е изтрито',
                          icon: 'success',
                        });
                      } catch (error) {
                        swal.fire({
                          title: 'Грешка!',
                          text: 'Неуспешно изтриване на видеото',
                          icon: 'error',
                        });
                      }
                    }
                  }}
                  className="btn-red text-sm mt-2"
                >
                  Изтрий видеото
                </button>
              </div>
            )}
            <label className="w-48 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
              {isUploadingDesktop ? (
                <Spinner />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <div>Качи видео</div>
                </>
              )}
              <input 
                type="file" 
                accept="video/*"
                onChange={async ev => {
                  const files = ev.target?.files;
                  if (files?.length > 0) {
                    setIsUploadingDesktop(true);
                    const data = new FormData();
                    for (const file of files) {
                      data.append('file', file);
                    }
                    const res = await axios.post('/api/upload', data);
                    setHeroVideoDesktop(res.data.links?.[0] || '');
                    setIsUploadingDesktop(false);
                  }
                }} 
                className="hidden" 
              />
            </label>
          </div>

          <label>Видео за мобилни</label>
          <div className="mb-2">
            {heroVideoMobile && (
              <div className="mb-2">
                <video 
                  src={heroVideoMobile} 
                  controls 
                  className="w-48 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Сигурни ли сте, че искате да изтриете мобилното видео?')) {
                      try {
                        await axios.delete('/api/settings', {
                          data: { videoType: 'mobile' }
                        });
                        setHeroVideoMobile('');
                        swal.fire({
                          title: 'Успех!',
                          text: 'Мобилното видео е изтрито',
                          icon: 'success',
                        });
                      } catch (error) {
                        swal.fire({
                          title: 'Грешка!',
                          text: 'Неуспешно изтриване на видеото',
                          icon: 'error',
                        });
                      }
                    }
                  }}
                  className="btn-red text-sm mt-2"
                >
                  Изтрий видеото
                </button>
              </div>
            )}
            <label className="w-48 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
              {isUploadingMobile ? (
                <Spinner />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <div>Качи видео</div>
                </>
              )}
              <input 
                type="file" 
                accept="video/*"
                onChange={async ev => {
                  const files = ev.target?.files;
                  if (files?.length > 0) {
                    setIsUploadingMobile(true);
                    const data = new FormData();
                    for (const file of files) {
                      data.append('file', file);
                    }
                    const res = await axios.post('/api/upload', data);
                    setHeroVideoMobile(res.data.links?.[0] || '');
                    setIsUploadingMobile(false);
                  }
                }} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
        
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
