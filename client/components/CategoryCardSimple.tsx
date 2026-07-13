import { Link } from "react-router-dom";

interface CategoryCardSimpleProps {
  name: string;
  image: string;
  href: string;
}

const CategoryCardSimple = ({ name, image, href }: CategoryCardSimpleProps) => {
  return (
    <div className="text-center">
      <Link to={href} className="block mb-3 overflow-hidden rounded-sm">
        <img
          src={image}
          alt={name}
          className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <h3 className="font-sans font-medium text-stone-800 mb-2 text-xs md:text-sm tracking-wide">
        {name.toUpperCase()}
      </h3>
      <Link
        to={href}
        className="text-teal hover:text-teal-dark font-medium text-xs md:text-sm transition-colors"
      >
        Shop Now
      </Link>
    </div>
  );
};

export default CategoryCardSimple;
