import React from "react";
import { Route, Routes } from "react-router";
import axios from "axios";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Header from "./components/Header";
import Drawer from "./components/Drawer/index";
import Orders from "./pages/Orders";
import AppContext from "./context";

function App() {
  const [items, setItems] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] =
          await Promise.all([
            axios.get("https://61917aef41928b0017690077.mockapi.io/cart"),
            axios.get("https://61917aef41928b0017690077.mockapi.io/favorites"),
            axios.get("https://61917aef41928b0017690077.mockapi.io/items"),
          ]);

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorite(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert("Ошибка при запросе данных ;(");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
    if (findItem) {
      setCartItems((prev) =>
        prev.filter((product) => Number(product.parentId) !== Number(obj.id))
      );
      await axios.delete(
        `https://61917aef41928b0017690077.mockapi.io/cart/${findItem.id}`
      );
    } else {
      setCartItems((prev) => [...prev, obj]);
      const { data } = await axios.post("https://61917aef41928b0017690077.mockapi.io/cart", obj);
      setCartItems((prev) => prev.map((item) => {
        if (item.parentId === data.parentId) {
          return {
            ...item,
            id: data.id,
          };
        }
        return item;
      }));
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://61917aef41928b0017690077.mockapi.io/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert("Ошибка при удаления из корзины");
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.some((favObj) => Number(favObj.id) === Number(obj.id))) {
        setFavorite((prev) =>
          prev.filter((item) => Number(item) !== Number(obj.id))
        );
        axios.delete(
          `https://61917aef41928b0017690077.mockapi.io/favorites/${obj.id}`
        );
      } else {
        const { data } = await axios.post(
          "https://61917aef41928b0017690077.mockapi.io/favorites",
          obj
        );
        setFavorite((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалось добавить в фавориты");
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                items={items}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                cartItems={cartItems}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          />

          <Route
            path="/favorites"
            exact
            element={<Favorites onAddToFavorite={onAddToFavorite} />}
          />

          <Route path="/orders" exact element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
