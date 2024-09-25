"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import WalletConnectButton from "./WalletConnectButton";
import { Icon, Image } from ".";

const menu = [
  {
    title: "Create Token",
    path: "/",
  },
  {
    title: "Short Pool",
    path: "/coming-soon",
  },
  {
    title: "Trading",
    path: "/trading",
  },
];

const Navbar = () => {
  const pathName = usePathname();

  const toggleMenu = (force = false) => {
    const navLinks = document.getElementById("navLinks");
    navLinks?.classList.toggle("opacity-0", force);
    navLinks?.classList.toggle("pointer-events-none", force);
    // navLinks?.classList.toggle('hidden', force);
  };
  React.useEffect(() => {
    toggleMenu(true);
  }, [pathName]);

  return (
    <>
      <nav className="relative z-50 px-[18px] py-2 md:px-[20px] lg:px-[30px] bg-black text-white bg-opacity-50 border-b-[1px] border-opacity-40 w-full flex items-center justify-between">
        <div className="flex items-center gap-[10px] lg:gap-[15px]">
          <Image src={"/Logo.png"} width={200} height={200} alt="icon" />
        </div>
        <div className="flex items-center">
          <div
            id="navLinks"
            className="pointer-events-none fixed inset-0 z-[99] list-none items-center bg-black opacity-0 transition-opacity duration-200 lg:pointer-events-auto lg:relative lg:flex lg:bg-transparent lg:opacity-100"
          >
            <div className="mx-[18px] my-2 flex items-center justify-between lg:hidden">
              <Link href="/" onClick={() => toggleMenu(true)}>
                <div className="flex items-center gap-[10px] lg:gap-[15px]">
                  <Image src={"/Logo.png"} width={200} height={200} alt="icon" />
                </div>
              </Link>
              <div className="flex h-6 w-6 items-center justify-center cursor-pointer mr-4">
                <Icon name="close" className="h-[20px] w-[20px]" onClick={() => toggleMenu(true)} />
              </div>
            </div>
            <ul className="mx-[20px] mt-[10px] flex flex-col justify-center lg:mx-[0px] lg:mt-[0px] lg:flex-row lg:items-center">
              {menu &&
                menu.map((item, index) => (
                  <Link href={item?.path} key={index} onClick={() => toggleMenu(true)}>
                    <li
                      className={`cursor-pointer border-b-[${
                        index < menu.length - 1 ? 1 : 0
                      }px] border-[#FFFFFF33] px-[10px] py-[30px] text-[20px] lg:text-[15px] xl:text-[18px] text-white transition duration-300 ease-in hover:text-rose-400 lg:border-none lg:py-3 lg:px-[20px] xl:px-[30px] uppercase text-center`}
                    >
                      {item?.title}
                    </li>
                  </Link>
                ))}
            </ul>
          </div>
          <WalletConnectButton />
          <button className="lg:hidden px-2 mr-2" onClick={() => toggleMenu()}>
            <Icon name="menu" className="h-[20px] w-[20px]" onClick={() => toggleMenu(true)} />
            {/* <HamburgerMenuIcon className="w-[20px] h-[20px]" /> */}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
