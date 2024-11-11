"use client";
import CommonButton from "@/app/components/buttons/CommonButton";
import Space from "@/app/components/common/Space";
import CustomInput from "@/app/components/inputs/CustomInput";
import { db } from "@/firebase/initFirebase";
import { collection, addDoc } from "firebase/firestore";
import withAuth from "@/hoc/withAuth";
import Image from "next/image";
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function CreateAdPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [type, setType] = useState("banner"); // banner, popup, etc.
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageFillType, setImageFillType] = useState("cover");

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
      inputRef.current.value = "";
    }
  };

  const handleCreateAd = async () => {
    setLoading(true);
    if (title.trim() === "") {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    if (redirectLink.trim() === "") {
      toast.error("Redirect link is required");
      setLoading(false);
      return;
    }

    if (!maxViews || isNaN(Number(maxViews))) {
      toast.error("Max views must be a valid number");
      setLoading(false);
      return;
    }

    if (!user) {
      toast.error("User not found");
      setLoading(false);
      return;
    }

    let downloadURL = null;
    if (image) {
      if (image.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        setLoading(false);
        return;
      }
      const storage = getStorage();
      const storageRef = ref(storage, `ads/${uuidv4()}.jpg`);
      await uploadBytes(storageRef, image);
      toast.success("Image uploaded successfully");
      downloadURL = await getDownloadURL(storageRef);
    }

    try {
      const adDoc = {
        uid: uuidv4(),
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        title: title,
        description: description || "",
        redirectLink: redirectLink,
        image: downloadURL,
        maxViews: Number(maxViews),
        currentViews: 0,
        clicks: 0,
        type: type,
        imageFillType: imageFillType,
        isActive: true,
        isBlocked: false,
      };

      await addDoc(collection(db, "ads"), adDoc);
      toast.success("Ad created successfully");
      router.push("/dashboard/ads");
    } catch (error: any) {
      console.error(error);
      toast.error(`Error creating ad: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 justify-center items-center py-10 px-3">
      <Toaster />
      <div>
        <h1 className="text-primary text-3xl font-bold">Create Ad</h1>
      </div>
      <div className="flex flex-col gap-5 w-full max-w-3xl">
        <div className="flex flex-col gap-5">
          <h2 className="text-primary text-2xl font-bold">Ad Title</h2>
          <CustomInput
            placeholder="Ad title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            borderRadius="rounded-md"
            description="This is the title of your advertisement"
            padding="2px 6px"
            inputStyle={{ padding: "2px 6px" }}
            maxCharacters={50}
          />
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-primary text-2xl font-bold">Redirect Link</h2>
          <CustomInput
            placeholder="https://example.com"
            value={redirectLink}
            onChange={(e) => setRedirectLink(e.target.value)}
            borderRadius="rounded-md"
            description="Where users will be directed when they click the ad"
            padding="2px 6px"
            inputStyle={{ padding: "2px 6px" }}
          />
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-primary text-2xl font-bold">
            Description (Optional)
          </h2>
          <CustomInput
            placeholder="Ad description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            borderRadius="rounded-md"
            description="Additional information about your ad"
            padding="2px 6px"
            inputStyle={{ padding: "2px 6px" }}
            multiline={true}
            maxCharacters={350}
          />
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-primary text-2xl font-bold">Max Views</h2>
          <CustomInput
            placeholder="Maximum number of views"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            borderRadius="rounded-md"
            description="Maximum number of times this ad will be shown"
            padding="2px 6px"
            inputStyle={{ padding: "2px 6px" }}
            type="number"
          />
        </div>

        <div className="flex flex-col gap-2 select-none">
          <h2 className="text-primary text-2xl font-bold">Ad Image</h2>
          <div
            className="flex items-center justify-center w-full h-28 border border-primary rounded-md cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="ad-image"
                width={100}
                height={100}
              />
            ) : (
              <p>Upload image</p>
            )}
            <input
              type="file"
              className="hidden"
              ref={inputRef}
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <p className="text-primary text-sm">
            Image should be in .jpg, .jpeg, .png format and should be less than
            10MB
          </p>
          {image && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h3 className="text-primary font-semibold">Image Fill Type</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="imageFillType"
                      value="cover"
                      checked={imageFillType === "cover"}
                      onChange={(e) => setImageFillType(e.target.value)}
                    />
                    Cover
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="imageFillType"
                      value="contain"
                      checked={imageFillType === "contain"}
                      onChange={(e) => setImageFillType(e.target.value)}
                    />
                    Contain
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Cover:</strong> Image will fill the entire container,
                  possibly cropping parts to maintain aspect ratio.
                  <br />
                  <strong>Contain:</strong> Entire image will be visible within
                  the container, possibly showing empty space on sides.
                </p>
              </div>
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
            </div>
          )}
        </div>

        <div className="flex gap-5">
          <CommonButton
            loading={loading}
            callback={handleCreateAd}
            className="w-full h-12"
          >
            Create Ad
          </CommonButton>
        </div>
      </div>
      <Space height="100px" />
    </div>
  );
}

export default withAuth(CreateAdPage);
