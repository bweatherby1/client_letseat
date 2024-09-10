import PropTypes from 'prop-types';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';
import UserForm from '../components/Forms/UserForm';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading, updateUser } = useAuth();

  if (userLoading) {
    return <Loading />;
  }

  if (user) {
    return (
      <>
        <NavBar /> {/* NavBar only visible if user is logged in and is in every view */}
        <div className="container">
          {user.bio === null ? (
            <UserForm user={user} onSubmit={updateUser} />
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </>
    );
  }

  return <Signin />;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
