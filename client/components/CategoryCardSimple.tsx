import { Link } from "react-router-dom";

interface CategoryCardSimpleProps {
  name: string;
  image: string;
  href: string;
}

const CategoryCardSimple = ({ name, image, href }: CategoryCardSimpleProps) => {
  return (
    <div className="text-center">
      <Link to={href} className="block mb-4 overflow-hidden rounded-lg">
        <img
          src={image}
          alt={name}
          className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <h3 className="font-serif font-semibold text-stone-900 mb-2 text-sm md:text-base">
        {name}
      </h3>
      <Link
        to={href}
        className="text-teal hover:text-teal-dark font-medium text-sm transition-colors"
      >
        Shop Now
      </Link>
    </div>
  );
};

export default CategoryCardSimple;
