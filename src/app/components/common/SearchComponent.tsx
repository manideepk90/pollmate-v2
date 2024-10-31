import React from "react";
import CustomInput from "../inputs/CustomInput";
import Image from "next/image";
function SearchComponent({
  placeholder = "Search",
  onChange = (e) => {},
  value = "",
}: {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value?: string;
}) {
  return (
    <div>
      <CustomInput
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        isMaxCharacters={false}
        endIcon={
          <Image
            src={"/assets/icons/search.svg"}
            alt="search-icon"
            width={26}
            height={26}
          />
        }
      />
    </div>
  );
}

export default SearchComponent;
