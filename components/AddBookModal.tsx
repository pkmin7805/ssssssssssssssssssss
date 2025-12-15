import React, { useState } from 'react';
import { X, Sparkles, Loader2, Plus, Upload, Link as LinkIcon, FileText, Globe } from 'lucide-react';
import { Book } from '../types';
import { CATEGORIES, SUB_CATEGORIES } from '../constants';
import { generateBookDescription } from '../services/geminiService';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: Book) => void;
}

type UploadType = 'file' | 'link';

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadType, setUploadType] = useState<UploadType>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: CATEGORIES[1], 
    subcategory: SUB_CATEGORIES[0],
    description: '',
    externalUrl: ''
  });

  if (!isOpen) return null;

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.author) {
      alert("AI 설명을 생성하려면 제목과 저자를 먼저 입력해주세요.");
      return;
    }

    setIsGenerating(true);
    try {
      const description = await generateBookDescription(
        formData.title, 
        formData.author, 
        formData.category,
        formData.subcategory
      );
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      alert("설명 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title) {
        alert("제목을 입력해주세요.");
        return;
    }
    
    if (uploadType === 'file' && !selectedFile) {
        alert("파일을 업로드해주세요.");
        return;
    }

    if (uploadType === 'link' && !formData.externalUrl) {
        alert("링크 주소를 입력해주세요.");
        return;
    }

    let fileUrl: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    
    if (uploadType === 'file' && selectedFile) {
        // Create a fake URL for the uploaded file to simulate hosting
        fileUrl = URL.createObjectURL(selectedFile);
        fileName = selectedFile.name;
    }

    const newBook: Book = {
      id: Date.now(),
      title: formData.title,
      author: formData.author,
      category: formData.category,
      subcategory: formData.subcategory,
      rating: 0,
      description: formData.description,
      fileUrl: fileUrl,
      fileName: fileName,
      externalUrl: uploadType === 'link' ? formData.externalUrl : undefined,
      isNew: true
    };

    onAdd(newBook);
    
    // Reset form
    setFormData({
        title: '',
        author: '',
        category: CATEGORIES[1],
        subcategory: SUB_CATEGORIES[0],
        description: '',
        externalUrl: ''
    });
    setSelectedFile(null);
    setUploadType('file');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus className="w-6 h-6" />
            새로운 자료 등록
          </h2>
          <button onClick={onClose} className="hover:bg-indigo-500 p-1 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input 
              required
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="자료 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">등록자</label>
            <input 
              required
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
              placeholder="이름/부서"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.filter(c => c !== "전체").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">세부 카테고리</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.subcategory}
                onChange={e => setFormData({...formData, subcategory: e.target.value})}
              >
                {SUB_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload Type Switcher */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">등록 방식</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                        uploadType === 'file' 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    파일 직접 업로드
                </button>
                <button
                    type="button"
                    onClick={() => setUploadType('link')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                        uploadType === 'link' 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <LinkIcon className="w-4 h-4" />
                    외부 링크 연결
                </button>
            </div>
          </div>

          {/* File Upload Section */}
          {uploadType === 'file' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                    <input 
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                        <Upload className="w-8 h-8 text-indigo-400" />
                        {selectedFile ? (
                            <span className="text-sm font-semibold text-indigo-600">{selectedFile.name}</span>
                        ) : (
                            <span className="text-sm">클릭하여 파일 업로드 (PDF, HWP, XLS 등)</span>
                        )}
                    </div>
                </div>
              </div>
          )}

          {/* External Link Section */}
          {uploadType === 'link' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input 
                        type="url"
                        value={formData.externalUrl}
                        onChange={e => setFormData({...formData, externalUrl: e.target.value})}
                        placeholder="https://example.com/file..."
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 pl-1">구글 드라이브, 관공서, 회사 홈페이지 등 외부 링크를 입력하세요.</p>
              </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">자료 설명</label>
              <button 
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI로 설명 자동 생성
              </button>
            </div>
            <textarea 
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="자료에 대한 설명을 입력하거나 AI 기능을 사용해보세요."
            />
          </div>

          <button 
            type="submit" 
            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-200"
          >
            자료 등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;