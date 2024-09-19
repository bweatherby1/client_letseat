import PropTypes from 'prop-types';
import { AuthProvider } from './utils/context/authContext';
import ViewDirectorBasedOnUserAuthStatus from './utils/ViewDirector';

export default function MyApp({ Component, pageProps }) {
  const isIndexPage = Component.name === 'Home';

  return (
    <AuthProvider>
      <ViewDirectorBasedOnUserAuthStatus
        component={Component}
        pageProps={pageProps}
        hideNavAndFooter={isIndexPage}
      />
    </AuthProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};
