"use client";
import CommonButton from "@/app/components/buttons/CommonButton";
import Space from "@/app/components/common/Space";
import CustomInput from "@/app/components/inputs/CustomInput";
import Image from "next/image";
import React, { useRef, useState } from "react";

function page() {
  const [options, setOptions] = useState<{ key: string; value: string }[]>([
    { key: "1", value: "" },
    { key: "2", value: "" },
  ]);
  const [key, setKey] = useState(3);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input value
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleAddOption = () => {
    if (options.length < 10)
      setOptions((prev) => [...prev, { key: key.toString(), value: "" }]);
    setKey(key + 1);
  };

  const handleDeleteOption = (index: number) => {
    console.log("Deleting option at index:", index);
    setOptions((prev) => {
      const newOptions = prev.filter((_, i) => i !== index);
      console.log("New options array:", newOptions);
      return newOptions;
    });
  };

  const handleChangeOption = (index: number, value: string) => {
    setOptions((prev) => [
      ...prev.slice(0, index),
      { key: prev[index].key, value },
      ...prev.slice(index + 1),
    ]);
  };

  return (
    <div className="flex flex-col gap-10 justify-center items-center py-10 px-3">
      <div>
        <h1 className="text-primary text-3xl font-bold">Create poll</h1>
      </div>
      <div className="flex flex-col gap-5 w-full max-w-3xl">
        <div className="flex flex-col gap-5">
          <h2 className="text-primary text-2xl font-bold">Poll title</h2>
          <CustomInput
            placeholder="Poll title"
            borderRadius="rounded-md"
            description="This is the title of your poll. It will be displayed at the top of your poll."
            padding="2px 6px"
            inputStyle={{ padding: "2px 6px" }}
            maxCharacters={50}
          />
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="text-primary text-2xl font-bold">Poll description</h2>
          <CustomInput
            placeholder="Poll description"
            borderRadius="rounded-md"
            description="This is the description of your poll. It will be displayed below the title."
            padding="2px 6px"
            inputStyle={{ padding: "2px 6px" }}
            multiline={true}
            maxCharacters={350}
          />
        </div>
        <div className="flex flex-col gap-2 select-none">
          <h2 className="text-primary text-2xl font-bold">Poll image</h2>
          <div
            className="flex items-center justify-center w-full h-28 border border-primary rounded-md cursor-pointer"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click();
              }
            }}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="poll-image"
                width={100}
                height={100}
              />
            ) : (
              <p>Upload image (optional)</p>
            )}
            <input
              type="file"
              className="hidden"
              ref={inputRef}
              onChange={handleImageChange}
            />
          </div>
          <p className="text-primary text-sm">
            Image should be in .jpg, .jpeg, .png format and should be less than
            10MB
          </p>
          {image && (
            <p className="text-primary text-sm">
              {image.name} - {image.size} bytes
            </p>
          )}
          {image && (
            <CommonButton
              variant="outline"
              style={{
                width: "fit-content",
                borderColor: "red",
                color: "red",
              }}
              callback={handleImageRemove}
            >
              Remove image
            </CommonButton>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="text-primary text-2xl font-bold">Poll options</h2>
          {options.length > 0 &&
            options.map((option, index) => (
              <CustomInput
                label={`Option ${index + 1}`}
                labelClassName="text-primary text-2xl font-bold"
                placeholder={`Option ${index + 1}`}
                borderRadius="rounded-md"
                key={option.key}
                value={option.value}
                onChange={(e) => {
                  handleChangeOption(index, e.target.value);
                }}
                endIcon={
                  index > 1 ? (
                    <Image
                      src="/assets/icons/close.svg"
                      alt="delete"
                      width="18"
                      height="18"
                    />
                  ) : null
                }
                onEndIconClick={() => {
                  handleDeleteOption(index);
                }}
                isMaxCharacters={false}
              />
            ))}
        </div>

        <div className="flex flex-col gap-5">
          <h4 className="text-primary text-md font-bold">
            You can add upto max 10 options
          </h4>
        </div>

        <div className="flex gap-5">
          <CommonButton
            disabled={options.length >= 10}
            callback={() => {
              handleAddOption();
            }}
            className="w-full h-12"
            title={options.length >= 10 ? "max 10 options" : ""}
          >
            Add option
          </CommonButton>
          <CommonButton
            variant="outline"
            callback={() => {
              console.log(options);
            }}
            className="w-full h-12"
          >
            Post
          </CommonButton>
        </div>
        {/* <div className="flex flex-col gap-5">
          <h2 className="text-primary text-2xl font-bold">Poll end date</h2>
          <CustomInput
            label="End date"
            type="date"
            labelClassName="text-primary text-2xl font-bold"
            placeholder="End date"
            borderRadius="rounded-md"
            isMaxCharacters={false}
          />

        </div> */}
      </div>
      <Space height="100px" />
    </div>
  );
}

export default page;
