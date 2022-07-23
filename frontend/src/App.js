import { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { ethers } from "ethers";
import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// ----------------------- css ------------------------------------
import "./App.css";
import "./assets/css/animate.min.css";
import "./assets/css/aos.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/default.css";
import "./assets/css/fontawesome-all.min.css";
import "./assets/css/magnific-popup.css";
import "./assets/css/odometer.css";
import "./assets/css/responsive.css";
import "./assets/css/slick.css";
import "./assets/css/style.css";
// ------------------------ pages ---------------------------------------
import QuestsPage from './pages/QuestsPage.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx'
import Footer from './pages/Footer.jsx';
// ------------------------- links -------------------------------------
import { Link } from "react-router-dom";


import contract from "./contracts/NumberBox.json";

const contractAddress = "0xFDA9C8A3d94A9786d9639Dca33b92604802ba6e0";
const abi = contract.abi;

function App() {
  const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygonMumbai, chain.optimism, chain.arbitrum],
    [
      alchemyProvider({ alchemyId: process.env.REACT_APP_ALCHEMY_ID }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  const [numberBox, setNumberBox] = useState("");

  useEffect(() => {
    // Update the document title using the browser API
    fetchNumber();
  }, []);

  async function fetchNumber() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const data = await contract.read();
        console.log("data: ", data.toNumber());
        setNumberBox(data.toString());
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function setNumber(newNum) {
    if (!numberBox) return;
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const transaction = await contract.update(parseInt(newNum));
      await transaction.wait();
      fetchNumber();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("numberBox:", numberBox);
    setNumber(numberBox);
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div>
          <Link to="/invoices">Invoices</Link> |
          <Link to="/expenses">Expenses</Link>
          <ConnectButton />
          <h1>Number Box</h1>
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="numberBox">Number</label>
                <input
                  id="name"
                  type="number"
                  value={numberBox}
                  onChange={(e) => setNumberBox(e.target.value)}
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        <QuestsPage />
        <LeaderBoard />
        <Footer />

      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;