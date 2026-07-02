import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const FAQ = () => {
  const { faqs } = useContext(ShopContext);
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-[#fcf8f3] min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#4a2e1b] uppercase tracking-wider mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#8b1818] font-medium tracking-wide">Find answers to common questions about our products and services.</p>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#e8dcc4] text-slate-500">
            No FAQs have been added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map(faq => (
              <div 
                key={faq.id} 
                className={`bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden cursor-pointer
                  ${openId === faq.id ? 'border-[#8b1818] shadow-md' : 'border-[#e8dcc4] hover:border-[#d4c1a5]'}`}
                onClick={() => toggle(faq.id)}
              >
                <div className="p-6 flex justify-between items-center bg-white">
                  <h3 className="font-bold text-lg text-[#4a2e1b] pr-8">{faq.question}</h3>
                  <div className={`transform transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-[#8b1818]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out text-[#5c4033] leading-relaxed
                    ${openId === faq.id ? 'pb-6 opacity-100 max-h-96' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <p className="pt-4 border-t border-[#f0e6d2]">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
