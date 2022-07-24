import React from 'react';
import { ethers } from "ethers";
import contract_abi from "./../utils/contract/babylonRequest.json";
import Image from 'next/image';
const abi = contract_abi.abi;
const contract2 = "0xDaF8E1B1b202047Abba7390284dc6ed24261f89D";



function QuestsCardComp({id, description, gameName, title, reward, img, contractAddress}) {

    async function claimReward() {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          console.log({ provider });
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);
          try {
            await contract.claimReward();

          } catch (error) {
              console.log(error)
          }
        }
    }


  return (
    <>
    <div className="col-lg-4 col-md-6">
        <div className="trending-gameplay-item mb-50">
            <div className="gameplay-thumb">
                <a href="https://www.youtube.com/watch?v=ssrNcwxALS4" className="popup-video">
                    <img src="/assets/img/images/Axie.png" alt="" />
                </a>
                <div className="treand-gameplay-overlay">
                    <ul>
                        <li className="quality">Bla</li>
                    </ul>
                </div>
            </div>
                
            <div className="d-block d-sm-flex align-items-start">
                <div className="gameplay-content">
                    <h5 className="title"><a href="#"></a></h5>
                    <div className="gameplay-meta">
                        <ul>
                            <li>Title : {title}</li>
                            <li>Description : {description}</li>
                            <li>Rewards : {reward}</li>
                            <li>Game Name : {gameName} </li>
                        </ul>
                    </div>
                </div>
                <div className="gameplay-status">
                    <button onClick={claimReward}>
                        CLAIM
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default QuestsCardComp