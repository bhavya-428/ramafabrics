import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const StaticPage = ({ pageKey }) => {
  const { pages } = useContext(ShopContext);
  const page = pages[pageKey];

  if (!page) return <div className="text-center py-20 text-slate-500">Page not found</div>;

  return (
    <div className="bg-[#fcf8f3] min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#e8dcc4]">
        <h1 className="text-3xl md:text-4xl font-black text-[#4a2e1b] mb-8 pb-4 border-b border-[#f0e6d2] uppercase tracking-wider text-center">
          {page.title}
        </h1>
        
        {/* Simple markdown parsing simulation for basic styling */}
        <div className="prose prose-slate prose-a:text-[#8b1818] prose-headings:text-[#4a2e1b] max-w-none text-[#5c4033] leading-relaxed"
             dangerouslySetInnerHTML={{ 
               __html: page.content
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br/>')
                .replace(/^(.+)/, '<p>$1</p>')
             }} 
        />
      </div>
    </div>
  );
};
