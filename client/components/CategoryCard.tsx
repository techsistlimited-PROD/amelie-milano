import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
  isWide?: boolean;
}

const CategoryCard = ({ name, image, href, isWide }: CategoryCardProps) => {
  return (
    <Link to={href}>
      <div
        className={`group relative overflow-hidden rounded-lg bg-stone-100 ${
          isWide ? "md:col-span-2" : ""
        }`}
      >
        <img
          src={image}
          alt={name}
          className="w-full aspect-square md:aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-colors duration-300 flex items-center justify-center">
          <div className="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
              {name}
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              Explore <ArrowRight size={16} />
            </div>
          </div>
        </div>

        {/* Title - visible on non-hover */}
        <div className="absolute inset-0 flex items-end p-4 md:p-6 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-white">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
