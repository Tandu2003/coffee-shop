import { Link, useNavigate } from 'react-router-dom';
import { Image } from 'cloudinary-react';

import iconCart from '../../Assets/svg/iconCart.svg';
import iconHeart from '../../Assets/svg/iconHeart.svg';
import './Card.scss';
import { useContext } from 'react';
import AuthContext from '../../Context/AuthProvider';

const Card = ({
  title,
  img,
  newBadge = false,
  desc,
  price,
  idProduct,
  path = '#',
  ...props
}) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log({ auth });
  const handleClick = () => {
    if (auth.loggedIn) {
      console.log('Add to cart');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className={desc ? 'card has-description' : 'card'}
      data-id={idProduct}
      {...props}
    >
      <div className="card-img">
        {newBadge ? (
          <div className="card-badges">
            <span>New</span>
          </div>
        ) : (
          <></>
        )}

        <Link to={path}>
          <Image
            cloudName="ok-but-first-coffee"
            publicId={img}
            crop="scale"
            className="product-img"
          />
        </Link>

        <div className="card-wishlist">
          <button>
            <img src={iconHeart} alt="icon-heart" />
          </button>
        </div>
      </div>
      <div className="card-content">
        <h4 className="card-title">
          <Link to={path}>{title}</Link>
        </h4>
        {desc && (
          <div className="card-desc">
            <p>{desc}</p>
          </div>
        )}
        <div className="card-price">
          <span>${price}</span>
          <div className="add-to-cart">
            <button onClick={handleClick}>
              <img src={iconCart} alt="icon-cart" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
