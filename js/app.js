// METAMASK CONNECTION
const TIMEOUT = 1000;
const COLLECTION_NAME = 'FLUXN';
let editions = [];
let dots = 1;
let mintedTokens = 0;

window.addEventListener('DOMContentLoaded', async () => {
  const onboarding = new MetaMaskOnboarding();
  const onboardButton = document.getElementById('connectWallet');
  const mintButton = document.getElementById('mint');
  const addressText = document.getElementById('addrId');
  const testButton = document.getElementById('test-btn');
  const testText = document.getElementById('testId');
  let accounts;
  console.log(onboarding);
	
  const { ethereum } = window;
  let metamaskInstalled = Boolean(ethereum && ethereum.isMetaMask);
  console.log("Metamask installed:",metamaskInstalled);
  console.log("Ethereum:",ethereum);
  console.log("Ethereum providers:",ethereum.providers);
	
  //https://medium.com/coinmonks/compiling-deploying-and-interacting-with-smart-contract-using-javascript-641cf0342824
  //const provider = ethereum.providers.find((provider) => provider.isMetaMask);
  const provider = new ethers.providers.Web3Provider(ethereum);
  console.log("Provider:",provider);
  //https://ethereum.stackexchange.com/questions/120817/how-to-call-a-contract-function-method-using-ethersjs
  /*const walletAddress = accounts[0];
  const signer = provider.getSigner(walletAddress);
  console.log("signer:",signer);*/
  window.web3 = new Web3(provider);
  console.log("web3:",window.web3);
  /*const test_account = window.web3.eth.accounts.create();
  console.log("Test account :",test_account);*/
  //https://medium.com/0xcode/interacting-with-smart-contracts-using-web3-js-34545a8a1ebd :
  //const wallet = new ethers.Wallet(test_account.privateKey, provider);
  //alternative? https://www.quicknode.com/guides/web3-sdks/how-to-generate-a-new-ethereum-address-in-javascript
  //console.log("Wallet:",wallet);
	
  //window.Contract = new web3.eth.Contract(abi, "0xe01b36d8CC27A37644d0398dC3Cc54b8122c0198");
  /*window.Contract = new ethers.Contract("0xe01b36d8CC27A37644d0398dC3Cc54b8122c0198",abi,wallet);//new ethers.Contract( address , abi , wallet );
  console.log("Contract methods:",window.Contract.methods);
  console.log("Contract functions:",window.Contract.functions);*/
	
  /*const data = await ethereum.request({
    method: 'eth_getStorageAt',
    params: [ "0xe01b36d8CC27A37644d0398dC3Cc54b8122c0198" ],
  })
  
  console.log(data);*/

	//Created check function to see if the Metamask extension is installed
	const isMetaMaskInstalled = () => {
		//Have to check the ethereum binding on the window object to see if it's installed
		return Boolean(ethereum && ethereum.isMetaMask);
	}

	//This will start the onboarding proccess
	const onClickInstall = () => {
		onboardButton.innerText = 'Onboarding in progress';
		onboardButton.disabled = true;
		//On this object we have startOnboarding which will start the onboarding process for our end user
		onboarding.startOnboarding();
	};

	const onClickConnect = async () => {
		try {
		  // Will open the MetaMask UI
		  // You should disable this button while the request is pending!
		  /*const provider = ethereum.providers.find((provider) => provider.isMetaMask);*/
		  accounts = await ethereum.request({ method: 'eth_requestAccounts' }); //provider
		  console.log(accounts[0]);
		  console.log(accounts[1]);
		  const walletAddress = accounts[0];
		  const signer = provider.getSigner(walletAddress);
		  console.log("signer:",signer);
		  window.Contract = new ethers.Contract("0xe01b36d8CC27A37644d0398dC3Cc54b8122c0198",abi,signer);
		  console.log("Contract methods:",window.Contract.methods);
		  console.log("Contract functions:",window.Contract.functions);
		  // already minted tokens
		  mintedTokens = await window.Contract.functions.totalSupply();
		  console.log("Minted Tokens:",supply.toNumber());
		} catch (error) {
		  console.error(error);
		}
	}

	const MetaMaskClientCheck = () => {
		//Now we check to see if MetaMask is installed
		if (!isMetaMaskInstalled()) {
		  //If it isn't installed we ask the user to click to install it
		  onboardButton.innerText = 'Click here to install MetaMask!';
		  //When the button is clicked we call this function
		  onboardButton.onclick = onClickInstall;
		  //The button is now disabled
		  onboardButton.disabled = true;  
		  console.log("metamask not installed");   
		} else {
		  //If MetaMask is installed we ask the user to connect to their wallet
		  onboardButton.innerText = 'Connect';
		  //When the button is clicked we call this function to connect the users MetaMask Wallet
		  onboardButton.onclick = onClickConnect;
		  //The button is now enabled
		  onboardButton.disabled = false;
		}
	};

	MetaMaskClientCheck();
	// TODO: remove to test minting
        /*mintButton.addEventListener('click', async () => {
            //we use eth-accounts because it returns a list of addresses owned by us
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            //We take the first address in the array of addresses and display it
            addressText.innerHTML = accounts[0] || 'Not able to get accounts';
        });*/

  /*const updateButton = async () => {
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
  }*/
  
 const mint = async () => {
	  console.log("Minting");
	  try {
		console.log("Minting",mintedTokens+1,"by",accounts[0]);
		estimated_gas = await window.Contract.functions.mint(accounts[0],mintedTokens+1).estimateGas();//.call({ from: accounts[0], gas: 4712388, gasPrice: 100000000000}); // methods
		mintedTokens = await window.Contract.functions.totalSupply();
		console.log("Minted Tokens:",supply.toNumber());
		addressText.innerHTML = "Minted token "+mintedTokens;
	  }
	  catch(e) {
		  console.log(e);
	  }	  
	  //mintedTokens += 1;
  };
  
  //mintButton.onclick = mint();
	
  mintButton.addEventListener('click', async () => {
	  mint();
  });
	
  const testContract = async() => {
	  console.log("Testing");
	  try {
		  _removeTokenFromOwnerEnumeration(accounts[0],2);
		  _removeTokenFromAllTokensEnumeration(2);
		  let newSupply = await window.Contract.functions.totalSupply();
		  console.log("Supply:",newSupply,mintedTokens);
		  if (newSupply != mintedTokens-1) {
			  console.log("Error: new supply should be decremented");
		  }
	  }
	  catch(e) {
		  console.log(e);
	  }
  }
  
  testButton.addEventListener('click', async () => {
	  testContract();
  });
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
      statusText.innerText = `Checking to see if you own any ${COLLECTION_NAME}${renderDots(dots)}`;
    }
  } else {
    if(isOwner) {
      statusText.innerText = `You own ${editions.length} ${COLLECTION_NAME}!!`;
    } else {
      statusText.innerText = `You don't own any ${COLLECTION_NAME}`;
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
