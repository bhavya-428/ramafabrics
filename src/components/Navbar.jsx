import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Menu, X, Search, Heart, ShoppingBag, User } from 'lucide-react';

export const Navbar = ({ currentPath, setRoute }) => {
  const { cart, currentUser, searchQuery, setSearchQuery } = useContext(ShopContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setRoute('shop');
      setIsMobileMenuOpen(false);
    }
  };

  const handleNav = (route, e) => {
    e.preventDefault();
    setRoute(route);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '' },
    { name: 'Our Fabrics', path: 'shop' },
    { name: 'New Arrivals', path: 'new-arrivals' },
    { name: 'Best Sellers', path: 'best-sellers' },
    { name: 'Offers', path: 'offers' },
    { name: 'About Us', path: 'about' },
    { name: 'Contact Us', path: 'contact' },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-[100] w-full font-sans">
      {/* Main Header (Logo, Search, Icons) */}
      <div className="border-b border-slate-50">
        <div className="container mx-auto px-4 h-[70px] md:h-[90px] flex items-center justify-between gap-4 md:gap-10">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <a href="#home" onClick={(e) => handleNav('', e)} className="flex items-center gap-2 md:gap-3 no-underline">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#C5A059] flex items-center justify-center text-[#6C1425] text-xl md:text-3xl font-serif font-bold bg-white">R</div>
            <div className="flex flex-col leading-none">
              <span className="text-[#6C1425] text-lg md:text-2xl font-extrabold font-serif tracking-widest">RAMA</span>
              <span className="text-[#6C1425] text-xs md:text-base font-semibold font-serif tracking-[0.15em] md:tracking-[0.2em]">FABRICS</span>
              <span className="text-[#C5A059] text-[9px] md:text-[11px] font-semibold mt-[2px] hidden sm:block">Your Style. Our Fabrics.</span>
            </div>
          </a>

          {/* Desktop Search Bar */}
          <form className="hidden md:flex flex-grow max-w-[600px] relative" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search by fabric name, material, color, category..." 
              className="w-full py-3 pl-5 pr-14 rounded-lg border border-slate-200 text-sm text-slate-800 bg-slate-50 outline-none focus:border-[#C5A059] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 h-full w-14 bg-[#6C1425] hover:bg-[#8A1A30] text-white border-none rounded-r-lg cursor-pointer flex items-center justify-center transition-colors">
              <Search size={18} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex gap-4 md:gap-8">
            {/* Wishlist */}
            <a href="#wishlist" onClick={(e) => handleNav('wishlist', e)} className="hidden sm:flex flex-col items-center gap-1 text-slate-600 hover:text-[#6C1425] cursor-pointer no-underline transition-colors">
              <Heart size={22} strokeWidth={1.5} />
              <span className="text-[11px] font-medium hidden md:block">Wishlist</span>
            </a>

            {/* Cart */}
            <a href="#cart" onClick={(e) => handleNav('cart', e)} className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#6C1425] cursor-pointer relative no-underline transition-colors">
              <div className="relative">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cartCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#C5A059] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
              </div>
              <span className="text-[11px] font-medium hidden md:block">Cart</span>
            </a>

            {/* Profile */}
            <a href="#profile" onClick={(e) => currentUser ? handleNav('profile', e) : handleNav('login', e)} className="hidden sm:flex flex-col items-center gap-1 text-slate-600 hover:text-[#6C1425] cursor-pointer no-underline transition-colors">
              <User size={22} strokeWidth={1.5} />
              <span className="text-[11px] font-medium hidden md:block">Profile</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Visible only on mobile when menu is not open) */}
      {!isMobileMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-white border-b border-slate-100">
           <form className="flex w-full relative" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search fabrics..." 
              className="w-full py-2.5 pl-4 pr-12 rounded-lg border border-slate-200 text-sm text-slate-800 bg-slate-50 outline-none focus:border-[#C5A059]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 h-full w-12 bg-[#6C1425] text-white border-none rounded-r-lg cursor-pointer flex items-center justify-center">
              <Search size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Desktop Secondary Navigation */}
      <div className="hidden md:block bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 flex gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.path}
              href={`#${link.path || 'home'}`} 
              onClick={(e) => handleNav(link.path, e)} 
              className={`text-sm py-4 cursor-pointer no-underline flex items-center gap-1 border-b-2 transition-colors ${
                (currentPath === link.path || (currentPath === 'home' && link.path === '')) 
                  ? 'text-[#6C1425] font-semibold border-[#6C1425]' 
                  : 'text-slate-700 font-medium border-transparent hover:text-[#6C1425]'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[70px] bg-white z-[90] overflow-y-auto">
          <div className="flex flex-col p-4 border-b border-slate-100">
            {navLinks.map((link) => (
              <a 
                key={link.path}
                href={`#${link.path || 'home'}`} 
                onClick={(e) => handleNav(link.path, e)} 
                className={`py-4 text-base font-medium border-b border-slate-100 ${
                  (currentPath === link.path || (currentPath === 'home' && link.path === '')) 
                    ? 'text-[#6C1425]' 
                    : 'text-slate-700'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="p-4 flex flex-col gap-4">
            <a href="#profile" onClick={(e) => currentUser ? handleNav('profile', e) : handleNav('login', e)} className="flex items-center gap-3 py-3 text-slate-700 font-medium">
              <User size={20} />
              {currentUser ? 'My Profile' : 'Login / Register'}
            </a>
            <a href="#wishlist" onClick={(e) => handleNav('wishlist', e)} className="flex items-center gap-3 py-3 text-slate-700 font-medium">
              <Heart size={20} />
              My Wishlist
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
