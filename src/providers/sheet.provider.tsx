"use client";

import { EditAccountSheet } from "@/components/custom/edit-account-sheet";
import { EditCategorySheet } from "@/components/custom/edit-category-sheet";
import { NewAccountSheet } from "@/components/custom/new-account-sheet";
import { NewCategorySheet } from "@/components/custom/new-category-sheet";
import { NewTransactionSheet } from "@/components/custom/new-transaction-sheet";
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

      <EditCategorySheet />
      <NewCategorySheet />

      <NewTransactionSheet />
    </>
  );
};
