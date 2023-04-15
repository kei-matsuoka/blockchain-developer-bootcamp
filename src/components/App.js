import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config.json';

import { 
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
  loadAllOrders,
  subscribeToEvents
 } from '../store/interactions';

import Balance from './Balance';
import Markets from './Markets';

import Navbar from './Navbar';
import Order from './Order';
import OrderBook from './OrderBook';
import PriceChart from './PriceChart';
import Trades from './Trades';

function App() {

  //reducerにactionを送るためのdispatch関数を読み込む
  const dispatch = useDispatch()

  //ブロックチェーンから各情報を読み込んで、storeに保存
  const loadBlockchainData = async ()=>{
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })
    
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })

    const DApp = config[chainId].DApp
    const mETH = config[chainId].mETH
    await loadTokens(provider, [DApp.address, mETH.address], dispatch)

    const exchangeConfig = config[chainId].exchange
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch)

    loadAllOrders(provider, exchange, dispatch)

    subscribeToEvents(exchange, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()
  });

  return (
    <div>
      <Navbar/>

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>
          <Markets/>
          <Balance/>
          <Order/>
        </section>
        <section className='exchange__section--right grid'>
          <PriceChart/>
          {/* Transactions */}
          <Trades/>
          <OrderBook/>
        </section>
      </main>
      {/* Alert */}
    </div>
  );
}

export default App;

