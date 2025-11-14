import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  isLoading: boolean;
  isTextArea?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmit, placeholder, isLoading, isTextArea = false }) => {
  const InputComponent = isTextArea ? 'textarea' : 'input';

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <InputComponent
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isLoading}
        className={`w-full p-4 pr-32 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm disabled:bg-gray-100 ${isTextArea ? 'h-32 resize-none' : ''}`}
        rows={isTextArea ? 4 : undefined}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-orange-500 text-white font-bold py-2 px-6 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 disabled:bg-orange-300 flex items-center justify-center space-x-2"
      >
        {isLoading ? <LoadingSpinner /> : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span>Buscar</span>
          </>
        )}
      </button>
    </form>
  );
};