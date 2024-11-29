import { ConnectedWallet } from "@privy-io/react-auth";
import { Contract } from "ethers";
import { BrowserProvider } from "ethers";

export async function initTransaction(wallets: ConnectedWallet[]) {
  if (!wallets || !wallets[0]) {
    alert("Wallets are empty");
    return;
  }

  try {
    const provider = await wallets[0].getEthereumProvider();
    const etherv6Provider = new BrowserProvider(provider);
    const signer = await etherv6Provider.getSigner();

    const contract = new Contract(
      "0xB257FE9D206b60882691a24d5dfF8Aa24929cB73",
      [
        {
          type: "function",
          name: "setKYCInfo",
          constant: false,
          payable: false,
          inputs: [
            {
              type: "string",
              name: "nickName",
            },
            {
              type: "string",
              name: "mobilePhoneNumber",
            },
            {
              type: "string",
              name: "profilePhoto",
            },
            {
              type: "bytes",
              name: "TCSignature",
            },
          ],
          outputs: [],
        },
      ],
      signer
    );

    const DEFAULT_AGREEMENT_MESSAGE =
      "I have read and I agree with Terms of service, Cancellation policy, Prohibited uses and Privacy policy of Rentality.";
    const signature = await signer.signMessage(DEFAULT_AGREEMENT_MESSAGE);
    const transaction = await contract.setKYCInfo("test nick name", "123456789", "", signature);
    await transaction.wait();
  } catch (e) {
    console.error("initTransaction error:" + e);
  }
}
