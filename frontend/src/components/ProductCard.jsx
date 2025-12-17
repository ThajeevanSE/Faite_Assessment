import { addToCart } from "../services/cartService";

function ProductCard({ product }) {

  const handleAdd = async () => {
    await addToCart(product.id);
    alert("Added to cart");
  };

  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-bold">{product.title}</h3>
      <p>{product.description}</p>
      <p className="text-green-600">₹{product.price}</p>

      <button onClick={handleAdd} className="btn mt-2">
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
