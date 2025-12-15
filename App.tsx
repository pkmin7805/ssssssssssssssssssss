import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Menu, BookOpen, PlusCircle, Briefcase, ShieldCheck, ClipboardCheck, Bot, FileText, ChevronRight, Home, ArrowLeft, LayoutGrid } from 'lucide-react';
import { BOOKS, CATEGORIES, SUB_CATEGORIES } from './constants';
import { Book } from './types';
import BookCard from './components/BookCard';
import AddBookModal from './components/AddBookModal';
import BookDetailModal from './components/BookDetailModal';

// Helper for Category Icons
const getCategoryIcon = (category: string) => {
  switch (category) {
    case '건설공무': return <Briefcase className="w-8 h-8 md:w-12 md:h-12 text-indigo-500" />;
    case '건설안전': return <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 text-emerald-500" />;
    case '건설품질': return <ClipboardCheck className="w-8 h-8 md:w-12 md:h-12 text-blue-500" />;
    case 'AI 자동화': return <Bot className="w-8 h-8 md:w-12 md:h-12 text-purple-500" />;
    default: return <LayoutGrid className="w-8 h-8 md:w-12 md:h-12 text-gray-500" />;
  }
};

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Navigation State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  // Modal states
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Determine current view
  const currentView = useMemo(() => {
    if (searchQuery) return 'search';
    if (selectedCategory && selectedSubcategory) return 'list';
    if (selectedCategory) return 'subcategory';
    return 'category';
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  // Filter books logic
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // If searching, ignore category hierarchy and search everything
      if (searchQuery) {
        return book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               book.author.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      // Strict filtering based on navigation
      const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
      const matchesSubcategory = selectedSubcategory ? book.subcategory === selectedSubcategory : true;
      
      return matchesCategory && matchesSubcategory;
    });
  }, [books, searchQuery, selectedCategory, selectedSubcategory]);

  // Most recent books first for display
  const displayBooks = [...filteredBooks].reverse();

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [...prev, newBook]);
  };

  const resetNavigation = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery("");
  };

  const handleBack = () => {
    if (currentView === 'list') {
      setSelectedSubcategory(null);
    } else if (currentView === 'subcategory') {
      setSelectedCategory(null);
    } else if (currentView === 'search') {
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-slate-50">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetNavigation}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-indigo-900">건설<span className="text-indigo-600">자료실</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <button onClick={resetNavigation} className="hover:text-indigo-600 transition-colors">홈</button>
            <button className="hover:text-indigo-600 transition-colors">인기 자료</button>
            <button className="hover:text-indigo-600 transition-colors">공지사항</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="자료명, 작성자 검색" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 transition-all focus:w-64"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            
            <button 
              onClick={() => setIsAddBookModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-colors shadow-md shadow-indigo-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>자료 등록</span>
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Reduced size when navigating */}
      <header className={`relative bg-gradient-to-r from-slate-900 to-indigo-900 text-white overflow-hidden transition-all duration-500 ${currentView === 'category' ? 'py-16 md:py-20' : 'py-8 md:py-10'}`}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            {currentView === 'category' && (
              <div className="inline-block px-3 py-1 bg-emerald-500/30 border border-emerald-400/30 rounded-full text-emerald-200 text-xs font-semibold mb-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                건설인을 위한 지식 공유 플랫폼
              </div>
            )}
            <h1 className={`${currentView === 'category' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'} font-black mb-2 leading-tight`}>
              {currentView === 'category' ? (
                <>현장 노하우와 자료 공유</>
              ) : (
                 selectedCategory || "자료 검색"
              )}
            </h1>
            {currentView === 'category' && (
              <p className="text-base md:text-lg text-indigo-100 mb-6 leading-relaxed">
                필요한 업무 카테고리를 선택하여 자료를 찾아보세요.
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow" id="main-content">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={resetNavigation} className="hover:text-indigo-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>홈</span>
            </button>
            {selectedCategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <button 
                  onClick={() => setSelectedSubcategory(null)} 
                  className={`hover:text-indigo-600 ${!selectedSubcategory ? 'font-bold text-indigo-900' : ''}`}
                >
                  {selectedCategory}
                </button>
              </>
            )}
            {selectedSubcategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="font-bold text-indigo-900">{selectedSubcategory}</span>
              </>
            )}
            {searchQuery && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="font-bold text-indigo-900">"{searchQuery}" 검색 결과</span>
              </>
            )}
          </div>

          {(currentView !== 'category' && !searchQuery) && (
            <button 
              onClick={handleBack}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              이전으로
            </button>
          )}
        </div>

        {/* VIEW 1: CATEGORY SELECTION */}
        {currentView === 'category' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-indigo-600" />
              분야를 선택하세요
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.filter(c => c !== "전체").map((category) => (
                <div 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center gap-4"
                >
                  <div className="p-4 bg-gray-50 rounded-full group-hover:bg-indigo-50 transition-colors duration-300">
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{category}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {category} 관련 표준 서식 및 메뉴얼
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Access / Recommendations Section could go here */}
            <div className="mt-16">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                추천 인기 자료
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {books.filter(b => b.isBestSeller).slice(0, 4).map(book => (
                   <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SUBCATEGORY SELECTION */}
        {currentView === 'subcategory' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="text-center mb-10">
               <span className="inline-block p-4 bg-indigo-50 rounded-full mb-4">
                 {getCategoryIcon(selectedCategory!)}
               </span>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedCategory}</h2>
               <p className="text-gray-500">원하시는 자료 유형을 선택해주세요.</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
               {SUB_CATEGORIES.map((sub) => (
                 <div
                   key={sub}
                   onClick={() => setSelectedSubcategory(sub)}
                   className="group bg-white hover:bg-indigo-600 p-8 rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 cursor-pointer transition-all duration-300 flex items-center justify-between"
                 >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-white/20 transition-colors">
                        {sub === '메뉴얼' ? <BookOpen className="w-6 h-6 text-indigo-600 group-hover:text-white" /> : <FileText className="w-6 h-6 text-indigo-600 group-hover:text-white" />}
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors">{sub}</h3>
                        <p className="text-sm text-gray-500 group-hover:text-indigo-100 transition-colors">
                          {selectedCategory} {sub} 모음
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* VIEW 3: BOOK LIST (SEARCH or SELECTED) */}
        {(currentView === 'list' || currentView === 'search') && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {currentView === 'search' ? (
                     <><Search className="w-5 h-5 text-indigo-600"/>검색 결과</>
                  ) : (
                     <><FileText className="w-5 h-5 text-indigo-600"/>자료 목록</>
                  )}
                  <span className="text-sm font-normal text-gray-500 ml-2">({displayBooks.length}개)</span>
                </h2>
                {currentView === 'list' && (
                  <div className="flex gap-2">
                    {SUB_CATEGORIES.map(sub => (
                      <button 
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedSubcategory === sub ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {displayBooks.length > 0 ? (
                  displayBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onClick={() => setSelectedBook(book)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-xl font-medium mb-2">등록된 자료가 없습니다.</p>
                    <p className="text-gray-400 mb-6">
                      {currentView === 'search' ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : "이 카테고리에 첫 번째 자료를 등록해보세요!"}
                    </p>
                    <button 
                      onClick={() => setIsAddBookModalOpen(true)}
                      className="px-6 py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-2"
                    >
                      <PlusCircle className="w-5 h-5" />
                      자료 등록하기
                    </button>
                  </div>
                )}
              </div>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              <BookOpen className="w-6 h-6" />
              <span className="text-2xl font-bold tracking-tight">건설자료실</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              건설 현장에 필요한 모든 서식과 메뉴얼. <br/>
              지식 공유를 통해 더 안전하고 효율적인 현장을 만들어갑니다.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={resetNavigation} className="hover:text-white">홈으로</button></li>
              <li><a href="#" className="hover:text-white">자료 등록</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">고객센터</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">공지사항</a></li>
              <li><a href="#" className="hover:text-white">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-white">이용약관</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; 2024 Construction Archive. All rights reserved. Powered by Google Gemini.
        </div>
      </footer>

      {/* Modals */}
      <AddBookModal 
        isOpen={isAddBookModalOpen} 
        onClose={() => setIsAddBookModalOpen(false)}
        onAdd={handleAddBook}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />

    </div>
  );
};

export default App;