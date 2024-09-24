"use client";
import React, { useEffect } from "react";

import { Separator } from "@/components/ui/separator";
import TokenForm from "@/sections/token/token.form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10 px-5 md:px-24">
      <div className="max-w-5xl w-full">
        <div className="space-y-4">
          <div className="flex justify-center">
            <h3 className="text-2xl font-medium">
              Launch your token on{" "}
              <span className="italic">
                SHORT<span className="text-[#dfff16]">BLAST</span>
              </span>
            </h3>
          </div>
          <Separator className="!mb-8" />
          <TokenForm />
        </div>
      </div>
    </main>
  );
}
