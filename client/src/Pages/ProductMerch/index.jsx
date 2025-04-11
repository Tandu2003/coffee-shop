import { useEffect, useState } from 'react';
import Breadcrumb from '../../Components/Breadcrumb';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MerchApi } from '../../Api/merch';
import { Image } from 'cloudinary-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './ProductMerch.scss';

const MerchDetail = () => {
  const [merch, setMerch] = useState({});
  const [imageSingle, setImageSingle] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(0);
  const [color, setColor] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
  });
  const navigate = useNavigate();
  const handleChangeImageSingle = (image) => {
    setImageSingle(image);
  };

  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const merchId = params.id;
        const result = await MerchApi.getMerch(merchId);
        setMerch(result);
      } catch (error) {
        if (error.response.status === 404) navigate('/404');
        console.log(error);
      }
    };

    fetchData();
  }, [params, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setImageSingle(merch.merchImages?.[0]);
    setSize(merch.size?.[0]);
    setColor(merch.color?.[0]);

    document.title = `Buy ${merch.name} Online | Coffee Beans | OKBF`;
  }, [merch]);

  const handleChangeQuantity = (e) => {
    if (e.target.innerText === '+') {
      setQuantity(quantity + 1);
    } else if (e.target.innerText === '-') {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    } else {
      const value = Number(e.target.value);
      if (value < 1) setQuantity(1);
      else setQuantity(value);
    }
  };

  const handleChangeColor = (item) => {
    setColor(item);
  };

  const handleChangeSize = (item) => {
    setSize(item);
  };

  const addToCart = () => {
    // Get existing cart or initialize new one
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Create product object with selected options
    const productToAdd = {
      id: merch._id,
      title: merch.name,
      img: merch.merchImages?.[0],
      price: merch.price,
      path: `/merch/${merch._id}`,
      quantity: quantity,
      options: {
        size: size,
        color: color,
      },
      type: 'merch',
    };

    // Check if product with same options already in cart
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === productToAdd.id &&
        item.options?.size === productToAdd.options?.size &&
        item.options?.color === productToAdd.options?.color
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push(productToAdd);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show notification
    setNotification({
      show: true,
      message: `Added ${quantity} ${merch.name} to cart successfully!`,
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const ShowImage = () => {
    return (
      <>
        <div className="merch-image-single">
          <Image
            cloudName="ok-but-first-coffee"
            publicId={imageSingle}
            crop="scale"
            className="merch-img"
          />
        </div>
        <Swiper
          className="merch-image-list "
          modules={[Navigation]}
          slidesPerView={3}
          navigation={true}
        >
          {merch.merchImages?.map((image, index) => {
            return (
              <SwiperSlide
                className={`image-item ${image === imageSingle ? 'active' : ''}`}
                key={index}
                onClick={() => handleChangeImageSingle(image)}
              >
                <Image
                  cloudName="ok-but-first-coffee"
                  publicId={image}
                  crop="scale"
                  className="merch-img"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    );
  };

  if (!merch) {
    return null;
  }

  return (
    <>
      <main className="product-merch">
        {notification.show && (
          <div className="cart-notification">
            <div className="notification-content">
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, message: '' })}
              >
                ×
              </button>
            </div>
          </div>
        )}
        <section className="merch-detail">
          <Breadcrumb
            breadcrumb={merch.name}
            list={[{ title: 'Merch Shop', path: '/collections/merch-shop' }]}
          />
          <div className="container">
            <div className="merch-order">
              <div className="merch-image">
                <ShowImage />
              </div>
              <div className="merch-info">
                <h1 className="merch-name">{merch.name}</h1>
                <div className="merch-meta">
                  <div className="meta-item">
                    <span>Brand:</span> {merch.brand}
                  </div>
                  <div className="meta-item">
                    <span>Availability:</span> {merch.availability}
                  </div>
                </div>

                <div className="merch-price">${merch.price}</div>
                <div className="merch-note">
                  <Link to="/pages/policies">Shipping</Link> calculated at
                  checkout.
                </div>
                <div className="merch-size">
                  <h3 className="size-title">
                    SIZE * <span>{size}</span>
                  </h3>

                  {merch.size?.map((item, index) => (
                    <div
                      className="size-item"
                      key={index}
                      onClick={() => handleChangeSize(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="merch-color">
                  <h3 className="color-title">
                    COLOR * <span>{color}</span>
                  </h3>

                  {merch.color?.map((item, index) => (
                    <div
                      className="color-item"
                      key={index}
                      onClick={() => handleChangeColor(item)}
                      style={{
                        background: `${item}`,
                        backgroundClip: 'content-box',
                      }}
                    ></div>
                  ))}
                </div>
                <div className="merch-quantity">
                  <h3 className="quantity-title">QUANTITY *</h3>
                  <div className="quantity-input">
                    <button onClick={handleChangeQuantity}>-</button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleChangeQuantity}
                      onClick={handleChangeQuantity}
                      min={1}
                      step={1}
                    />
                    <button onClick={handleChangeQuantity}>+</button>
                  </div>
                </div>
                <div className="merch-subtotal">
                  <span>Subtotal ${(merch.price * quantity).toFixed(2)}</span>
                </div>
                <button className="btn-add" onClick={addToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="merch-overview">
          <div className="container">
            <div className="merch-description">
              <h2 className="merch-description-title">MERCH DESCRIPTION</h2>
              <p className="merch-description-content">{merch.description}</p>
              <div className="merch-feature">
                <h3 className="merch-feature-title">FEATURES</h3>
                <ul className="merch-feature-content">
                  {merch.features?.map((item) => (
                    <li style={{ listStyle: 'disc' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="merch-comment">
          <div className="container">
            <div></div>
          </div>
        </section>
        <section className="merch-recommended">
          <div className="container">
            <div></div>
          </div>
        </section>
        <section className="merch-recently-viewed">
          <div className="container">
            <div></div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MerchDetail;
