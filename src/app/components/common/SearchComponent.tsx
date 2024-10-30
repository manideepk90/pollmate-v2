import React from "react";
import CustomInput from "../inputs/CustomInput";
import Image from "next/image";
function SearchComponent({
  placeholder = "Search",
  onChange = () => {},
  value = "",
}) {
  return (
    <div>
      <CustomInput
        placeholder={placeholder}
        onChange={onChange}
        value={value}
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
