import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    basePrice: number;
    image: string;
    category: string;
    isNew?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      className="group relative h-full flex flex-col"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/producto/${product.id}`} className="flex flex-col h-full bg-transparent rounded-[20px] md:rounded-[2rem] border border-transparent overflow-hidden hover:border-brand-dark/10 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-brand-cream/50 rounded-[20px] md:rounded-[2rem]">
          {product.isNew && (
            <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-brand-hotpink text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full">
              Nuevo
            </div>
          )}
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col items-center text-center px-1 py-2 md:p-5 flex-grow justify-between">
          <div className="w-full text-left">
            <span className="text-[7px] md:text-[10px] uppercase tracking-[0.2em] text-brand-hotpink font-bold block mb-0.5 lg:mb-2 truncate">
              {product.category}
            </span>
            <h3 className="font-display font-black text-[15px] leading-[1.1] lg:text-2xl text-brand-dark uppercase line-clamp-2 group-hover:text-brand-hotpink transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="w-full text-left mt-1 lg:mt-3">
             <p className="font-sans font-black text-sm lg:text-xl text-brand-dark">
               ${product.basePrice.toFixed(2)}
             </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
