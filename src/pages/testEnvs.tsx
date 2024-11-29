import React from "react";

function TestEnvs() {
  const NEXT_PUBLIC_TEST_ENV = process.env.NEXT_PUBLIC_TEST_ENV;
  const TEST_ENV = process.env.TEST_ENV;

  function handleTestClientEnvClick() {
    alert(JSON.stringify({ NEXT_PUBLIC_TEST_ENV, TEST_ENV }, null, 2));
  }

  async function handleTestServerEnvClick() {
    try {
      // var url = new URL(`/api/getServerEnvs`, window.location.origin);
      // const response = await fetch(url);
      const response = await fetch("/api/getServerEnvs");

      if (!response.ok) {
        alert(`response error: + ${response.statusText}`);
        return;
      }
      alert(JSON.stringify(await response.json(), null, 2));
    } catch (e) {
      alert("fetch error:" + e);
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center">
      <button onClick={handleTestClientEnvClick}>Test client envs</button>
      <button onClick={handleTestServerEnvClick}>Test server envs</button>
    </div>
  );
}

export default TestEnvs;
