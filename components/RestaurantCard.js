import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button, Image } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getUserSelectedRestaurants, toggleSelectedRestaurant } from '../.husky/apiData/RestaurantData';

const RestaurantCard = ({
  id, name, imageUrl, streetAddress, city, state, zipCode, onToggleOff,
}) => {
  const mountedRef = useRef(true);
  const { user } = useAuth();
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSelectedRestaurants = async () => {
      if (user?.uid) {
        try {
          const data = await getUserSelectedRestaurants(user.uid);
          if (mountedRef.current) {
            const selectedIds = data.map((item) => item.restaurant);
            setIsSelected(selectedIds.includes(id));
          }
        } catch (error) {
          console.error('Error fetching selected restaurants:', error);
        }
      }
    };

    fetchSelectedRestaurants();

    return () => {
      mountedRef.current = false;
    };
  }, [user?.uid, id]);

  const handleToggle = useCallback(async (event) => {
    if (loading) return;

    if (!user?.uid) {
      router.push('/'); // Redirect to home/signin page
      return;
    }

    const newValue = event.target.checked;
    setLoading(true);

    try {
      await toggleSelectedRestaurant(id, user.uid);
      if (mountedRef.current) {
        setIsSelected(newValue);
        if (!newValue && onToggleOff) {
          onToggleOff(id);
        }
      }
    } catch (error) {
      console.error('Toggle failed:', {
        error: error.message,
        userId: user.uid,
        restaurantId: id,
      });
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [id, user?.uid, loading, onToggleOff, router]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${streetAddress}, ${city}, ${state} ${zipCode}`)}`;

  return (
    <div className={`restaurant-card ${isSelected ? 'selected' : ''}`}>
      <Image src={imageUrl} alt={name} className="restaurant-image" />
      <div className="restaurant-info">
        <h3>{name}</h3>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          <p>{streetAddress}</p>
          <p>{`${city}, ${state} ${zipCode}`}</p>
        </a>
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggle}
          disabled={loading}
        />
        <span className="slider round" aria-label={`Select ${name}`} />
      </label>
      <Link href={`/Restaurants/${id}`} passHref>
        <Button variant="primary">View Details</Button>
      </Link>
    </div>
  );
}; RestaurantCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  streetAddress: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  onToggleOff: PropTypes.func,
};

RestaurantCard.defaultProps = {
  onToggleOff: null,
};

export default RestaurantCard;
