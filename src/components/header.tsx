import { usePrivy, useWallets } from "@privy-io/react-auth";
import Link from "next/link";
import React, { useCallback } from "react";

function Header() {
  const { connectWallet, ready, authenticated, login, logout } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();

  const isAuth = ready && walletsReady && authenticated && wallets.length > 0;

  const customLogin = useCallback(() => {
    if (authenticated && wallets.length === 0) {
      connectWallet();
      return;
    }
    login();
  }, [authenticated, wallets, connectWallet, login]);

  return (
    <header className="w-full flex gap-4 justify-center ">
      <nav className="flex gap-8 bg-gray-300  py-4 px-8">
        <Link href="/testEnvs">Test envs</Link>
        <Link href="/privy">Privy default</Link>
        <Link href="/privy/events">Privy + Events</Link>
        <Link href="/privy/civic">Privy + Civic</Link>
        <Link href="/privy/civicAndEvents">Privy + Events + Civic</Link>
      </nav>
      <div className="py-4">
        {isAuth ? (
          <button className="bg-fuchsia-600 rounded-xl  w-24" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="bg-violet-600 rounded-xl w-24" onClick={customLogin}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
