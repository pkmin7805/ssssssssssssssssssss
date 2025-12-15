import React, { useState } from 'react';
import { X, Star, BookOpen, User as UserIcon, Download, Coffee, FileText, ExternalLink, Heart } from 'lucide-react';
import { Book } from '../types';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose }) => {
  const [isCoffeeSelected, setIsCoffeeSelected] = useState(false);

  if (!isOpen || !book) return null;

  const handleAction = () => {
    // Check if it's an external link or a file download
    if (book.externalUrl) {
       window.open(book.externalUrl, '_blank');
       
       if (isCoffeeSelected) {
         // Use setTimeout to not block the new tab opening
         setTimeout(() => {
            alert(`따뜻한 커피 한 잔 후원 감사합니다! ☕\n제작자에게 큰 힘이 됩니다.`);
         }, 500);
       }
    } else if (book.fileUrl) {
      // Create a temporary anchor tag to trigger the download of the actual file
      const a = document.createElement('a');
      a.href = book.fileUrl;
      // Use the stored filename which includes extension, or fallback to title
      a.download = book.fileName || book.title; 
      a.style.display = 'none'; // Ensure it's not visible
      document.body.appendChild(a);
      a.click();
      
      // Small delay before removing to ensure click registers
      setTimeout(() => {
          document.body.removeChild(a);
      }, 100);
      
      if (isCoffeeSelected) {
        setTimeout(() => {
            alert(`따뜻한 커피 한 잔 후원 감사합니다! ☕\n제작자에게 큰 힘이 됩니다.`);
        }, 500);
      }
      // No alert for free download to ensure smooth browser download experience
    } else {
        alert("이용 가능한 파일이나 링크가 없습니다.");
        return;
    }
    
    setIsCoffeeSelected(false); // Reset selection
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div className="md:w-2/5 h-64 md:h-auto bg-gray-100 relative">
           <img
            src={`https://picsum.photos/seed/${book.id}/400/600`} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
          {book.isBestSeller && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full shadow-lg">
              인기자료
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="md:w-3/5 p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {book.category}
                </span>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {book.subcategory}
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{book.title}</h2>
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <span className="flex items-center gap-1"><UserIcon className="w-4 h-4"/> {book.author}</span>
                <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star className="w-4 h-4 fill-current"/> {book.rating || "New"}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="prose prose-slate mb-8 flex-grow">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500"/>
              자료 소개
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
            {book.fileName && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-gray-400"/>
                    첨부파일: <span className="font-medium text-gray-900">{book.fileName}</span>
                </div>
            )}
             {book.externalUrl && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
                    <ExternalLink className="w-4 h-4"/>
                    외부 링크: <span className="font-medium truncate flex-1">{book.externalUrl}</span>
                </div>
            )}
          </div>
          
          <div className="mt-auto">
            {/* Donation Section */}
            <div className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-orange-800">
                  <Heart className="w-4 h-4 fill-orange-500 text-orange-500" />
                  제작자 응원하기
                </label>
                {isCoffeeSelected && <span className="text-xs text-orange-600 font-medium animate-pulse">후원이 선택되었습니다!</span>}
              </div>
              <button 
                onClick={() => setIsCoffeeSelected(!isCoffeeSelected)}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                    isCoffeeSelected 
                    ? 'bg-orange-500 text-white border-orange-600 shadow-md ring-2 ring-orange-200 scale-[1.02]' 
                    : 'bg-white text-gray-600 border-orange-200 hover:bg-orange-100 hover:text-orange-700'
                }`}
              >
                <Coffee className={`w-5 h-5 ${isCoffeeSelected ? 'animate-bounce' : ''}`} />
                {isCoffeeSelected ? '커피 한 잔을 선물합니다 (1,500원)' : '커피 한 잔 선물하기 (1,500원)'}
              </button>
              <p className="text-xs text-orange-400 text-center">
                * 따뜻한 커피 한 잔은 양질의 자료 제작에 큰 힘이 됩니다.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button 
                onClick={handleAction}
                className={`w-full px-6 py-4 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                    isCoffeeSelected 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                {book.externalUrl ? <ExternalLink className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                {isCoffeeSelected 
                    ? (book.externalUrl ? '후원하고 사이트 이동' : '후원하고 다운로드')
                    : (book.externalUrl ? '사이트 바로가기' : '무료 다운로드')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;