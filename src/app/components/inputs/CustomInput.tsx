"use client";
import React from "react";

function CustomInput({
  placeholder = "Search",
  onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {},
  value = "",
  type = "text",
  className = "",
  style = {},
  padding = "5px 10px",
  outline = "none",
  borderRadius = "rounded-3xl",
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
  description = "",
  inputStyle = {},
  multiline = false,
  maxCharacters = 300,
  isMaxCharacters = true,
  maxRows = 3,
  border = "border border-gray-700",
  labelClassName = "",
  onEndIconClick = () => {},
  onKeyDown = () => {},
}: {
  borderRadius?: string;
  placeholder?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  multiline?: boolean;
  value?: string;
  type?: string;
  className?: string;
  maxCharacters?: number;
  maxRows?: number;
  border?: string;
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
  padding?: string;
  autoSave?: string;
  list?: string;
  multiple?: boolean;
  size?: number;
  endIcon?: React.ReactNode;
  label?: string;
  labelStyle?: React.CSSProperties;
  description?: string;
  onSubmit?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  outline?: string;
  inputStyle?: React.CSSProperties;
  isMaxCharacters?: boolean;
  labelClassName?: string;
  onEndIconClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-start w-full">
      {label && (
        <label className={labelClassName} style={labelStyle}>
          {label}
        </label>
      )}
      <div
        style={{ padding, ...style }}
        className={`flex items-center gap-2 w-full ${border} ${borderRadius}`}
      >
        {multiline ? (
          <textarea
            rows={maxRows}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            className={`${className} w-full`}
            style={{ outline, ...inputStyle }}
            disabled={disabled}
            required={required}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            name={name}
            id={id}
            maxLength={maxLength}
            minLength={minLength}
            readOnly={readOnly}
            autoSave={autoSave}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            className={`${className} w-full`}
            style={{ outline, ...inputStyle }}
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
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
          />
        )}
        {endIcon && (
          <div className="cursor-pointer" onClick={onEndIconClick}>
            {endIcon}
          </div>
        )}
      </div>
      {description && <p className="text-primary text-sm">{description} </p>}
      {isMaxCharacters && maxCharacters && (
        <p className="text-primary text-sm">
          {maxCharacters} characters remaining
        </p>
      )}
    </div>
  );
}

export default  CustomInput;
