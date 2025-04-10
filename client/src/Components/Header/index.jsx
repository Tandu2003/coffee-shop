import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import './Header.scss';
import api from '../../utils/apiCaller';
import AuthContext from '../../Context/AuthProvider';
import logo from '../../Assets/svg/logo.svg';
import user from '../../Assets/svg/user.svg';
import cart from '../../Assets/svg/cart.svg';
import search from '../../Assets/svg/search.svg';
import iconUser from '../../Assets/svg/iconUser.svg';
import iconHeart from '../../Assets/svg/iconHeart.svg';
import iconClose from '../../Assets/svg/iconClose.svg';
import arrowDown from '../../Assets/svg/arrowDown.svg';
import { Auth } from '../../Api/auth';
import { Image } from 'cloudinary-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);

  const [y, setY] = useState(window.scrollY);
  const [width, setWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [post, setPost] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  // Function to load cart data from localStorage
  const loadCartData = () => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cartData);

    // Calculate total price
    const total = cartData.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    setCartTotal(total);
  };

  // Update cart data when showing cart or when component mounts
  useEffect(() => {
    if (showCart) {
      loadCartData();
    }
  }, [showCart]);

  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  const handleNavigation = () => {
    setY(window.scrollY);
  };

  const handleShowMenu = () => {
    if (width < 1024) {
      if (showMenu) setShowMore(false);
      handleOff();
      setShowMenu(!showMenu);
    }
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleShowSearch = () => {
    handleOff();
    setShowSearch(!showSearch);
  };

  const handleShowCart = () => {
    handleOff();
    setShowCart(!showCart);
  };

  const handleShowLogin = () => {
    const URL = location.pathname;
    handleOff();
    if (!URL.includes('register') && !URL.includes('login') && !auth.loggedIn)
      setShowLogin(!showLogin);
  };

  const handleOff = () => {
    setShowSearch(false);
    setShowMenu(false);
    setShowLogin(false);
    setShowCart(false);
    setPost('');
    setUsername('');
    setPassword('');
  };

  // Function to remove item from cart
  const removeFromCart = (itemId, optionsToMatch = {}) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updatedCart = cart.filter((item) => {
      if (item.id !== itemId) return true;

      // If we have specific options to match (like size, color, grind)
      if (Object.keys(optionsToMatch).length > 0) {
        for (const [key, value] of Object.entries(optionsToMatch)) {
          if (item.options && item.options[key] !== value) {
            return true;
          }
        }
        return false;
      }

      return false;
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCartData();
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'password') setPassword(value);
    if (name === 'username') setUsername(value);
  };
  const handleOnClickRemember = () => setRemember(!remember);

  const handleLogin = async (e) => {
    e.preventDefault();

    const account = {
      identifier: username,
      password,
      remember,
    };

    try {
      setPost('Loading.....');
      const result = await Auth.login(account);
      setPost(result.message);
      if (result.loggedIn) {
        setAuth(result);
        navigate('/account');
        handleOff();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const isMoreActive = () => {
    const morePaths = ['/pages/about-us', '/pages/contact-us', '/pages/faqs'];
    return morePaths.some((path) => location.pathname.startsWith(path));
  };

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleNavigation);
    return () => window.removeEventListener('scroll', handleNavigation);
  }, []);

  return (
    <>
      <header>
        <div className="header">
          <div className="announcement-bar">
            <div className="container">
              <div className="announcement-bar__message">
                <p> Free shipping for all orders over $40!</p>
              </div>
            </div>
          </div>
          <div
            className={
              (width > 1024 && y >= 120) || (width < 1024 && y >= 60)
                ? 'site-header is-sticky'
                : 'site-header'
            }
          >
            <div className="container">
              <div className="header-middle">
                <div className="header-middle__left">
                  <div className="header-aside hide_mb">
                    <ul className="list">
                      <li className="item">
                        <Link
                          to="/collections/coffee-shop"
                          onClick={handleShowMenu}
                          className={`link-menu ${isActive('/collections/coffee-shop') ? 'active' : ''}`}
                        >
                          Coffee
                        </Link>
                      </li>
                      <li className="item">
                        <Link
                          to="/collections/merch-shop"
                          onClick={handleShowMenu}
                          className={`link-menu ${isActive('/collections/merch-shop') ? 'active' : ''}`}
                        >
                          Merch
                        </Link>
                      </li>
                      <li className="item">
                        <Link
                          to="/products/coffee-club-subscription"
                          onClick={handleShowMenu}
                          className={`link-menu ${isActive('/products/coffee-club-subscription') ? 'active' : ''}`}
                        >
                          Coffee Club
                        </Link>
                      </li>
                      <li className="item hide_mb"></li>
                      <li className="item">
                        <Link
                          to="/blogs/coffee-101"
                          onClick={handleShowMenu}
                          className={`link-menu ${isActive('/blogs/coffee-101') ? 'active' : ''}`}
                        >
                          Coffee 101
                        </Link>
                      </li>
                      <li className="item">
                        <Link
                          to="#"
                          onClick={handleShowMore}
                          className={`link-menu has-arrow ${isMoreActive() ? 'active' : ''}`}
                        >
                          More
                        </Link>
                        <div className={showMore ? 'menu is-show' : 'menu'}>
                          <ul className="menu-list">
                            <li className="menu-item hide_pc">
                              <Link to="#" onClick={handleShowMore}>
                                <img src={arrowDown} alt="arrow-down-icon" />
                                <span>More</span>
                              </Link>
                            </li>
                            <li className="menu-item hide_pc">
                              <Link to="#">
                                <span>All More</span>
                              </Link>
                            </li>
                            <li className="menu-item">
                              <Link
                                to="/pages/about-us"
                                onClick={handleShowMenu}
                              >
                                <span>About Us</span>
                              </Link>
                            </li>
                            <li className="menu-item">
                              <Link
                                to="/pages/contact-us"
                                onClick={handleShowMenu}
                              >
                                <span>Contact Us</span>
                              </Link>
                            </li>
                            <li className="menu-item">
                              <Link to="/pages/faqs" onClick={handleShowMenu}>
                                <span>FAQ</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li className="item hide_pc">
                        <Link to="/login" onClick={handleShowMenu}>
                          <img
                            className="icon-start"
                            src={iconUser}
                            alt="icon-user"
                          />
                          Customer Login
                        </Link>
                      </li>
                      <li className="item hide_pc">
                        <Link to="/pages/wishlist" onClick={handleShowMenu}>
                          <img
                            className="icon-start"
                            src={iconHeart}
                            alt="icon-user"
                          />
                          Wishlist
                        </Link>
                      </li>
                    </ul>
                    <div
                      className="icon-close hide_pc"
                      onClick={handleShowMenu}
                    >
                      <img src={iconClose} alt="icon-close" />
                    </div>
                  </div>
                </div>
                <div className="header-middle__logo">
                  <Link to="/">
                    <img
                      src={logo}
                      alt="OK-But-First-Coffee"
                      title="OK But First Coffee"
                    />
                  </Link>
                </div>
                <div className="header-middle__right">
                  <div className="header-middle__item">
                    <div className="menu-toggle" onClick={handleShowMenu}>
                      <span className="toggle-icon"></span>
                    </div>
                  </div>
                  <div className="header-middle__item">
                    <Link to="#" onClick={handleShowSearch}>
                      <img
                        src={showSearch ? iconClose : search}
                        alt={showSearch ? 'close-icon' : 'search-icon'}
                        style={
                          showSearch
                            ? {
                                filter: 'opacity(0.5) drop-shadow(0 0 0 black)',
                                width: '30px',
                              }
                            : {}
                        }
                      />
                    </Link>
                  </div>
                  <div className="hide_pc"></div>
                  <div className="header-middle__item">
                    <Link to="#" onClick={handleShowCart}>
                      <img src={cart} alt="cart-icon" />
                      {cartItems.length > 0 && (
                        <span className="cart-count">{cartItems.length}</span>
                      )}
                    </Link>
                    <div
                      className="header-middle__cart hide_mb"
                      style={
                        showCart
                          ? {
                              visibility: 'visible',
                              opacity: 1,
                            }
                          : {}
                      }
                    >
                      <div
                        className={
                          showCart ? 'cart-wrapper is-show' : 'cart-wrapper'
                        }
                      >
                        <div className="cart-header">
                          <h2 className="title">Shopping Cart</h2>
                          <button onClick={handleShowCart}>
                            <img src={iconClose} alt="icon-close" />
                          </button>
                        </div>
                        <div className="cart-content">
                          {cartItems.length > 0 ? (
                            <>
                              <div className="cart-items">
                                {cartItems.map((item, index) => (
                                  <div className="cart-item" key={index}>
                                    <div className="item-image">
                                      <Image
                                        cloudName="ok-but-first-coffee"
                                        publicId={item.img}
                                        crop="scale"
                                        width="60"
                                        height="60"
                                      />
                                    </div>
                                    <div className="item-details">
                                      <div className="item-name">
                                        {item.title}
                                      </div>
                                      {item.options && (
                                        <div className="item-options">
                                          {item.options.size && (
                                            <span>
                                              Size: {item.options.size}
                                            </span>
                                          )}
                                          {item.options.color && (
                                            <span>
                                              Color: {item.options.color}
                                            </span>
                                          )}
                                          {item.options.grind && (
                                            <span>
                                              Grind: {item.options.grind}
                                            </span>
                                          )}
                                          {item.options.bagSize && (
                                            <span>
                                              Bag: {item.options.bagSize} oz
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      <div className="item-price-qty">
                                        <span>
                                          ${item.price} × {item.quantity}
                                        </span>
                                        <span className="item-total">
                                          $
                                          {(item.price * item.quantity).toFixed(
                                            2
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      className="remove-item"
                                      onClick={() =>
                                        removeFromCart(
                                          item.id,
                                          item.options || {}
                                        )
                                      }
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="cart-footer">
                                <div className="cart-total">
                                  <span>Total:</span>
                                  <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="cart-actions">
                                  <div
                                    // to="/cart"
                                    className="theme-btn__white"
                                    onClick={handleShowCart}
                                  >
                                    View Cart
                                  </div>
                                  <div
                                    // to="/checkout"
                                    className="theme-btn__black"
                                    onClick={handleShowCart}
                                  >
                                    Checkout
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="empty-cart">
                              <p>Your cart is currently empty.</p>
                              <Link
                                to="/collections/coffee-shop"
                                className="theme-btn__black"
                                onClick={handleShowCart}
                              >
                                Continue Shopping
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="header-middle__item">
                    <Link
                      to={auth.loggedIn ? '/account' : '#'}
                      onClick={handleShowLogin}
                    >
                      <img src={user} alt="user-icon" />
                    </Link>
                    <div
                      className="header-middle__login hide_mb"
                      style={
                        showLogin
                          ? {
                              visibility: 'visible',
                              opacity: 1,
                            }
                          : {}
                      }
                    >
                      <div
                        className={
                          showLogin ? 'login-wrapper is-show' : 'login-wrapper'
                        }
                      >
                        <div className="login-header">
                          <h2 className="title">My Account</h2>
                          <button onClick={handleShowLogin}>
                            <img src={iconClose} alt="icon-close" />
                          </button>
                        </div>
                        <div className="login-content">
                          <form
                            className="login-form"
                            onSubmit={handleLogin}
                            acceptCharset="UTF-8"
                          >
                            <input type="hidden" name="utf8" value={'✓'} />
                            <div className="login-input">
                              <input
                                id="customer_username"
                                type="text"
                                name="username"
                                placeholder="Enter Username or Email"
                                autoComplete="off"
                                onChange={handleOnChange}
                                value={username}
                              />
                            </div>
                            <div className="login-input">
                              <input
                                id="customer_password"
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                autoComplete="off"
                                onChange={handleOnChange}
                                value={password}
                              />
                            </div>
                            <div className="login-actions">
                              <div className="action-group">
                                <div className="action__remember">
                                  <input
                                    type="checkbox"
                                    id="customCheck1"
                                    onClick={handleOnClickRemember}
                                  />
                                  <label htmlFor="customCheck1">
                                    Remember me
                                  </label>
                                </div>
                                <Link to="/login#recover">
                                  Forgot your password?
                                </Link>
                              </div>
                              <div className="action-group">
                                <p className="message">{post}</p>
                              </div>
                              <div className="action-group">
                                <input
                                  type="submit"
                                  className="theme-btn__white"
                                  value="Login"
                                ></input>
                              </div>
                              <div className="action-group">
                                <Link
                                  to="/register"
                                  className="theme-btn__black"
                                  onClick={handleShowLogin}
                                >
                                  Create Account
                                </Link>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="header-middle__search"
                  style={
                    showSearch
                      ? {
                          visibility: 'visible',
                          opacity: 1,
                        }
                      : {}
                  }
                >
                  <div className="search-wrapper">
                    <form
                      action="/"
                      className="search-form wrapper-input"
                      acceptCharset="UTF-8"
                    >
                      <input type="hidden" name="utf8" value={'✓'} />
                      <input
                        type="text"
                        name="q"
                        placeholder="Search for a product..."
                        className="search-form__input"
                        aria-label="Search Site"
                        autoComplete="off"
                      ></input>
                      <span className="focus-border">
                        <i></i>
                      </span>
                      <button type="submit" className="btn-search">
                        <img src={search} alt="icon-search" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              showMenu
                ? 'header-aside-mb hide_pc is-show'
                : 'header-aside-mb hide_pc'
            }
          >
            <ul className="list">
              <li className="item">
                <Link to="/collections/coffee-shop" onClick={handleShowMenu}>
                  Coffee
                </Link>
              </li>
              <li className="item">
                <Link to="/collections/merch-shop" onClick={handleShowMenu}>
                  Merch
                </Link>
              </li>
              <li className="item">
                <Link
                  to="/products/coffee-club-subscription"
                  onClick={handleShowMenu}
                >
                  Coffee Club
                </Link>
              </li>
              <li className="item">
                <Link to="/blogs/coffee-101" onClick={handleShowMenu}>
                  Coffee 101
                </Link>
              </li>
              <li className="item">
                <Link to="#" onClick={handleShowMore}>
                  More
                  <img src={arrowDown} alt="arrow-down-icon"></img>
                </Link>
                <div className={showMore ? 'menu is-show' : 'menu'}>
                  <ul className="menu-list">
                    <li className="menu-item ">
                      <Link to="#" onClick={handleShowMore}>
                        <img src={arrowDown} alt="arrow-down-icon" />
                        <span>More</span>
                      </Link>
                    </li>
                    <li className="menu-item ">
                      <Link to="#">
                        <span>All More</span>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link to="/pages/about-us" onClick={handleShowMenu}>
                        <span>About Us</span>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link to="/pages/contact-us" onClick={handleShowMenu}>
                        <span>Contact Us</span>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link to="/pages/faqs" onClick={handleShowMenu}>
                        <span>FAQ</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="item ">
                <Link to="/login" onClick={handleShowMenu}>
                  <img className="icon-start" src={iconUser} alt="icon-user" />
                  Customer Login
                </Link>
              </li>
              <li className="item ">
                <Link to="/pages/wishlist" onClick={handleShowMenu}>
                  <img className="icon-start" src={iconHeart} alt="icon-user" />
                  Wishlist
                </Link>
              </li>
            </ul>
            <div className="icon-close " onClick={handleShowMenu}>
              <img src={iconClose} alt="icon-close" />
            </div>
          </div>
          <div
            className="header-middle__login hide_pc"
            style={
              showLogin
                ? {
                    visibility: 'visible',
                    opacity: 1,
                  }
                : {}
            }
          >
            <div
              className={showLogin ? 'login-wrapper is-show' : 'login-wrapper'}
            >
              <div className="login-header">
                <h2 className="title">My Account</h2>
                <button onClick={handleShowLogin}>
                  <img src={iconClose} alt="icon-close" />
                </button>
              </div>
              <div className="login-content">
                <form
                  className="login-form"
                  onSubmit={handleLogin}
                  acceptCharset="UTF-8"
                >
                  <input type="hidden" name="utf8" value={'✓'} />
                  <div className="login-input">
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter Username or Email"
                      autoComplete="off"
                      onChange={handleOnChange}
                      value={username}
                    />
                  </div>
                  <div className="login-input">
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      autoComplete="off"
                      onChange={handleOnChange}
                      value={password}
                    />
                  </div>
                  <div className="login-actions">
                    <div className="action-group">
                      <div className="action__remember">
                        <input
                          type="checkbox"
                          id="customCheck2"
                          onClick={handleOnClickRemember}
                        />
                        <label htmlFor="customCheck2">Remember me</label>
                      </div>
                      <Link to="/login#recover">Forgot your password?</Link>
                    </div>
                    <div className="action-group">
                      <p className="message">{post}</p>
                    </div>
                    <div className="action-group">
                      <input
                        type="submit"
                        className="theme-btn__white"
                        value="Login"
                      ></input>
                    </div>
                    <div className="action-group">
                      <Link
                        to="/register"
                        className="theme-btn__black"
                        onClick={handleShowLogin}
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {y <= 60 && (
            <div
              className="header-middle__search hide_pc"
              style={
                showSearch
                  ? {
                      visibility: 'visible',
                      opacity: 1,
                    }
                  : {}
              }
            >
              <div className="search-wrapper">
                <form
                  action="/"
                  className="search-form wrapper-input"
                  acceptCharset="UTF-8"
                >
                  <input type="hidden" name="utf8" value={'✓'} />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search for a product..."
                    className="search-form__input"
                    aria-label="Search Site"
                    autoComplete="off"
                  ></input>
                  <span className="focus-border">
                    <i></i>
                  </span>
                  <button type="submit" className="btn-search">
                    <img src={search} alt="icon-search" />
                  </button>
                </form>
              </div>
            </div>
          )}

          <div
            className="header-middle__cart hide_pc"
            style={
              showCart
                ? {
                    visibility: 'visible',
                    opacity: 1,
                  }
                : {}
            }
          >
            <div className={showCart ? 'cart-wrapper is-show' : 'cart-wrapper'}>
              <div className="cart-header">
                <h2 className="title">Shopping Cart</h2>
                <button onClick={handleShowCart}>
                  <img src={iconClose} alt="icon-close" />
                </button>
              </div>
              <div className="cart-content">
                {cartItems.length > 0 ? (
                  <>
                    <div className="cart-items">
                      {cartItems.map((item, index) => (
                        <div className="cart-item" key={index}>
                          <div className="item-image">
                            <Image
                              cloudName="ok-but-first-coffee"
                              publicId={item.img}
                              crop="scale"
                              width="60"
                              height="60"
                            />
                          </div>
                          <div className="item-details">
                            <div className="item-name">{item.title}</div>
                            {item.options && (
                              <div className="item-options">
                                {item.options.size && (
                                  <span>Size: {item.options.size}</span>
                                )}
                                {item.options.color && (
                                  <span>Color: {item.options.color}</span>
                                )}
                                {item.options.grind && (
                                  <span>Grind: {item.options.grind}</span>
                                )}
                                {item.options.bagSize && (
                                  <span>Bag: {item.options.bagSize} oz</span>
                                )}
                              </div>
                            )}
                            <div className="item-price-qty">
                              <span>
                                ${item.price} × {item.quantity}
                              </span>
                              <span className="item-total">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <button
                            className="remove-item"
                            onClick={() =>
                              removeFromCart(item.id, item.options || {})
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="cart-footer">
                      <div className="cart-total">
                        <span>Total:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="cart-actions">
                        <Link
                          to="/cart"
                          className="theme-btn__white"
                          onClick={handleShowCart}
                        >
                          View Cart
                        </Link>
                        <Link
                          to="/checkout"
                          className="theme-btn__black"
                          onClick={handleShowCart}
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-cart">
                    <p>Your cart is currently empty.</p>
                    <Link
                      to="/collections/coffee-shop"
                      className="theme-btn__black"
                      onClick={handleShowCart}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={
              showMenu || showSearch || showLogin || showCart
                ? 'background-overlay'
                : ''
            }
            onClick={handleOff}
          ></div>
        </div>
      </header>
    </>
  );
};

export default Header;
