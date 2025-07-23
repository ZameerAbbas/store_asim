import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Statestore from "../context/Context";

export default function App({ Component, pageProps }: AppProps) {
  return <Statestore>
    <Component {...pageProps} />
  </Statestore>
}
