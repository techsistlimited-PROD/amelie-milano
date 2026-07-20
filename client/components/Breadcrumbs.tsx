import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem { label: string; href?: string; }

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-stone-500"><Link to="/" className="hover:text-teal transition-colors">Home</Link>{items.map((item, index) => <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5"><ChevronRight size={12} className="text-stone-300" />{item.href ? <Link to={item.href} className="hover:text-teal transition-colors">{item.label}</Link> : <span className="text-teal">{item.label}</span>}</span>)}</nav>;

export default Breadcrumbs;
