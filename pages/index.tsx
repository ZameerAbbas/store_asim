/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Geist, Geist_Mono } from "next/font/google";

import React, { useEffect, useState, useContext } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User, Heart, ShoppingCart, Search } from "lucide-react";

import { Createcart } from "../context/Context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function Home() {

  const [isSticky, setIsSticky] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHasScrolled(scrollTop > 10); // only for triggering animation
      setIsSticky(scrollTop > 100);   // sticky threshold
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const { records, cartItems, addToCart, removeFromCart } =
    useContext(Createcart);

  console.log("records", records)


  return (
    <div
      className={`${geistSans.className} ${geistMono.className}  `}
    >
      <header className={`w-full border-b bg-white transition-all duration-500 ease-in-out ${isSticky
        ? "fixed top-0 z-50 shadow-md translate-y-0 opacity-100"
        : hasScrolled
          ? "relative translate-y-[-10px] opacity-0"
          : "relative translate-y-0 opacity-100"
        }`}
      >
        {/* Top bar */}
        {/* <div className="bg-gray-100 text-sm py-2 px-4 flex justify-between items-center">
          <div>Welcome to our store!</div>
          <div className="flex gap-4 text-sm">
            <select className="bg-transparent border-none outline-none">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <select className="bg-transparent border-none outline-none">
              <option value="EN">EN</option>
              <option value="FR">FR</option>
            </select>
          </div>
        </div> */}
        <div className="px-6">


          {/* Main header */}
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Nav */}
            <nav className="hidden lg:flex gap-6 text-sm">
              <a href="#" className="hover:text-black">Home</a>
              <a href="#" className="hover:text-black">Shop</a>
              <a href="#" className="hover:text-black">Collections</a>
            </nav>

            {/* Logo */}
            <div className="text-2xl font-bold">Himalayan Rough Stone</div>

            {/* Icons */}
            <div className="flex items-center gap-4 text-gray-600">
              <Search className="w-5 h-5 cursor-pointer" />
              <User className="w-5 h-5 cursor-pointer" />
              <Heart className="w-5 h-5 cursor-pointer" />
              <div className="relative">
                <ShoppingCart className="w-5 h-5 cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-black text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="px-6 py-6">


        <div className="flex">
          {/* Sidebar */}
          <aside className="w-[250px] bg-red-700 text-white py-6 px-4">
            <h2 className="text-lg font-semibold mb-4 uppercase tracking-widest">
              Browse Categories
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Womes Clothing</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Men Clothing</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Watches</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Bags & Shoes</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Shoes</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Jewellery</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Accessories</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Toys, Kids & Baby</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Sports & Outdoors</span> <span>&gt;</span>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-gray-300">
                <span>Health & Beauty</span> <span>&gt;</span>
              </li>
            </ul>
          </aside>

          {/* Category cards */}
          <div className="flex flex-1 gap-8 px-4 py-6">
            {[
              {
                img: "https://new-basel2.myshopify.com/cdn/shop/products/woman-19_1_ddae4bc4-ea0f-4171-9e4f-fef91ce7908d@2x.jpg?v=1575433093",
                tag: "Gems",
                title: "NEW ARRIVALS",
                color: "bg-yellow-400",
              },
              {
                img: "https://new-basel2.myshopify.com/cdn/shop/products/woman-19_1_ddae4bc4-ea0f-4171-9e4f-fef91ce7908d@2x.jpg?v=1575433093",
                tag: "Minerals",
                title: "YOUNG MODEL",
                color: "bg-blue-600",
              },
              {
                img: "https://new-basel2.myshopify.com/cdn/shop/products/woman-19_1_ddae4bc4-ea0f-4171-9e4f-fef91ce7908d@2x.jpg?v=1575433093",
                tag: "Trending",
                title: "MAN’S CASUAL",
                color: "bg-red-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative w-1/3 h-[500px] overflow-hidden group cursor-pointer rounded-[2px]"  
              >
                {/* Overlay background color on hover */}
                <div className="absolute inset-0 bg-[#00000066] opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-10" />

                {/* Image zoom effect */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 z-0">
                  <img src={item.img} alt="nam" className="w-full h-full object-cover" />
                </div>

                {/* Text content */}
                <div className="absolute bottom-6 left-6 text-white z-20">
                  <span
                    className={`text-xs px-2 py-1 font-semibold ${item.color} rounded-sm`}
                  >
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                  <p className="text-sm mb-2">
                    Tincidunt nunc a mattis fames scelerisque fermentum.
                  </p>
                  <button className="text-white hover:text-black text-sm border-b border-white hover:border-black transition-all duration-300">
                    Read More
                  </button>
                </div>
              </div>

            ))}
          </div>



        </div>


        <div className="flex justify-center items-center gap-6 pt-8 py-4">
          {["Gems", "Mineral", "Trending"].map((label) => (
            <a
              key={label}
              href="#"
              className="relative group text-gray-700 hover:text-black transition-colors duration-300"
            >
              {label}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </div>




        {/* Category cards */}
        <div className="flex flex-1 gap-6 px-4 py-6">
          {[
            {
              img: "https://new-basel2.myshopify.com/cdn/shop/products/woman-19_1_ddae4bc4-ea0f-4171-9e4f-fef91ce7908d@2x.jpg?v=1575433093",
              tag: "WOMAN",
              title: "NEW ARRIVALS",
              color: "bg-yellow-400",
            },
            {
              img: "/images/kid.png",
              tag: "FOR STYLED",
              title: "YOUNG MODEL",
              color: "bg-blue-600",
            },
            {
              img: "/images/man.png",
              tag: "COLLECTION",
              title: "MAN’S CASUAL",
              color: "bg-red-600",
            },
            {
              img: "/images/man.png",
              tag: "COLLECTION",
              title: "MAN’S CASUAL",
              color: "bg-red-600",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative w-1/4 h-[400px] bg-gray-500 overflow-hidden group cursor-pointer"
            >
              {/* Background overlay */}
              <div className="absolute inset-0 bg-gray-200 bg-opacity-0 group-hover:bg-opacity-40 transition duration-500"></div>

              {/* Image with scale effect */}
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                <img src={item.img} alt="nam" className="w-full h-full object-cover" />
              </div>

              <div className="absolute bottom-6 left-6 text-white z-10">
                <span className={`text-xs px-2 py-1 font-semibold ${item.color} rounded-sm`}>
                  {item.tag}
                </span>
                <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                <p className="text-sm mb-2">Tincidunt nunc a mattis fames scelerisque fermentum.</p>
                <button className="text-white text-sm border-b border-white hover:text-gray-300">
                  Read More
                </button>
              </div>
            </div>

          ))}
        </div>

      </main>

    </div>
  );
}
