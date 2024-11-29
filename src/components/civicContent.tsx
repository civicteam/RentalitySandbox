import { CSSProperties, useEffect, useState } from "react";
import { EthereumGatewayWallet, GatewayProvider } from "@civic/ethereum-gateway-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { BrowserProvider } from "ethers";

const customWrapperStyle: CSSProperties = {
  background: "rgba(0,0,0,0.5)",
  position: "fixed",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  minHeight: "26",
  overflow: "hidden",
  /* flex position the iframe container */
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1400,
};

const customWrapperContentStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "526px",
  width: "100%",
  minHeight: "26",
  maxHeight: "100",
  background: "#fff",
  borderRadius: "4px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
  overflow: "hidden",
};

const CustomWrapper: React.FC = ({ children = null }: { children?: React.ReactNode }) => {
  return (
    <div style={customWrapperStyle}>
      <div style={customWrapperContentStyle}>{children}</div>
    </div>
  );
};

export const CivicProvider = ({ children }: { children?: React.ReactNode }) => {
  const gatekeeperNetwork = process.env.NEXT_PUBLIC_CIVIC_GATEKEEPER_NETWORK as string;
  const { ready, authenticated } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();

  const isAuth = ready && walletsReady && authenticated && wallets.length > 0;

  const [wallet, setWallet] = useState<EthereumGatewayWallet>();

  useEffect(() => {
    const setData = async () => {
      if (!wallets[0]) return;

      const provider = await wallets[0].getEthereumProvider();
      const etherv6Provider = new BrowserProvider(provider);
      const signer = await etherv6Provider.getSigner();

      setWallet({ address: wallets[0].address, signer: signer });
    };

    setData();
  }, [wallets]);

  if (!isAuth || !wallet) return <>Civic provides is not inited. Please try login</>;

  return (
    <GatewayProvider
      wallet={wallet}
      gatekeeperNetwork={gatekeeperNetwork}
      wrapper={CustomWrapper}
      options={{ autoShowModal: false, disableAutoRestartOnValidationFailure: true }}
    >
      {children}
    </GatewayProvider>
  );
};
