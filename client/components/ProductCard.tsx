import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/lib/cart";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
  isLowStock?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  salePrice,
  image,
  isNew,
  isSale,
  isLowStock,
}: ProductCardProps) => {
  const { saved: isWishlisted, toggle: toggleWishlist } = useWishlist({ id, name, price: salePrice ?? price, image, category: "Amelie Milano", colour: "Signature colour", option: "M" });
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({ id, name, price: salePrice ?? price, image, category: "Amelie Milano", colour: "Signature colour", option: "M", quantity: 1 });
    navigate("/cart");
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg bg-stone-100 mb-4">
        {/* Image */}
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <span className="bg-teal text-white text-xs font-medium px-3 py-1 rounded-full">
              New
            </span>
          )}
          {isSale && (
            <span className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              Sale
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-teal text-teal" : "text-stone-600"}
          />
        </button>

        {/* Add to Cart Button - Hidden until hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors duration-200 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button onClick={handleAddToCart} className="bg-white text-teal font-medium px-6 py-2 rounded-lg hover:bg-teal hover:text-white transition-colors duration-200 flex items-center gap-2">
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <Link to={`/product/${id}`}>
          <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-teal transition-colors mb-2 line-clamp-2">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-stone-500 line-through text-sm">
                BDT {price.toLocaleString()}
              </span>
              <span className="font-semibold text-teal">
                BDT {salePrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="font-semibold text-stone-900">
              BDT {price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
