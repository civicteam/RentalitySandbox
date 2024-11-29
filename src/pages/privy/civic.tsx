import { CivicProvider } from "@/components/civicContent";
import React from "react";
import { IdentityButton, ButtonMode, useGateway } from "@civic/ethereum-gateway-react";

function Civic() {
  return (
    <CivicProvider>
      <CivicPageContent />
    </CivicProvider>
  );
}

function CivicPageContent() {
  const { gatewayStatus, gatewayToken } = useGateway();

  return (
    <>
      <div>On this page default Privy provider and Civic provider work</div>
      <div>Civic Status: {gatewayStatus}</div>
      <div>Civic Token: {JSON.stringify(gatewayToken)}</div>
      <IdentityButton mode={ButtonMode.LIGHT} />
    </>
  );
}

export default Civic;
