// "use client";

// import { SingleValue } from "react-select";
// import CreatableSelect from "react-select/creatable";
// import { useMemo } from "react";

// type Props = {
//   onChange: (value?: string) => void;
//   onCreate: (value: string) => void;
//   options?: { label: string; value: string }[];
//   value?: string | null | undefined;
//   disabled?: boolean;
//   placeholder?: string;
// };

// export const Select = ({
//   value,
//   onChange,
//   disabled,
//   placeholder,
//   onCreate,
//   options = [],
// }: Props) => {
//   const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
//     onChange(option?.value);
//   };
//   const formattedValue = useMemo(() => {
//     return options.find((option) => option.value === value);
//   }, [options, value]);
//   return (
//     <CreatableSelect
//       placeholder={placeholder}
//       className="h-10 text-sm"
//       styles={{
//         control: (base) => ({
//           ...base,
//           borderColor: "#e2e8f0",
//           ":hover": {
//             borderColor: "#e2e8f0",
//           },
//         }),
//       }}
//       value={formattedValue}
//       onChange={onSelect}
//       options={options}
//       onCreateOption={onCreate}
//       isDisabled={disabled}
//     />
//   );
// };
"use client";

import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useMemo } from "react";

type Option = { label: string; value: string };

type Props = {
  onChange: (value?: string) => void;
  onCreate: (value: string) => void;
  options?: Option[];
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
};

export const Select = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select...",
  onCreate,
  options = [],
}: Props) => {
  const onSelect = (option: SingleValue<Option>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  return (
    <CreatableSelect
      placeholder={placeholder}
      className="h-10 text-sm"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
};
