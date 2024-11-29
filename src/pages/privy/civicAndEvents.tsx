import { CivicProvider } from "@/components/civicContent";
import { bigIntReplacer } from "@/utils";
import { subscribeToEvents } from "@/utils/events";
import { initTransaction } from "@/utils/transaction";
import { ButtonMode, IdentityButton, useGateway } from "@civic/ethereum-gateway-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { BrowserProvider } from "ethers";
import { Contract } from "ethers";
import React, { useEffect, useState } from "react";

function CivicAndEvents() {
  return (
    <CivicProvider>
      <CivicAndEventsPageContent />
    </CivicProvider>
  );
}

function CivicAndEventsPageContent() {
  const { ready, authenticated } = usePrivy();
  const { gatewayStatus, gatewayToken } = useGateway();
  const { wallets, ready: walletsReady } = useWallets();
  const [foundEvents, setFoundEvents] = useState<{ eventType: number; tripId: number; tripStatus: number }[]>([]);
  const [status, setStatus] = useState<string>("Initing");
  const [notificationService, setNotificationService] = useState<Contract>();
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0);

  const isAuth = ready && walletsReady && authenticated && wallets.length > 0;

  useEffect(() => {
    const initContract = async () => {
      if (!wallets || !wallets[0]) return;

      try {
        const provider = await wallets[0].getEthereumProvider();
        const etherv6Provider = new BrowserProvider(provider);
        const signer = await etherv6Provider.getSigner();

        const contract = new Contract(
          "0x6538488EAD213996727D1f4eC9738c3C92141180",
          [
            {
              type: "event",
              anonymous: false,
              name: "RentalityEvent",
              inputs: [
                { type: "uint8", name: "eType", indexed: true },
                { type: "uint256", name: "id", indexed: false },
                { type: "uint8", name: "objectStatus", indexed: false },
                { type: "address", name: "from", indexed: true },
                { type: "address", name: "to", indexed: true },
                { type: "uint256", name: "timestamp", indexed: false },
              ],
            },
          ],
          signer
        );
        setNotificationService(contract);
        setLatestBlockNumber(await etherv6Provider.getBlockNumber());
      } catch (e) {
        console.error("initContract error:" + e);
      }
    };

    initContract();
  }, [wallets]);

  useEffect(() => {
    if (!notificationService) return;

    subscribeToEvents(notificationService, latestBlockNumber, setFoundEvents, setStatus);
    return () => {
      if (notificationService) {
        console.debug("notificationService.removeAllListeners() called");

        notificationService.removeAllListeners();
      }
    };
  }, [notificationService, latestBlockNumber]);

  if (!isAuth) return <h1>You are offline or no wallets are found. Please try login</h1>;

  async function handleTransaction() {
    initTransaction(wallets);
  }

  return (
    <>
      <h1>On this page Privy and Civic providers work and add subcription to blockchain event</h1>

      {/* <div>
        <button className="bg-green-400 rounded-xl px-4 py-4" onClick={handleTransaction}>
          Init transaction
        </button>
      </div> */}
      <div>Civic Status: {gatewayStatus}</div>
      <div>Civic Token: {JSON.stringify(gatewayToken)}</div>
      <IdentityButton mode={ButtonMode.LIGHT} />

      <p>Status: {status} </p>
      <h3>Found events:</h3>
      {foundEvents?.map((i) => (
        <p>- {JSON.stringify(i, bigIntReplacer)}</p>
      ))}
    </>
  );
}

export default CivicAndEvents;
