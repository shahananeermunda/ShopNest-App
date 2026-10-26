
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    tax,
    total,
    clearCart,
  } = useCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <ShoppingBag size={54} strokeWidth={1.5} />

          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added anything yet.</p>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <header className="cart-header">
        <div className="cart-heading-content">
          <h1>Shopping Cart</h1>
          <p>
            {cartItems.length} different{" "}
            {cartItems.length === 1 ? "product" : "products"} in your cart
          </p>
        </div>

        <button
          type="button"
          className="clear-cart-button"
          onClick={() => setShowClearConfirm(true)}
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </header>

      <div className="cart-layout">
        {/* Cart items */}
        <section className="cart-items">
          {cartItems.map((item) => (
            <article
              className="cart-item"
              key={item.cartItemId || `${item.id}-${item.size || ""}`}
            >
              <div className="cart-item-image">
                <img
                  src={
                    item.thumbnail ||
                    item.image ||
                    item.images?.[0] ||
                    "/placeholder.png"
                  }
                  alt={item.title || item.name}
                />
              </div>

              <div className="cart-item-details">
                <h2>{item.title || item.name}</h2>

                {item.size && (
                  <p className="cart-item-size">
                    Size: {item.size}
                  </p>
                )}

                <p className="cart-item-price">
                  {formatPrice(Number(item.price) || 0)}
                </p>

                <div className="cart-item-actions">
                  <div
                    className="quantity-control"
                    aria-label={`Quantity for ${item.title || item.name}`}
                  >
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                {formatPrice(
                  (Number(item.price) || 0) * item.quantity
                )}
              </div>
            </article>
          ))}
        </section>

        {/* Order summary */}
        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="summary-row">
            <span>Estimated tax (18%)</span>
            <span>{formatPrice(tax)}</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <p className="tax-note">
            Tax is an estimate and may vary at checkout.
          </p>

          <button
            type="button"
            className="checkout-button"
            onClick={() =>
              window.alert("Checking out..")
            }
          >
            Proceed to Checkout
          </button>

          <Link to="/products" className="back-to-shopping">
            Continue Shopping
          </Link>
        </aside>
      </div>

      {/* Custom Clear Cart Confirmation */}
      {showClearConfirm && (
        <div
          className="clear-confirm-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowClearConfirm(false);
            }
          }}
        >
          <div
            className="clear-confirm-box"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="clear-confirm-title"
            aria-describedby="clear-confirm-description"
          >
            <div className="clear-confirm-icon">
              <Trash2 size={25} />
            </div>

            <h2 id="clear-confirm-title">Clear your cart?</h2>

            <p id="clear-confirm-description">
              Are you sure you want to remove all items from your cart?
              This action cannot be undone.
            </p>

            <div className="clear-confirm-actions">
              <button
                type="button"
                className="cancel-clear-button"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-clear-button"
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
