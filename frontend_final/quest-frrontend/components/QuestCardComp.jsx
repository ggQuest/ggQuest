import React from 'react';
import { ethers } from "ethers";
import contract_abi from "./../utils/contract/babylonRequest.json";
import Image from 'next/image';
const abi = contract_abi.abi;
const contract2 = "0xDaF8E1B1b202047Abba7390284dc6ed24261f89D";

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Box';


function QuestsCardComp({id, description, gameName, title, reward, img, contractAddress}) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#1e1e2a',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                <a className="popup-video">
                    <img src={img} alt="" />
                </a>
                <div className="treand-gameplay-overlay">
                    <ul>
                        <li className="quality">{gameName}</li>
                    </ul>
                </div>
            </div>
                
            <div className="d-block d-sm-flex align-items-start">
                <div className="gameplay-content">
                    <h5 className="title"><a href="#">{title}</a></h5>


                    <Button onClick={handleOpen} style={{color: 'white'}}>View Details</Button>
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{color: "white"}}>
                            {gameName}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{color: "white", 'font-weight': 'bold'}}>
                        NAME OF THE QUEST : {title}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{color: "white"}}>
                        DESCRIPTION : {description}
                        </Typography>
                        
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{color: "white"}}>
                        REWARDS : {reward}
                        </Typography>
                    </Box>
                    </Modal>


                    
                </div>
                
                <div className="gameplay-status">
                    <button className="btn-claim" onClick={claimReward}>
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