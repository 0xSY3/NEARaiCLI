// pages/_app.tsx
import { NearProvider } from '@/context/NearContext';

function MyApp({ Component, pageProps }) {
  return (
    <NearProvider>
      <Component {...pageProps} />
    </NearProvider>
  );
}

export default MyApp;