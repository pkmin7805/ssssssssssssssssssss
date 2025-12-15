import React, { useState } from 'react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { getAIRecommendations } from '../services/geminiService';
import { BOOKS } from '../constants';
import { AIRecommendationResponse } from '../types';

interface AIRecommenderProps {
  onRecommend: (response: AIRecommendationResponse) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AIRecommender: React.FC<AIRecommenderProps> = ({ onRecommend, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getAIRecommendations(query, BOOKS);
      onRecommend(result);
      setQuery(''); 
      // We don't close automatically so user can see the "processing" state or results context if we wanted to expand this UI later
      // But for this UX, the results appear in the main grid, so we might want to keep this open or close it. 
      // Let's close it to show results.
      onClose();
    } catch (err) {
      setError("AI 추천을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-white mb-2">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <h2 className="text-2xl font-bold">AI 도서 큐레이터</h2>
            </div>
            <p className="text-indigo-100 text-sm">
              당신의 기분, 상황, 읽고 싶은 스타일을 말해주세요. <br/>
              Gemini가 최고의 책을 찾아드립니다.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-indigo-200 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="ai-query" className="block text-sm font-medium text-gray-700 mb-1">
                어떤 책을 찾으세요?
              </label>
              <textarea
                id="ai-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="예: 주말에 읽기 좋은 힐링되는 소설 추천해줘. 혹은 우울할 때 위로가 되는 에세이가 필요해."
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-32 text-gray-900 placeholder:text-gray-400"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>추천 받기</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">추천 검색어</h4>
            <div className="flex flex-wrap gap-2">
              {["가볍게 읽기 좋은 추리 소설", "직장인 자기계발서", "잠들기 전 힐링 에세이", "미래 기술 트렌드"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommender;