import useOutsideClick from "@/utils/useOutsideClick";
import React, { forwardRef, useImperativeHandle, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
}

export interface MultiSelectDropdownHandle {
  selectedOptions: Option[];
}

export const MultiSelectDropdown = forwardRef<
  MultiSelectDropdownHandle,
  MultiSelectDropdownProps
>(({ options }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle option selection
  const handleSelect = (option: Option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Handle removing selected option
  const handleRemove = (option: Option) => {
    setSelectedOptions(
      selectedOptions.filter((selected) => selected.value !== option.value)
    );
  };

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useImperativeHandle(
    ref,
    () => {
      return { selectedOptions };
    },
    [selectedOptions]
  );

  const refForOutsideDropdown = useOutsideClick(() => setIsOpen(false));

  return (
    <div className="relative inline-block w-96" ref={refForOutsideDropdown}>
      <div
        className="border border-gray-300 bg-white rounded-lg p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="bg-blue-500 text-white px-2 py-1 rounded-lg"
              >
                {option.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option);
                  }}
                  className="ml-1 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">Select options...</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute border border-gray-300 bg-white rounded-lg mt-2 w-full z-10">
          <input
            type="text"
            className="w-full border-b border-gray-300 p-2"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-black"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-400">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
