/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { AuthProvider } from '../utils/context/authContext';
import ViewDirectorBasedOnUserAuthStatus from '../utils/ViewDirector';
import Loading from '../components/Loading'; // Import the Loading component

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    const handleRouteChangeError = () => {
      setLoading(false);
    };

    // Listen to route changes
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    // Cleanup the event listeners on component unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return (
    <AuthProvider>
      {loading ? (
        <Loading /> // Show the Loading component while page is loading
      ) : (
        <ViewDirectorBasedOnUserAuthStatus
          component={Component}
          pageProps={pageProps}
        />
      )}
    </AuthProvider>
  );
}

export default MyApp;
