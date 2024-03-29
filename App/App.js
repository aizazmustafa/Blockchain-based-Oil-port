
console.log("Ahsan Khan")
// Connect to a gateway peer
const pidusage = require('pidusage');

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../App/connectionprofile/CAUtil');
const { buildCCPOrg1, buildWallet } = require('../App/connectionprofile/AppUtil');
console.log("Ahsan Khan at line 11 check")
const channelName = process.env.CHANNEL_NAME || 'channel1';
const chaincodeName = process.env.CHAINCODE_NAME || 'billoflading';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'ehzazmustafa01';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}
console.log("Ahsan Khan at line 22 check")


async function main(billId, shippersDetail, receiverDetail, thirdPartyCharges, productInfo, carrierDetail, transportationMeans, taxDetail) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
        console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
			createbilloflading(contract,billId, shippersDetail, receiverDetail, thirdPartyCharges, productInfo, carrierDetail, transportationMeans, taxDetail)
            console.log('*** on line 67 done Result: committed on ledger with data'+005);
			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			// //await contract.submitTransaction('InitLedger');
			// console.log('*** Result: committed');

			// Let's try a query type operation (function).
			// This will be sent to just one peer and the results will be shown.
			//console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
			// let result = await contract.evaluateTransaction('GetAllAssets');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// Now let's try to submit a transaction.
			// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
			// to the orderer to be committed by each of the peer's to the channel ledger.
			// console.log('\n--> Submit Transaction: CreateERC Tken, creates new asset with ID, color, owner, size, and appraisedValue arguments');
			// result = await contract.submitTransaction('createErctoken', '002', 'Ahsan Khan', '5', 'Tom', '1300',"akk");
			// console.log('*** on line 86Result: committed on ledger with data 001');
			// if (`${result}` !== '') {
			// 	console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			// }

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
			// result = await contract.evaluateTransaction('ReadAsset', 'a001');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
			// result = await contract.evaluateTransaction('AssetExists', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
			// await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
			// console.log('*** Result: committed');

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			// result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// try {
			// 	// How about we try a transactions where the executing chaincode throws an error
			// 	// Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
			// 	console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
			// 	await contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300');
			// 	console.log('******** FAILED to return an error');
			// } catch (error) {
			// 	console.log(`*** Successfully caught the error: \n    ${error}`);
			// }

			// console.log('\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom');
			// await contract.submitTransaction('TransferAsset', 'asset1', 'Tom');
			// console.log('*** Result: committed');

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			// result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}
}

//Convert token to dollars 
async function VerifyBill(Billid,res) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
       // console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
           
			result =await contract.submitTransaction("verifyBillByOilRefinery", Billid);
		//	console.log('*** Result: committed');
		//	console.log('*** on line 180Result: committed on ledger with data'+erctokenId);
		//	res.send('Data Received: '+result );
			if (`${result}` !== '') {
			//	res.send(`*** Result: ${prettyJSONString(result.toString())}` );
			//	console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			}
			







		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);

		process.exit(1);
	}
}






// const createErctoken=async (contract,erctokenId,tokenuserid,tokenvalue,tokenpurpose,takoenvalidity, Specifiedmerchants) =>{
//     console.log('\n--> Submit Transaction: CreateERC Tken, creates new asset with ID,owner,value, validity, and specified merchants');
//     result = await contract.submitTransaction('createErctoken', erctokenId, tokenuserid, tokenvalue, tokenpurpose, takoenvalidity,Specifiedmerchants);
//     console.log('*** on line 138Result: committed on ledger with data'+tokenuserid);
//     if (`${result}` !== '') {
//         console.log(`*** Result: ${prettyJSONString(result.toString())}`);
//     }

// }
///////////////////////////Oil and gas /////////////////////////////////////



async function Updatebill(Billid,Billdata) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
       // console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
           
			result =await contract.submitTransaction("updateCustomOptions", Billid,Billdata);
		//	console.log('*** Result: committed');
		//	console.log('*** on line 180Result: committed on ledger with data'+erctokenId);
		//	res.send('Data Received: '+result );
			if (`${result}` !== '') {
			//	res.send(`*** Result: ${prettyJSONString(result.toString())}` );
			//	console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			}
			







		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);

		process.exit(1);
	}
}






////////////////////////////////////////////////////////////
const createbilloflading=async (contract,billId, shippersDetail, receiverDetail, thirdPartyCharges, productInfo, carrierDetail, transportationMeans, taxDetail) =>{
  //  console.log('\n--> Submit Transaction: CreateERC Tken, creates new asset with ID,owner,value, validity, and specified merchants');
  const startTime = new Date().getTime();
  let numTransactions=2000
  const latencies = []; // Array to store transaction latencies
const Avgcpuusage=[];
const Avgmemoryusage=[];
let cpuusagesum=0
let  memoryusagesum=0
  for (let i = 1000; i < numTransactions; i++) {

	   // Capture resource usage before each transaction
	   const beforeUsage = await pidusage(process.pid);
  result = await contract.submitTransaction('createBillOfLading', i, shippersDetail, receiverDetail, thirdPartyCharges, productInfo, carrierDetail, transportationMeans, taxDetail);
    //console.log('*** on line 215Result: committed on ledger with data'+billId);
    if (`${result}` !== '') {
      //  console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    }
	const endTime = new Date().getTime();
	const latency = endTime - startTime;
	 // Capture resource usage after each transaction
	 const afterUsage = await pidusage(process.pid);

	 const cpuUsage = afterUsage.cpu - beforeUsage.cpu;
	 const memoryUsage = afterUsage.memory - beforeUsage.memory;
 cpuusagesum+=cpuUsage
 memoryusagesum+=memoryUsage
	//  console.log(`Transaction ${i + 1} CPU Usage: ${cpuUsage.toFixed(2)}%`);
	//  console.log(`Transaction ${i + 1} Memory Usage: ${memoryUsage} bytes`);
	//  console.log(`Transaction ${i + 1} Execution Time: ${endTime - startTime} milliseconds`);
 
    latencies.push(latency);
	Avgcpuusage.push(cpuUsage);
	Avgmemoryusage.push(memoryUsage)
}
const endTime = new Date().getTime();

const totalTime = endTime - startTime;
const throughput = 1000 / (totalTime / 1000); // Transactions per second

console.log(`Total time taken for ${1000} transactions: ${totalTime} milliseconds`);
console.log(`Transaction Throughput: ${throughput.toFixed(2)} transactions per second`);


// Calculate latency statistics
const minLatency = Math.min(...latencies);
const maxLatency = Math.max(...latencies);
const avgLatency = latencies.reduce((sum, latency) => sum + latency, 0) / latencies.length;

// Calculate the 95th percentile latency
const percentile = 95;
const sortedLatencies = latencies.sort((a, b) => a - b);
const index = Math.ceil((percentile / 100) * sortedLatencies.length) - 1;
const percentileLatency = sortedLatencies[index];

console.log(`Minimum Latency: ${minLatency} milliseconds`);
console.log(`Maximum Latency: ${maxLatency} milliseconds`);
console.log(`Average Latency: ${avgLatency.toFixed(2)} milliseconds`);
console.log(`${percentile}th Percentile Latency: ${percentileLatency.toFixed(2)} milliseconds`);

// Calculate Memory  statistics
const minmemory = Math.min(...Avgmemoryusage);
const maxmemory= Math.max(...Avgmemoryusage);
const avgmem=memoryusagesum/1000
console.log(`Minimum Memory Usage: ${minmemory} Bytes`);
console.log(`Maximum Memory Usage : ${maxmemory} Bytes`);
console.log(`Average Memory Usage : ${avgmem} Bytes`);

// Calculate Cpu  statistics
const mincpu = Math.min(...Avgcpuusage);
const maxcpu= Math.max(...Avgcpuusage);
const avgcpu=cpuusagesum/1000
console.log(`Minimum Cpu Usage: ${mincpu} %`);
console.log(`Maximum Cpu Usage : ${maxcpu} %`);
console.log(`Average Cpu Usage : ${avgcpu} %`);





}

 //connectotserver()
 const bodyParser = require('body-parser')
 console.log("connecting ahsan khan")
 const express = require('express')
 const App=express()
 App.use(bodyParser.json())
App.use(bodyParser.urlencoded({ extended: true}))
 
App.get('/creatbilloflading', (req, res) => {
    console.log("url hits")
    let billId= req.body.billId
  let shippersDetail= req.body.shippersDetail
    let receiverDetail = req.body.receiverDetail
	let thirdPartyCharges = req.body.thirdPartyCharges
  let  productInfo= req.body. productInfo
  let carrierDetail= req.body.carrierDetail
   let transportationMeans= req.body.transportationMeans
   let taxDetail= req.body.taxDetail
   main(billId, shippersDetail, receiverDetail, thirdPartyCharges, productInfo, carrierDetail, transportationMeans, taxDetail);
    res.send('Data Received:sucessfully  created bill of lading  '+billId);
    
})

App.get('/verifyBillByOilRefinery', async (req, res) => {
    console.log("verifytokenurl hitsurl hits")
	let billId= req.body.bill
      const startTime = new Date().getTime();
  let numTransactions=2000
  const latencies = []; // Array to store transaction latencies
const Avgcpuusage=[];
const Avgmemoryusage=[];
let cpuusagesum=0
let  memoryusagesum=0
  for (let i =1000; i < numTransactions; i++) {
  
   // Capture resource usage before each transaction
   const beforeUsage = await pidusage(process.pid);
   
  VerifyBill(i );



  const endTime = new Date().getTime();
  const latency = endTime - startTime;
   // Capture resource usage after each transaction
   const afterUsage = await pidusage(process.pid);

   const cpuUsage = afterUsage.cpu - beforeUsage.cpu;
   const memoryUsage = afterUsage.memory - beforeUsage.memory;
cpuusagesum+=cpuUsage
memoryusagesum+=memoryUsage
  //  console.log(`Transaction ${i + 1} CPU Usage: ${cpuUsage.toFixed(2)}%`);
  //  console.log(`Transaction ${i + 1} Memory Usage: ${memoryUsage} bytes`);
  //  console.log(`Transaction ${i + 1} Execution Time: ${endTime - startTime} milliseconds`);

  latencies.push(latency);
  Avgcpuusage.push(cpuUsage);
  Avgmemoryusage.push(memoryUsage)
}
const endTime = new Date().getTime();

const totalTime = endTime - startTime;
const throughput = 1000 / (totalTime / 1000); // Transactions per second

console.log(`Total time taken for ${1000} transactions: ${totalTime} milliseconds`);
console.log(`Transaction Throughput: ${throughput.toFixed(2)} transactions per second`);


// Calculate latency statistics
const minLatency = Math.min(...latencies);
const maxLatency = Math.max(...latencies);
const avgLatency = latencies.reduce((sum, latency) => sum + latency, 0) / latencies.length;

// Calculate the 95th percentile latency
const percentile = 95;
const sortedLatencies = latencies.sort((a, b) => a - b);
const index = Math.ceil((percentile / 100) * sortedLatencies.length) - 1;
const percentileLatency = sortedLatencies[index];

console.log(`Minimum Latency: ${minLatency} milliseconds`);
console.log(`Maximum Latency: ${maxLatency} milliseconds`);
console.log(`Average Latency: ${avgLatency.toFixed(2)} milliseconds`);
console.log(`${percentile}th Percentile Latency: ${percentileLatency.toFixed(2)} milliseconds`);

// Calculate Memory  statistics
const minmemory = Math.min(...Avgmemoryusage);
const maxmemory= Math.max(...Avgmemoryusage);
const avgmem=memoryusagesum/1000
console.log(`Minimum Memory Usage: ${minmemory} Bytes`);
console.log(`Maximum Memory Usage : ${maxmemory} Bytes`);
console.log(`Average Memory Usage : ${avgmem} Bytes`);

// Calculate Cpu  statistics
const mincpu = Math.min(...Avgcpuusage);
const maxcpu= Math.max(...Avgcpuusage);
const avgcpu=cpuusagesum/1000
console.log(`Minimum Cpu Usage: ${mincpu} %`);
console.log(`Maximum Cpu Usage : ${maxcpu} %`);
console.log(`Average Cpu Usage : ${avgcpu} %`);
res.send('Sucessfully verfied bill  ');

 
})



App.get('/updatebill', async (req, res) => {
    console.log("verifytokenurl hitsurl hits")
	let billId= req.body.bill
	let Billdata= req.body.Billdata
      const startTime = new Date().getTime();
  let numTransactions=2000
  const latencies = []; // Array to store transaction latencies
const Avgcpuusage=[];
const Avgmemoryusage=[];
let cpuusagesum=0
let  memoryusagesum=0
  for (let i =1000; i < numTransactions; i++) {
  
   // Capture resource usage before each transaction
   const beforeUsage = await pidusage(process.pid);
   
   Updatebill(i,Billdata)



  const endTime = new Date().getTime();
  const latency = endTime - startTime;
   // Capture resource usage after each transaction
   const afterUsage = await pidusage(process.pid);

   const cpuUsage = afterUsage.cpu - beforeUsage.cpu;
   const memoryUsage = afterUsage.memory - beforeUsage.memory;
cpuusagesum+=cpuUsage
memoryusagesum+=memoryUsage
  //  console.log(`Transaction ${i + 1} CPU Usage: ${cpuUsage.toFixed(2)}%`);
  //  console.log(`Transaction ${i + 1} Memory Usage: ${memoryUsage} bytes`);
  //  console.log(`Transaction ${i + 1} Execution Time: ${endTime - startTime} milliseconds`);

  latencies.push(latency);
  Avgcpuusage.push(cpuUsage);
  Avgmemoryusage.push(memoryUsage)
}
const endTime = new Date().getTime();

const totalTime = endTime - startTime;
const throughput = 1000 / (totalTime / 1000); // Transactions per second

console.log(`Total time taken for ${1000} transactions: ${totalTime} milliseconds`);
console.log(`Transaction Throughput: ${throughput.toFixed(2)} transactions per second`);


// Calculate latency statistics
const minLatency = Math.min(...latencies);
const maxLatency = Math.max(...latencies);
const avgLatency = latencies.reduce((sum, latency) => sum + latency, 0) / latencies.length;

// Calculate the 95th percentile latency
const percentile = 95;
const sortedLatencies = latencies.sort((a, b) => a - b);
const index = Math.ceil((percentile / 100) * sortedLatencies.length) - 1;
const percentileLatency = sortedLatencies[index];

console.log(`Minimum Latency: ${minLatency} milliseconds`);
console.log(`Maximum Latency: ${maxLatency} milliseconds`);
console.log(`Average Latency: ${avgLatency.toFixed(2)} milliseconds`);
console.log(`${percentile}th Percentile Latency: ${percentileLatency.toFixed(2)} milliseconds`);

// Calculate Memory  statistics
const minmemory = Math.min(...Avgmemoryusage);
const maxmemory= Math.max(...Avgmemoryusage);
const avgmem=memoryusagesum/1000
console.log(`Minimum Memory Usage: ${minmemory} Bytes`);
console.log(`Maximum Memory Usage : ${maxmemory} Bytes`);
console.log(`Average Memory Usage : ${avgmem} Bytes`);

// Calculate Cpu  statistics
const mincpu = Math.min(...Avgcpuusage);
const maxcpu= Math.max(...Avgcpuusage);
const avgcpu=cpuusagesum/1000
console.log(`Minimum Cpu Usage: ${mincpu} %`);
console.log(`Maximum Cpu Usage : ${maxcpu} %`);
console.log(`Average Cpu Usage : ${avgcpu} %`);
res.send('Sucessfully verfied bill  ');

 
})



 App.get('/', (req, res)=>{
 res.json({"success":true,"message":"successfully listinig "})

 })
 App.get('/test', (req, res)=>{
     res.json({"success":true,"message":"test succesfully listning "})
     console.log("url hits")
    // console.log(JSON.stringify(res.json))
     //main();
     })

    //  App.get('/createtoken', (req, res)=>{
    //     res.json({"success":true,"message":"test succesfully listning create token  "})
    //     console.log("url hits create token")
    //     var email = res.data() 
    //     console.log(JSON.stringify(email))
    //     //main();
    //     })
 App.listen(9000,()=>{
     console.log("listening on 9000")
 })