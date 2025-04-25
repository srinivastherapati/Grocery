import { useContext } from "react";
import logoImg from "../assets/logoImg.jpg";
import Buttons from "./UI/Buttons";
import CartContext from "./Store/CartContext.jsx";
import UserProgressContext from "./Store/UserProgressContext.jsx";
export default function Header({ isAdmin }) {
  const crtCntxt = useContext(CartContext);

  const cartValue = crtCntxt.items.reduce((totalItems, item) => {
    return totalItems + item.quantity;
  }, 0);

  const userProgressCtx = useContext(UserProgressContext);
  function handleShowCart() {
    userProgressCtx.showCart();
  }
  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="Restraunt Image" />
        <h1>Grocery Store</h1>
      </div>
      <nav>
        {!isAdmin && (
          <Buttons onClick={handleShowCart}> Cart ({cartValue})</Buttons>
        )}
      </nav>
    </header>
  );
}
