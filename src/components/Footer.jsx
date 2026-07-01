import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export const Footer = ({ setRoute }) => {
  const { settings } = useContext(ShopContext);

  const handleNav = (route, e) => {
    e.preventDefault();
    setRoute(route);
  };

  return (
    <footer className="bg-[#6C1425] text-[#FDF2E9] pt-16 border-t-[3px] border-[#C5A059] mt-16 font-sans">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#FDF2E9] text-[#6C1425] font-serif font-bold text-base w-8 h-8 rounded flex items-center justify-center border border-[#C5A059]">RF</span>
            <span className="font-serif font-bold text-lg tracking-wide text-[#C5A059]">RAMA FABRICS</span>
          </div>
          <p className="text-sm text-[#faf8f5]/70 leading-relaxed">
            Established in 2022, Rama Fabrics is Vijayawada's premier destination for exquisite clothing and fabrics. We source the finest handloom, silk, and contemporary textiles for you.
          </p>
        </div>

        {/* Links column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#EAD5AB] border-b border-[#C5A059]/20 pb-2">Quick Links</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            <li><a href="#home" onClick={(e) => handleNav('', e)} className="text-sm text-[#faf8f5]/70 hover:text-[#C5A059] hover:pl-1 transition-all no-underline inline-block">Home</a></li>
            <li><a href="#shop" onClick={(e) => handleNav('shop', e)} className="text-sm text-[#faf8f5]/70 hover:text-[#C5A059] hover:pl-1 transition-all no-underline inline-block">Shop Fabrics</a></li>
            <li><a href="#offers" onClick={(e) => handleNav('offers', e)} className="text-sm text-[#faf8f5]/70 hover:text-[#C5A059] hover:pl-1 transition-all no-underline inline-block">Discounts & Offers</a></li>
            <li><a href="#contact" onClick={(e) => handleNav('contact', e)} className="text-sm text-[#faf8f5]/70 hover:text-[#C5A059] hover:pl-1 transition-all no-underline inline-block">Contact Us</a></li>
          </ul>
        </div>

        {/* Customer area column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#EAD5AB] border-b border-[#C5A059]/20 pb-2">Customer Portal</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            <li><a href="#orders" onClick={(e) => handleNav('orders', e)} className="text-sm text-[#faf8f5]/70 hover:text-[#C5A059] hover:pl-1 transition-all no-underline inline-block">Track Orders</a></li>
            <li><a href="#cart" onClick={(e) => handleNav('cart', e)} className="text-sm text-[#faf8f5]/70 hover:text-[#C5A059] hover:pl-1 transition-all no-underline inline-block">Shopping Cart</a></li>
            <li><a href="#login" onClick={(e) => handleNav('login', e)} className="text-sm text-[#faf8f5]/70 hover:text-[#C5A059] hover:pl-1 transition-all no-underline inline-block">Sign In / Sign Up</a></li>
          </ul>
        </div>

        {/* Contact info column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#EAD5AB] border-b border-[#C5A059]/20 pb-2">Store Information</h4>
          <p className="text-sm text-[#faf8f5]/70 leading-relaxed m-0">
            <strong className="text-white/90">Address:</strong><br />
            {settings.storeAddress}
          </p>
          <p className="text-sm text-[#faf8f5]/70 leading-relaxed m-0">
            <strong className="text-white/90">Phone:</strong> {settings.phone}<br />
            <strong className="text-white/90">Hours:</strong> {settings.hours}
          </p>
          <div className="flex gap-2.5 mt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 text-[#EAD5AB] hover:bg-[#C5A059] hover:text-white flex items-center justify-center transition-colors cursor-pointer no-underline text-xs font-bold">
              FB
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 text-[#EAD5AB] hover:bg-[#C5A059] hover:text-white flex items-center justify-center transition-colors cursor-pointer no-underline text-xs font-bold">
              IG
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 text-[#EAD5AB] hover:bg-[#C5A059] hover:text-white flex items-center justify-center transition-colors cursor-pointer no-underline text-xs font-bold">
              WA
            </a>
          </div>
        </div>
      </div>

      <div className="bg-black/15 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs text-[#faf8f5]/50 m-0">
            © {new Date().getFullYear()} Rama Fabrics. All rights reserved.
          </p>
          <p className="text-xs text-[#b89552] italic font-serif m-0">
            Designed with Premium Indian Handlooms
          </p>
        </div>
      </div>
    </footer>
  );
};
