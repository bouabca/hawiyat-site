'use client';
import Link from "next/link";
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingCart, Plus, Minus, User, Settings, CreditCard, BarChart3, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import PayPalPayButton from "@/components/PayPalButton";

interface NavBarProps {
  session: Session | null;
}

function CartSidebar() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()

  const formatBillingCycle = (cycle: string) => {
    switch (cycle) {
      case 'MONTHLY':
        return 'Monthly'
      case 'SEMI_ANNUAL':
        return '6 Months'
      case 'ANNUAL':
        return 'Annual'
      default:
        return cycle
    }
  }

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-96 bg-[#111] border-l border-[#333] transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="p-6 border-b border-[#333] flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:bg-[#1a1a1a]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`cart-item-${item.id}`} className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm">{item.offer.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {formatBillingCycle(item.selectedTier.billingCycle)}
                        </span>
                        {item.selectedTier.discountPercent && (
                          <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full">
                            -{item.selectedTier.discountPercent.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-6 w-6 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-cyan-300 font-semibold mb-3">{item.selectedTier.displayPrice}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-6 w-6 border-[#333] bg-transparent hover:bg-[#1a1a1a] text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                        className="h-6 w-6 border-[#333] bg-transparent hover:bg-[#1a1a1a] text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-400">
                      Subtotal: {(item.selectedTier.price * item.quantity).toLocaleString()} {item.selectedTier.currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="border-t border-[#333] p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold text-white">
              <span>Total:</span>
              <span className="text-cyan-300">{totalPrice.toLocaleString()} DZD</span>
            </div>
            <div className="space-y-2">
              {/* <Button
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={() => {
                  alert('Proceeding to checkout...')
                }}
              >
                Proceed to Checkout
              </Button> */}
              <PayPalPayButton
                cart={cartItems}
                total={totalPrice.toFixed(2).toString()}
              />
              <Button
                variant="outline"
                className="w-full border-[#333] bg-transparent hover:bg-[#1a1a1a] text-white"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function CartButton() {
  const { totalItems, isCartOpen, setIsCartOpen, totalPrice, cartItems } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(!isCartOpen)}
      className="relative group hidden lg:flex items-center gap-2 px-4 py-2 
                 bg-gradient-to-r from-[#2BFFFF]/10 to-[#2BFFFF]/5 
                 hover:from-[#2BFFFF]/20 hover:to-[#2BFFFF]/10
                 border border-[#2BFFFF]/30 hover:border-[#2BFFFF]/50
                 rounded-xl transition-all duration-300 ease-out
                 hover:shadow-lg hover:shadow-[#2BFFFF]/25
                 active:scale-95 backdrop-blur-sm"
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5 text-[#2BFFFF] group-hover:scale-110 transition-transform duration-200" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 
                           text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] 
                           flex items-center justify-center border-2 border-black/20
                           animate-pulse font-semibold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
      <span className="text-white font-medium text-sm group-hover:text-[#2BFFFF] transition-colors duration-200">
        Cart
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-[#2BFFFF]/0 via-[#2BFFFF]/5 to-[#2BFFFF]/0 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </button>
  );
}

function UserDropdown({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ redirect: false });
    router.refresh();
  };

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: CreditCard, label: 'Billing', href: '/billing' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group hidden lg:flex items-center gap-2 px-4 py-2 
                   bg-gradient-to-r from-white/10 to-white/5 
                   hover:from-white/20 hover:to-white/10
                   border border-white/20 hover:border-white/30
                   rounded-xl transition-all duration-300 ease-out
                   hover:shadow-lg hover:shadow-white/10
                   active:scale-95 backdrop-blur-sm"
        aria-label="User menu"
      >
        <div className="flex items-center gap-2">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full border-2 border-white/20"
            />
          ) : (
            <div className="w-6 h-6 bg-gradient-to-r from-[#2BFFFF] to-[#1CDDDD] rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-black" />
            </div>
          )}
          <span className="text-white font-medium text-sm max-w-24 truncate">
            {session.user?.name || session.user?.email}
          </span>
          <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a]/95 backdrop-blur-xl 
                        border border-white/20 rounded-xl shadow-2xl shadow-black/50 z-50
                        animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-white/20"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-[#2BFFFF] to-[#1CDDDD] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-white hover:text-[#2BFFFF] 
                           hover:bg-white/5 transition-all duration-200 group"
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-white/10 py-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 
                         hover:bg-red-500/10 transition-all duration-200 group w-full"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileUserMenu({ session }: { session: Session }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: CreditCard, label: 'Billing', href: '/billing' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-white hover:text-[#2BFFFF] 
                   transition-colors duration-200 font-medium text-base py-3 group"
      >
        <div className="flex items-center gap-3">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border-2 border-white/20"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-[#2BFFFF] to-[#1CDDDD] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
          )}
          <div className="text-left">
            <div className="font-medium text-sm truncate max-w-32">
              {session.user?.name || 'User'}
            </div>
            <div className="text-xs text-gray-400 truncate max-w-32">
              {session.user?.email}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
          }`} />
      </button>

      {isExpanded && (
        <div className="pl-8 pb-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 py-2 text-white/80 hover:text-[#2BFFFF] 
                         transition-colors duration-200 text-sm group"
            >
              <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 py-2 text-red-400 hover:text-red-300 
                       transition-colors duration-200 text-sm group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

function MobileCartButton() {
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(!isCartOpen)}
      className="flex items-center justify-between w-full text-white hover:text-[#2BFFFF] 
                 transition-colors duration-200 font-medium text-base py-2 
                 border-b border-white/10 group"
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 
                             text-white text-xs px-1 py-0.5 rounded-full min-w-[16px] h-[16px] 
                             flex items-center justify-center text-[10px] font-semibold">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </div>
        <span>Cart</span>
      </div>
      {totalItems > 0 && (
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
          <span className="text-xs text-gray-400">
            {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>
      )}
    </button>
  );
}

export default function NavBar({ session }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCartOpen = () => {
    closeMenu();
  };

  const handleAuthAction = async () => {
    if (session) {
      await signOut({ redirect: false });
    } else {
      router.push('/auth');
    }
    router.refresh();
    closeMenu();
  };

  return (
    <>
      <CartSidebar />

      <nav className="absolute top-0 left-0 w-full z-30">
        <div className="flex justify-between lg:justify-around items-center h-14 lg:h-16
             bg-white/5 backdrop-blur-lg border-b border-white/10
            px-4 sm:px-6 lg:px-8">
          {/* Logo block - Responsive */}
          <Link
            href="/"
            className="font-bold text-lg lg:text-xl flex items-center gap-2 font-poppins z-30 relative
                       hover:scale-105 transition-transform duration-200"
            onClick={closeMenu}
          >
            <Image
              src="/logo.svg"
              width={32}
              height={32}
              alt="Hawiyat Logo"
              className="w-7 h-7 lg:w-8 lg:h-8"
            />
            <span className="text-white">Hawiyat</span>
          </Link>

          {/* Desktop menu - Hidden on mobile */}
          <div className="hidden lg:flex justify-around items-center gap-x-6 xl:gap-x-8 text-white">
            <Link
              href="/Products"
              className="hover:text-[#2BFFFF] transition-colors duration-200 font-medium text-sm
                         relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 
                         after:bg-[#2BFFFF] after:transition-all after:duration-300 
                         hover:after:w-full"
            >
              Products
            </Link>
            <Link
              href="/templates"
              className="hover:text-[#2BFFFF] transition-colors duration-200 font-medium text-sm
                         relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 
                         after:bg-[#2BFFFF] after:transition-all after:duration-300 
                         hover:after:w-full"
            >
              Templates
            </Link>
            <Link
              href="/#Features"
              className="hover:text-[#2BFFFF] transition-colors duration-200 font-medium text-sm
                         relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 
                         after:bg-[#2BFFFF] after:transition-all after:duration-300 
                         hover:after:w-full"
            >
              Features
            </Link>
            <Link
              href="/#feedback"
              className="hover:text-[#2BFFFF] transition-colors duration-200 font-medium text-sm
                         relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 
                         after:bg-[#2BFFFF] after:transition-all after:duration-300 
                         hover:after:w-full"
            >
              Feedback
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <CartButton />

            {session ? (
              <UserDropdown session={session} />
            ) : (
              <Link
                href="/auth"
                className="bg-gradient-to-r from-[#2BFFFF] to-[#1CDDDD] hover:from-[#1CDDDD] hover:to-[#0ABBBB]
                    py-2 px-4 rounded-2xl text-black font-semibold
                    transition-all duration-200 hover:shadow-lg hover:shadow-[#2BFFFF]/25
                    active:scale-95 text-sm hover:scale-105
                    relative overflow-hidden group"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden z-50 relative p-2 text-white hover:text-[#2BFFFF] 
                       transition-colors hover:scale-110 active:scale-95"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
            onClick={closeMenu}
          />
        )}

        {/* Mobile menu */}
        <div className={`
            lg:hidden fixed top-0 right-0 h-full w-72 max-w-[80vw]
            bg-black/20 backdrop-blur-xl border-l border-white/20
            transform transition-transform duration-300 ease-in-out z-40
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col pt-20 pb-6 px-6 h-full">
            {/* User section for mobile */}
            {session && <MobileUserMenu session={session} />}

            {/* Mobile navigation links */}
            <div className="flex flex-col space-y-4 mb-6 flex-1">
              <Link
                href="/Products"
                className="text-white hover:text-[#2BFFFF] transition-colors duration-200
                    font-medium text-base py-2 border-b border-white/10
                    hover:bg-white/5 hover:px-2 hover:rounded-lg hover:border-transparent"
                onClick={closeMenu}
              >
                Products
              </Link>
              <Link
                href="/templates"
                className="text-white hover:text-[#2BFFFF] transition-colors duration-200
                    font-medium text-base py-2 border-b border-white/10
                    hover:bg-white/5 hover:px-2 hover:rounded-lg hover:border-transparent"
                onClick={closeMenu}
              >
                Templates
              </Link>
              <Link
                href="/#Features"
                className="text-white hover:text-[#2BFFFF] transition-colors duration-200
                    font-medium text-base py-2 border-b border-white/10
                    hover:bg-white/5 hover:px-2 hover:rounded-lg hover:border-transparent"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link
                href="/#feedback"
                className="text-white hover:text-[#2BFFFF] transition-colors duration-200
                    font-medium text-base py-2 border-b border-white/10
                    hover:bg-white/5 hover:px-2 hover:rounded-lg hover:border-transparent"
                onClick={closeMenu}
              >
                Feedback
              </Link>
              <div onClick={handleCartOpen}>
                <MobileCartButton />
              </div>
            </div>

            {/* Mobile CTA button */}
            <div className="mt-auto">
              <button
                onClick={handleAuthAction}
                className="bg-gradient-to-r from-[#2BFFFF] to-[#1CDDDD] hover:from-[#1CDDDD] hover:to-[#0ABBBB]
                    py-3 px-6 rounded-[50px] text-black font-semibold
                    text-center transition-all duration-200
                    hover:shadow-lg hover:shadow-[#2BFFFF]/25
                    active:scale-95 block w-full
                    relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {session ? 'Sign Out' : 'Sign In'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Mobile menu footer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-gray-400 text-xs text-center">
                  © 2025 Hawiyat. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}