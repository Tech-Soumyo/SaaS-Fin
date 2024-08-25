"use client";

import { EditAccountSheet } from "@/components/custom/edit-account-sheet";
import { NewAccountSheet } from "@/components/custom/new-account-sheet";
import { useEffect, useState } from "react";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
  // const [isMounted, setMounted] = useState(false);

  // useEffect(()=>{
  //     setMounted(true);
  // }, []);

  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <EditAccountSheet />
      <NewAccountSheet />
    </>
  );
};
