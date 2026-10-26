
import { BrowserRouter, Routes, Route } from "react-router-dom";



import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer"
import Products from "./pages/Products";
import ProductDetail from "./components/ProductDetail";
import Cart from "./pages/Cart";
import { useCart } from "./context/CartContext";
import Toast from "./components/ShowToast";

import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";


function App() {
  const { toastMessage, clearToast } = useCart();
  return (
    <>
        <Navbar />

        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
         <Toast
        message={toastMessage}
        onClose={clearToast}
      />
        <Footer/>
    </>
      
  );
}

export default App;
