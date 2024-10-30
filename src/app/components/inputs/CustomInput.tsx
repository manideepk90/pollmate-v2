import React from "react";

function CustomInput({
  placeholder = "Search",
  onChange = () => {},
  value = "",
  type = "text",
  className = "",
  style = {
    padding: "5px 10px",
    outline: "none",
  },
  disabled = false,
  required = false,
  autoFocus = false,
  autoComplete = "off",
  name = "",
  id = "",
  maxLength = 1000,
  minLength = 0,
  pattern = "",
  readOnly = false,
  autoSave = "",
  list = "",
  multiple = false,
  size = 20,
  endIcon = null,
  label = "",
  labelStyle = {
    fontSize: "14px",
    marginBottom: "1px",
  },
  onSubmit = () => {},
}: {
  placeholder?: string;
  onChange?: () => void;
  value?: string;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  name?: string;
  id?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  autoSave?: string;
  list?: string;
  multiple?: boolean;
  size?: number;
  endIcon?: React.ReactNode;
  label?: string;
  labelStyle?: React.CSSProperties;
  onSubmit?: () => void;
}) {
  return (
    <div className="flex flex-col items-start w-full">
      {label && <label style={labelStyle}>{label}</label>}
      <div className="flex items-center gap-2 w-full border px-4 border-gray-700 rounded-3xl">
        <input
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          //   value={value}
          className={className}
          style={style}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          name={name}
          id={id}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          readOnly={readOnly}
          autoSave={autoSave}
          list={list}
          multiple={multiple}
          size={size}
        />
        {endIcon && (
          <div className="cursor-pointer" onClick={onSubmit}>
            {endIcon}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomInput;
