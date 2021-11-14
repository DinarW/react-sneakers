import React from 'react';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Card from './components/Card';

 function App() {
  const [items, setItems] = React.useState([]);
  const [cartOpened, setCartOpened] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);

  React.useEffect(() => {
    fetch('https://61917aef41928b0017690077.mockapi.io/items')
      .then((res) => res.json())
      .then((json) => setItems(json))
  }, []);

  const onAddToCart = (obj) => {
    const add = cartItems.filter((porduct) => (porduct.title === obj.title) && (porduct.price === obj.price)).length
    !add ? setCartItems(prev => [...prev, obj]) : alert('Товар уже добавлен в корзину!');
  };

  return (
    <div className="wrapper clear">
      {cartOpened && <Drawer items={cartItems} onClose={() => {setCartOpened(false)}} />}

      <Header onClickCart = {() => setCartOpened(true)} />

      <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>Все кроссовки</h1>
          <div className="search-block d-flex">
            <img src="/img/search.svg" alt="search" />
            <input placeholder="Поиск..." />
          </div>
        </div>
        <div className="d-flex flex-wrap">
          {
            items.map((item) => (
            <Card 
              title={item.title} 
              price={item.price} 
              imageUrl={item.imageUrl} 
              onFavorite={() => console.log('Добавили в закладки')}
              onPlus={() => onAddToCart(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
