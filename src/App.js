import React from 'react';
import { Route, Routes } from 'react-router';
import axios from 'axios';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Header from './components/Header';
import Drawer from './components/Drawer';

function App() {
  const [items, setItems] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorite] = React.useState(false);

  React.useEffect(() => {
    axios.get('https://61917aef41928b0017690077.mockapi.io/items/').then((res) => {
      setItems(res.data);
    });
    axios.get('https://61917aef41928b0017690077.mockapi.io/cart/').then((res) => {
      setCartItems(res.data);
    });
    axios.get('https://61917aef41928b0017690077.mockapi.io/favorites').then((res) => {
      setFavorite(res.data);
    })
  }, []);

  const onAddToCart = async (obj) => {
    await axios.post('https://61917aef41928b0017690077.mockapi.io/cart/', obj);
    await setCartItems(prev => [...prev, obj]);
  };

  const onRemoveItem = async (id) => {
    try {
      await axios.delete(`https://60d62397943aa60017768e77.mockapi.io/cart/:${id}`);
      await setCartItems((prev) => prev.filter((item) => item.id !== id));
      await setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    } 
    catch (error) {
      alert('Ошибка при удаления из корзины');
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        await axios.delete(`/favorites/:${obj.id}`);
      } else {
        const { data } = await axios.post('/favorites', obj);
        setFavorite((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты');
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  }

  return (
    <div className="wrapper clear">
      {cartOpened && <Drawer items={cartItems} onClose={() => {setCartOpened(false)}} onRemove={onRemoveItem} />}

      <Header onClickCart = {() => setCartOpened(true)} />
      <Routes>
        <Route path="/" exact element={
          <Home
            items={items}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToFavorite={onAddToFavorite}
            onAddToCart={onAddToCart}/>
          } />

        <Route path="/favorites" exact element={
          <Favorites items={favorites} onAddToFavorite={onAddToFavorite} />
        } />
      </Routes>
    </div>
  );
}

export default App;
