import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load saved cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("shopnest-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Unable to load cart:", error);
      return [];
    }
  });

  // Shared toast notification state
  const [toastMessage, setToastMessage] = useState("");

  function clearToast() {
    setToastMessage("");
  }

  function clearCart() {
    setCartItems([]);
  }

  // Save cart whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "shopnest-cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cartItems]);

  // Add product to cart and show notification
  function addToCart(product) {
    const productName =
      product.title || product.name || "Product";

    setToastMessage(`${productName} added to cart`);

    setCartItems((prevItems) => {
      const quantityToAdd = Number(product.quantity) || 1;

      const existingItem = prevItems.find(
        (item) =>
          String(item.id) === String(product.id) &&
          (item.size || "") === (product.size || "")
      );

      if (existingItem) {
        return prevItems.map((item) =>
          String(item.id) === String(product.id) &&
          (item.size || "") === (product.size || "")
            ? {
                ...item,
                quantity:
                  (Number(item.quantity) || 1) +
                  quantityToAdd,
              }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: quantityToAdd,
        },
      ];
    });
  }

  // Increase quantity
  function increaseQuantity(productId) {
    setCartItems((items) =>
      items.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // Decrease quantity
  function decreaseQuantity(productId) {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // Remove product
  function removeFromCart(productId) {
    setCartItems((items) =>
      items.filter((item) => item.id !== productId)
    );
  }

  // Cart item count
  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Price calculations
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        tax,
        total,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,

        // Toast notification values
        toastMessage,
        clearToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
