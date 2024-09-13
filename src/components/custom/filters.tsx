import React from "react";
import AccountFilter from "./accountFilter";
import DateFilter from "./dateFilter";

const Filters = () => {
  return (
    <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2 lg:gap-y-0">
      <AccountFilter />
      <DateFilter />
    </div>
  );
};

export default Filters;
