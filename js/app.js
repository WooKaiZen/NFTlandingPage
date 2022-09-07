//import ERC721Mintable from '../../build/contracts/ERC721Mintable.json';
//const { ERC721Mintable } = require('../../build/contracts/ERC721Mintable.json');
const { Web3 } = require('web3');

/*web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/8865033a87c9423ebc8ab20410bf8dd4'));
window.Contract = new this.web3.eth.Contract(abi,0xe01b36d8CC27A37644d0398dC3Cc54b8122c0198);*/
if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);
  checkChain();
} else if (window.web3) {
  window.web3 = new Web3(window.web3.currentProvider);
}

// METAMASK CONNECTION
const TIMEOUT = 1000;
const COLLECTION_NAME = 'FLUXN';
let editions = [];
let dots = 1;
let mintedTokens = 0;

window.addEventListener('DOMContentLoaded', () => {
  const onboarding = new MetaMaskOnboarding();
  const onboardButton = document.getElementById('connectWallet');
  const mintButton = document.getElementById('mint');
  let accounts;

  const updateButton = async () => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboardButton.innerText = 'Install MetaMask!';
      onboardButton.onclick = () => {
        onboardButton.innerText = 'Connecting...';
        onboardButton.disabled = true;
        onboarding.startOnboarding();
      };
    } else if (accounts && accounts.length > 0) {
      onboardButton.innerText = `✔ ...${accounts[0].slice(-4)}`;
      onboardButton.disabled = true;
      onboarding.stopOnboarding();
      checkOwner(accounts[0]);
    } else {
      onboardButton.innerText = 'Connect MetaMask!';
      onboardButton.onclick = async () => {
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        .then(function(accounts) {
          onboardButton.innerText = `✔ ...${accounts[0].slice(-4)}`;
          onboardButton.disabled = true;
          checkOwner(accounts[0]);
        });
      };
    }
  };

  updateButton();
  if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', (newAccounts) => {
      accounts = newAccounts;
      updateButton();
    });
  }
  
  const mint = async () => {
	  try {
		await window.Contract.methods.mint(accounts[0],mintedTokens+1).call();
	  }
	  catch(e) {
		  console.log(e);
	  }	  
	  mintedTokens += 1;
  };
  
  mintButton.onclick = mint();
});

const checkOwner = async (account) => {
  if(account) {
    let isOwner = false;
    let page = 1
    
    const data = await fetchWithRetry(`/.netlify/functions/isowner/?wallet=${account}&page=${page}`);

    isOwner = !isOwner ? data.isOwner : isOwner;
    updateStatusText(isOwner, true)
    
    editions = [...data.editions]
    let nextPage = data.next_page

    while(nextPage) {
      page = nextPage
      const data = await fetchWithRetry(`/.netlify/functions/isowner/?wallet=${account}&page=${page}`);

      isOwner = !isOwner ? data.isOwner : isOwner;
      updateStatusText(isOwner, true)
      
      editions = [...editions, ...data.editions]
      nextPage = data.next_page
    }

    updateStatusText(isOwner, false)
  }
}

function updateStatusText(isOwner, checking) {
  const statusText = document.querySelector('.owner-status');
  if(checking) {
    if(isOwner) {
      statusText.innerText = `You do own ${COLLECTION_NAME}!! Let's see how many${renderDots(dots)}`;
    } else {
      statusText.innerText = `Checking to see if you own any ${COLLECTION_NAME} ${renderDots(dots)}`;
    }
  } else {
    if(isOwner) {
      statusText.innerText = `You own ${editions.length} ${COLLECTION_NAME}!! `;
    } else {
      statusText.innerText = `You don't own any ${COLLECTION_NAME} `;
    }
  }
  dots = dots === 3 ? 1 : dots + 1;
}

function renderDots(dots) {
  let dotsString = '';
  for (let i = 0; i < dots; i++) {
    dotsString += '.';
  }
  return dotsString;
}

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(url)  {
  await timer(TIMEOUT);
  return new Promise((resolve, reject) => {
    const fetch_retry = (_url) => {
      return fetch(_url).then(async (res) => {
        const status = res.status;

        if(status === 200) {
          return resolve(res.json());
        }            
        else {
          console.error(`ERROR STATUS: ${status}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_url)
        }            
      })
      .catch(async (error) => {  
        console.error(`CATCH ERROR: ${error}`)  
        console.log('Retrying')    
        await timer(TIMEOUT)    
        fetch_retry(_url)
      }); 
    }
    return fetch_retry(url);
  });
}
