'use client';

import { useState } from 'react';

import SearchPanel from '../components/SearchPanel';
import KnowledgePanel from '../components/KnowledgePanel';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Wikipedia Knowledge Panel
        </h1>
        
        <SearchPanel onSearch={setSearchTerm} />
        
        {searchTerm && <KnowledgePanel name={searchTerm} />}
        
      </main>

      <footer className="mt-8 py-4 border-t border-gray-200 text-center text-gray-500">
        <p>Powered by Wikimedia Enterprise API</p>
      </footer>
    </div>
  );
}
