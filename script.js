let web3;
let providerWalletConnect = null;
let account;
const chainIdTestnet = '0x61'; // BSC Testnet
const stakingContractAddress = '0x94bC53fD2D7915fD70A120eBfb96bB99A81fFfeF';
const vnstTokenAddress = '0x37c401DdBC8030c63BF3B3b2816Ba379BfD10474';
const maxStakeLimit = 10000; // 10,000 VNST Max Stake

// यहाँ अपनी Staking Contract ABI पेस्ट करें
const stakingAbi = [{"inputs":[{"internalType":"address","name":"_vnstToken","type":"address"},{"internalType":"address","name":"_vntToken","type":"address"},{"internalType":"address","name":"_usdtToken","type":"address"},{"internalType":"address","name":"_vnstStakingWallet","type":"address"},{"internalType":"address","name":"_vntRewardWallet","type":"address"},{"internalType":"address","name":"_usdtRewardWallet","type":"address"},{"internalType":"address","name":"_autoStakeWallet","type":"address"},{"internalType":"address","name":"_feeWallet","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Blacklisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newPercent","type":"uint256"}],"name":"ROIPercentChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bool","name":"inVNST","type":"bool"}],"name":"ReferralEarned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"vntAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"usdtAmount","type":"uint256"}],"name":"RewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"RewardRateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newMin","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newMax","type":"uint256"}],"name":"StakeLimitsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"referrer","type":"address"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newVnstPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newVntPrice","type":"uint256"}],"name":"TokenPricesUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Unblacklisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"CLAIM_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_VNT_WITHDRAWAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WITHDRAWAL_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"annualRewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"autoStakeWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"blacklistUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"blacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"createFirstStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dailyROIPercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"directIncomePercents","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"feeWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"forceClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"level","type":"uint256"}],"name":"getLevelReferralCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"level","type":"uint256"}],"name":"getLevelReferrals","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getPendingRewards","outputs":[{"internalType":"uint256","name":"vntReward","type":"uint256"},{"internalType":"uint256","name":"usdtReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getReferralCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserStats","outputs":[{"internalType":"uint256","name":"totalStaked","type":"uint256"},{"internalType":"uint256","name":"totalEarned","type":"uint256"},{"internalType":"uint256","name":"directMembers","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWalletBalances","outputs":[{"internalType":"uint256","name":"vnstStakingBalance","type":"uint256"},{"internalType":"uint256","name":"vntRewardBalance","type":"uint256"},{"internalType":"uint256","name":"usdtRewardBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"levelReferrals","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxStakeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minStakeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"recoverETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"referrals","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"requiredDirectMembers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"pendingVNT","type":"uint256"},{"internalType":"uint256","name":"pendingUSDT","type":"uint256"},{"internalType":"uint256","name":"claimedVNT","type":"uint256"},{"internalType":"uint256","name":"claimedUSDT","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_dailyROIPercent","type":"uint256"}],"name":"setDailyROIPercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_annualRewardRate","type":"uint256"}],"name":"setRewardRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newMin","type":"uint256"},{"internalType":"uint256","name":"newMax","type":"uint256"}],"name":"setStakeLimits","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vnstPrice","type":"uint256"},{"internalType":"uint256","name":"_vntPrice","type":"uint256"}],"name":"setTokenPrices","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_vnstStakingWallet","type":"address"},{"internalType":"address","name":"_vntRewardWallet","type":"address"},{"internalType":"address","name":"_usdtRewardWallet","type":"address"},{"internalType":"address","name":"_autoStakeWallet","type":"address"},{"internalType":"address","name":"_feeWallet","type":"address"}],"name":"setWallets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"referrer","type":"address"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakes","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"bool","name":"active","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"unblacklistUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdtRewardWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"usdtToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userStats","outputs":[{"internalType":"uint256","name":"totalDirectMembers","type":"uint256"},{"internalType":"uint256","name":"totalStaked","type":"uint256"},{"internalType":"uint256","name":"totalEarned","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vnstPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vnstStakingWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vnstToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vntPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vntRewardWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vntToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

// यहाँ अपनी VNST Token ABI पेस्ट करें
const tokenAbi = [{"inputs":[{"internalType":"address","name":"_usdtAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"by","type":"address"}],"name":"AddressBlacklisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"by","type":"address"}],"name":"AddressWhitelisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FeeCollected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newFee","type":"uint256"},{"indexed":true,"internalType":"address","name":"by","type":"address"}],"name":"TransferFeeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"VNSTPriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"vnstAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"usdtAmount","type":"uint256"}],"name":"VNSTPurchased","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BLACKLIST_MANAGER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_MANAGER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"blacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"vnstAmount","type":"uint256"}],"name":"buyVNST","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"vnstAmount","type":"uint256"}],"name":"getUSDTRequiredForVNST","outputs":[{"internalType":"uint256","name":"usdtRequired","type":"uint256"},{"internalType":"uint256","name":"usdtAllowance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"}],"name":"roles","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"setTransferFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setVNSTPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdtTokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vnstPriceInUSDT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"whitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"withdrawUSDT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

const contract = () => new web3.eth.Contract(stakingAbi, stakingContractAddress);
const vnstTokenContract = () => new web3.eth.Contract(tokenAbi, vnstTokenAddress);

// UI Elements
const walletBtn = document.getElementById('walletBtn');
const modal = document.getElementById('walletModal');
const connectMM = document.getElementById('connect-metamask');
const connectWC = document.getElementById('connect-walletconnect');
const connectTW = document.getElementById('connect-trustwallet');
const closeModalBtn = document.querySelector('.close-modal');

const stakeBtn = document.getElementById('stakeBtn');
const approveMaxBtn = document.getElementById('approveMaxBtn');
const claimTokenBtn = document.getElementById('claimTokenBtn');
const claimUsdtBtn = document.getElementById('claimUsdtBtn');

const pendingVNT = document.getElementById('pendingVNT');
const pendingUSDT = document.getElementById('pendingUSDT');
const statStaked = document.getElementById('stat-staked');
const statEarned = document.getElementById('stat-earned');
const statReferrals = document.getElementById('stat-referrals');

// Initialize
window.addEventListener('load', async () => {
  // Check if Web3 is injected
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        account = accounts[0];
        onConnect();
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }
});

// Wallet Connection Functions
async function connectMetaMask() {
  try {
    if (!window.ethereum) {
      alert('Please install MetaMask extension!');
      return;
    }

    // Reset WalletConnect if previously connected
    if (providerWalletConnect) {
      await providerWalletConnect.disconnect();
      providerWalletConnect = null;
    }

    web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];
    await switchToBSCTestnet();
    onConnect();
    closeModal();
  } catch (error) {
    console.error("MetaMask connection error:", error);
    alert('MetaMask connection failed: ' + error.message);
  }
}

async function connectWalletConnect() {
  try {
    // Disconnect previous connection if any
    if (providerWalletConnect) {
      await providerWalletConnect.disconnect();
    }

    providerWalletConnect = new window.WalletConnectProvider.default({
      rpc: {
        56: 'https://bsc-dataseed.binance.org/',
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
      },
      chainId: 97 // BSC Testnet
    });

    await providerWalletConnect.enable();
    web3 = new Web3(providerWalletConnect);
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    onConnect();
    closeModal();
  } catch (error) {
    console.error("WalletConnect error:", error);
    alert('WalletConnect failed: ' + error.message);
  }
}

async function connectTrustWallet() {
  try {
    if (window.trustwallet) {
      await connectMetaMask(); // Trust Wallet uses the same interface as MetaMask
    } else {
      await connectWalletConnect(); // Fallback to WalletConnect
    }
  } catch (error) {
    console.error("Trust Wallet connection error:", error);
    alert('Trust Wallet connection failed: ' + error.message);
  }
}

async function switchToBSCTestnet() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdTestnet }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainIdTestnet,
            chainName: 'Binance Smart Chain Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            blockExplorerUrls: ['https://testnet.bscscan.com']
          }],
        });
      } catch (addError) {
        console.error("Error adding BSC Testnet:", addError);
      }
    }
    console.error("Error switching network:", switchError);
  }
}

// Event Listeners
walletBtn.addEventListener('click', () => modal.style.display = 'block');
closeModalBtn.addEventListener('click', closeModal);
connectMM.addEventListener('click', connectMetaMask);
connectWC.addEventListener('click', connectWalletConnect);
connectTW.addEventListener('click', connectTrustWallet);

function closeModal() {
  modal.style.display = 'none';
}

function onConnect() {
  walletBtn.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
  walletBtn.classList.add('connected');
  refreshUI();
}

// Main Functions
async function refreshUI() {
  if (!account) return;
  
  try {
    const c = contract();
    
    // Check if contract is paused
    const isPaused = await c.methods.paused().call();
    if (isPaused) {
      alert('Contract is currently paused. Please try later.');
      return;
    }

    // Get pending rewards
    let rVnt = 0, rUsdt = 0;
    try {
      const rewards = await c.methods.getPendingRewards(account).call();
      if (Array.isArray(rewards)) {
        rVnt = rewards[0] || 0;
        rUsdt = rewards[1] || 0;
      }
    } catch (e) {
      console.log("Could not fetch pending rewards", e);
    }
    
    pendingVNT.textContent = `Pending VNT: ${(rVnt / 1e18).toFixed(4)}`;
    pendingUSDT.textContent = `Pending USDT: ${(rUsdt / 1e18).toFixed(4)}`;

    // Get user stats
    let staked = 0, earned = 0, direct = 0;
    try {
      const stats = await c.methods.getUserStats(account).call();
      if (Array.isArray(stats) && stats.length >= 3) {
        staked = stats[0] || 0;
        earned = stats[1] || 0;
        direct = stats[2] || 0;
      }
    } catch (e) {
      console.log("Could not fetch user stats", e);
    }
    
    statStaked.textContent = `Staked: ${(staked / 1e18).toFixed(2)} VNST`;
    statEarned.textContent = `Earned: ${(earned / 1e18).toFixed(2)} VNT`;
    statReferrals.textContent = `Referrals: ${direct}`;

    await showLevelReferralData();
    await checkUnlockedLevels();
  } catch (err) {
    console.error("Error refreshing UI:", err);
  }
}

approveMaxBtn.addEventListener('click', async () => {
  if (!account) {
    alert('Please connect your wallet first');
    return;
  }
  
  try {
    const amount = document.getElementById('stakeAmount').value;
    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    // Calculate exact amount needed instead of MAX_UINT256
    const amountWei = web3.utils.toWei(amount, 'ether');
    
    const t = vnstTokenContract();
    const tx = await t.methods.approve(stakingContractAddress, amountWei)
      .send({ from: account });
    
    console.log("Approval successful:", tx);
    alert(`Successfully approved ${amount} VNST for staking!`);
  } catch (err) {
    console.error("Approval failed:", err);
    alert('Approval failed: ' + (err.message || err));
  }
});

stakeBtn.addEventListener('click', async () => {
  if (!account) {
    alert('Please connect your wallet first');
    return;
  }
  
  try {
    const amount = document.getElementById('stakeAmount').value;
    const referralInput = document.getElementById('referralAddress').value.trim();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount to stake');
      return;
    }
    
    if (Number(amount) > maxStakeLimit) {
      alert(`Maximum stake amount is ${maxStakeLimit} VNST`);
      return;
    }
    
    if (!web3.utils.isAddress(referralInput)) {
      alert("Please enter a valid referral address (0x...)");
      return;
    }

    // Check contract status
    const c = contract();
    const isPaused = await c.methods.paused().call();
    if (isPaused) {
      alert('Contract is currently paused. Please try later.');
      return;
    }

    const amountWei = web3.utils.toWei(amount, 'ether');

    // Check allowance
    const t = vnstTokenContract();
    const allowance = await t.methods.allowance(account, stakingContractAddress).call();
    
    if (web3.utils.toBN(allowance).lt(web3.utils.toBN(amountWei))) {
      alert('Please approve VNST tokens first');
      return;
    }

    // Check balance
    const balance = await t.methods.balanceOf(account).call();
    if (web3.utils.toBN(balance).lt(web3.utils.toBN(amountWei))) {
      alert('Insufficient VNST balance');
      return;
    }

    // Send staking transaction
    const tx = await c.methods.stake(amountWei, referralInput)
      .send({ 
        from: account,
        gas: 500000 
      });
    
    console.log("Staking successful:", tx);
    alert('Staking successful!');
    await refreshUI();
  } catch (err) {
    console.error("Staking failed:", err);
    
    let errorMessage = 'Staking failed';
    if (err.message.includes('revert')) {
      errorMessage += ': Contract rejected the transaction';
      if (err.message.includes('Invalid referral')) {
        errorMessage += ' - Invalid referral address';
      } else if (err.message.includes('Amount too high')) {
        errorMessage += ` - Amount exceeds maximum stake limit of ${maxStakeLimit} VNST`;
      }
    } else {
      errorMessage += ': ' + (err.message || err);
    }
    
    alert(errorMessage);
  }
});

claimTokenBtn.addEventListener('click', async () => {
  if (!account) {
    alert('Please connect your wallet first');
    return;
  }
  
  try {
    const c = contract();
    const tx = await c.methods.claimRewards().send({ from: account });
    console.log("Claim successful:", tx);
    alert('VNT rewards claimed successfully!');
    await refreshUI();
  } catch (err) {
    console.error("Claim failed:", err);
    alert('Claim failed: ' + (err.message || err));
  }
});

// Helper Functions
async function showLevelReferralData() {
  const c = contract();
  const levels = 5;
  const container = document.getElementById('levelData');

  container.innerHTML = '';
  
  for (let level = 0; level < levels; level++) {
    const users = await c.methods.getLevelReferrals(account, level).call();
    let totalStaked = 0;

    for (let u of users) {
      const stakeData = await c.methods.stakes(u).call();
      totalStaked += parseFloat(stakeData.amount);
    }

    const div = document.createElement('div');
    div.innerHTML = `<b>Level ${level + 1}</b>: ${users.length} Members | Total Staked: ${(totalStaked / 1e18).toFixed(2)} VNST`;
    container.appendChild(div);
  }
}

async function checkUnlockedLevels() {
  const c = contract();
  const direct = await c.methods.getReferralCount(account).call();
  const required = [2, 2, 2, 2, 2]; // These should ideally come from contract

  const unlockDiv = document.getElementById('levelUnlockStatus');
  unlockDiv.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const isUnlocked = direct >= required[i];
    const div = document.createElement('div');
    div.innerHTML = `Level ${i + 1}: ${isUnlocked ? '✅ Unlocked' : '🔒 Locked (Need ' + required[i] + ' referrals)'}`;
    unlockDiv.appendChild(div);
  }
}

// Auto refresh every 30 seconds
setInterval(() => account && refreshUI(), 30000);
