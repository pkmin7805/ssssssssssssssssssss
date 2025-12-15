import React from 'react';
import { Book } from '../types';
import { Star, Download, ExternalLink } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click (modal open)
    
    if (book.fileUrl) {
      const a = document.createElement('a');
      a.href = book.fileUrl;
      a.download = book.fileName || book.title;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Delay removal to ensure download starts
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
    } else if (book.externalUrl) {
      window.open(book.externalUrl, '_blank');
    } else {
      // If no file/link, open modal to see details (or fallback)
      onClick();
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full cursor-pointer hover:-translate-y-1"
    >
      {/* Badge Overlay */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {book.isBestSeller && (
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            인기자료
          </span>
        )}
        {book.isNew && (
          <span className="bg-emerald-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            최신
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
        <img
          src={`https://picsum.photos/seed/${book.id}/300/400`} 
          alt={book.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide flex items-center gap-1">
          <span>{book.category}</span>
          <span className="text-gray-300">•</span>
          <span>{book.subcategory}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{book.author}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700">{book.rating || "New"}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            무료
          </span>
          <button 
            onClick={handleDownload}
            className="p-2 rounded-full bg-gray-50 hover:bg-indigo-600 hover:text-white text-gray-600 transition-colors" 
            aria-label={book.externalUrl ? "Link" : "Download"}
          >
            {book.externalUrl ? <ExternalLink className="w-5 h-5" /> : <Download className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;