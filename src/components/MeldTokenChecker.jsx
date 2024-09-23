import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ABI for ERC20 token balance checking
const minABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const MeldTokenChecker = () => {
  const [address, setAddress] = useState('');
  const [isEligible, setIsEligible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await switchToMeldChain(provider);
      } catch (err) {
        setError('Failed to connect wallet: ' + err.message);
      }
    } else {
      setError('Please install MetaMask!');
    }
  };

  const switchToMeldChain = async (provider) => {
    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: '0x13D2ECED' }]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.send('wallet_addEthereumChain', [{
            chainId: '0x13D2ECED',
            chainName: 'Meld',
            nativeCurrency: {
              name: 'gMELD',
              symbol: 'gMELD',
              decimals: 18
            },
            rpcUrls: ['https://subnets.avax.network/meld/mainnet/rpc'],
            blockExplorerUrls: ['https://meldscan.io']
          }]);
        } catch (addError) {
          setError('Failed to add Meld chain: ' + addError.message);
        }
      } else {
        setError('Failed to switch to Meld chain: ' + switchError.message);
      }
    }
  };

  const checkEligibility = async () => {
    setIsLoading(true);
    setError('');
    setIsEligible(null);

    try {
      const provider = new ethers.providers.JsonRpcProvider('https://subnets.avax.network/meld/mainnet/rpc');
      const tokenAddress = '0x333000Dca02578EfE421BE77FF0aCC0F947290f0';
      const contract = new ethers.Contract(tokenAddress, minABI, provider);
      const balance = await contract.balanceOf(address);
      
      setIsEligible(balance.gt(0));
    } catch (err) {
      setError('Error checking eligibility: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Meld Token Checker</h1>
      <button 
        onClick={connectWallet}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Connect Wallet
      </button>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address to check"
        className="w-full p-2 border rounded mb-4"
      />
      <button 
        onClick={checkEligibility}
        disabled={isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        {isLoading ? 'Checking...' : 'Check Eligibility'}
      </button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isEligible !== null && (
        <Alert variant={isEligible ? "default" : "destructive"}>
          <AlertDescription>
            {isEligible ? "You are eligible!" : "You are not eligible."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MeldTokenChecker;