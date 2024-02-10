
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    // You can include global components here (e.g., layout, navbar, footer, etc.)
    return <Component {...pageProps} />;
}

export default MyApp;
