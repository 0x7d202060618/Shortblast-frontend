import React from "react";

import PoolsProvider from "@/contexts/PoolsProvider";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PoolsProvider>{children}</PoolsProvider>;
}
