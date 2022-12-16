import { LgnProvider } from "../context/lgnContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <LgnProvider>
      <Component {...pageProps} />
    </LgnProvider>
  );
}

export default MyApp;
