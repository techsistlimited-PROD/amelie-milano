import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, ShoppingBag, X } from "lucide-react";
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
  const onSale = salePrice != null && salePrice < price;
  const displayPrice = onSale ? salePrice : price;
  const { saved: isWishlisted, toggle: toggleWishlist } = useWishlist({ id, name, price: displayPrice, image, category: "Amelie Milano", colour: "Signature colour", option: "M" });
  const navigate = useNavigate();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, name, price: displayPrice, image, category: "Amelie Milano", colour: "Signature colour", option: "M", quantity: 1 });
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
            loading="lazy"
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
          {onSale && (
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
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors duration-200 flex items-end justify-center gap-2 pb-4 opacity-0 group-hover:opacity-100">
          <button onClick={() => setQuickViewOpen(true)} className="bg-white text-teal font-medium px-4 py-2 rounded-lg hover:bg-teal hover:text-white transition-colors duration-200 flex items-center gap-2">
            <Eye size={17} />
            Quick View
          </button>
          <button onClick={handleAddToCart} className="bg-white text-teal font-medium px-4 py-2 rounded-lg hover:bg-teal hover:text-white transition-colors duration-200 flex items-center gap-2">
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      {quickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickViewOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby={`quick-view-${id}`} className="relative grid w-full max-w-2xl gap-6 bg-white p-5 md:grid-cols-2 md:p-7">
            <button type="button" aria-label="Close quick view" onClick={() => setQuickViewOpen(false)} className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-stone-600 shadow-sm hover:text-teal"><X size={18} /></button>
            <img src={image} alt={name} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover" />
            <div className="flex flex-col justify-center pr-4">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-teal">Amelie Milano</p>
              <h2 id={`quick-view-${id}`} className="font-serif text-3xl text-stone-900">{name}</h2>
              <p className="mt-4 text-lg text-stone-700">
                {onSale ? (
                  <>
                    <span className="text-stone-400 line-through text-base mr-2">BDT {price.toLocaleString()}</span>
                    <span className="font-semibold text-teal">BDT {salePrice!.toLocaleString()}</span>
                  </>
                ) : (
                  <>BDT {price.toLocaleString()}</>
                )}
              </p>
              <button type="button" onClick={() => { setQuickViewOpen(false); navigate(`/product/${id}`); }} className="btn-primary mt-7 inline-flex justify-center">View Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Info */}
      <div>
        <Link to={`/product/${id}`}>
          <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-teal transition-colors mb-2 line-clamp-2">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {onSale ? (
            <>
              <span className="text-stone-500 line-through text-sm">
                BDT {price.toLocaleString()}
              </span>
              <span className="font-semibold text-teal">
                BDT {salePrice!.toLocaleString()}
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
