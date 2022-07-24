import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';


function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <li type="button" onClick={openConnectModal}><a><i className="far fa-edit"></i>  Connect Wallet</a></li>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex'}} >
                    <li
                        onClick={openChainModal}
                        style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}
                        type="button"
                    >
                      <a style={{display: 'flex',  alignItems: 'center'}}>
                      <div>
                      {chain.hasIcon && (
                        <div
                            style={{
                            background: chain.iconBackground,
                            width: 15,
                            height: 15,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                            }}
                        >
                            {chain.iconUrl && (
                            <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                            />
                            )}
                        </div>
                        )}
                      </div>
                      {chain.name}
                      </a>

                    </li>
                    <li onClick={openAccountModal} type="button">
                    <a><i className="far fa-edit"></i>
                    {account.displayName}
                        {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </a>
                    </li>

                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};


export default CustomConnectButton;