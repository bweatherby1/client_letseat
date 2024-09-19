import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import UserForm from '../components/Forms/UserForm';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading, updateUser } = useAuth();
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const isSpinnerPage = router.pathname === '/Spinner';

  if (userLoading) {
    return <Loading />;
  }

  if (user) {
    return (
      <>
        {/* Render Header on all pages except the Home and Spinner pages */}
        {!isHomePage && !isSpinnerPage && <Header />}
        {/* Render NavBar on all pages except the Home and Spinner pages */}
        {!isHomePage && <NavBar />}
        <div className="container">
          {user.bio === null ? (
            <UserForm user={user} onSubmit={updateUser} />
          ) : (
            <Component {...pageProps} />
          )}
        </div>
        {/* Render Footer on all pages except the Home and Spinner pages */}
        {!isHomePage && !isSpinnerPage && <Footer />}
      </>
    );
  }

  return <Signin />;
};

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
  hideNavAndFooter: PropTypes.bool,
};

ViewDirectorBasedOnUserAuthStatus.defaultProps = {
  hideNavAndFooter: false,
};

export default ViewDirectorBasedOnUserAuthStatus;
