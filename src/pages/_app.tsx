import Header from "@/components/header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";

export default function App({ Component, pageProps }: AppProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "#1E1E30",
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <div className="flex flex-col gap-4">
        <Header />
        <div className="flex flex-col items-center text-xl font-bold">
          <Component {...pageProps} />
        </div>
      </div>
    </PrivyProvider>
  );
}
