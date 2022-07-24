import React from 'react';
import { ethers } from "ethers";
import contract_abi from "./../utils/contract/babylonRequest.json";
import Image from 'next/image';
const abi = contract_abi.abi;
const contract2 = "0xDaF8E1B1b202047Abba7390284dc6ed24261f89D";



function QuestsCardComp({id, description, gameName, title, reward, img, contractAddress}) {

    async function claimReward() {
        if (typeof window.ethereum !== "undefined") {
            console.log(contractAddress);
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
                    <img src={img} alt="" />
                </a>
                <div className="treand-gameplay-overlay">
                    <ul>
                        <li className="quality">Bla</li>
                    </ul>
                </div>
            </div>
                
            <div className="d-block d-sm-flex align-items-start">
                <div className="gameplay-content">
                    <h5 className="title"><a href="#">{title}</a></h5>
                    <div className="gameplay-meta">
                        <ul>
                            <div className='row'>
                                <li>Rewards : {reward}</li>
                            </div>
                            <div className='row' styles={{margin: 5}}>

                                <li>Game Name : {gameName} </li>
                            </div>
                            <div className='row' styles={{padding: 5}}>
                                <li>Description : {description}</li>
                            </div>
                        </ul>
                    </div>
                </div>
                
                <div className="gameplay-status">
                    <button className="button" onClick={claimReward}>
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