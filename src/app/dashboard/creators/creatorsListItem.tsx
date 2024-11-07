import CommonButton from "@/app/components/buttons/CommonButton";
import { User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Creator {
  name: string;
  email: string;
  reports?: number;
  pollsCount?: number;
  pollViews?: number;
  id?: string;
  image?: string;
  category?: string;
}

interface CreatorItemProps {
  creator: Creator;
}

const CreatorsListItem: React.FC<CreatorItemProps> = ({ creator }) => {
  return (
    <div
      style={{ background: "var(--linear)", borderRadius: "10px" }}
      className="w-full h-full border p-[1px]"
    >
      <div
        style={{
          borderRadius: "8px",
        }}
        className="w-full h-full flex gap-4 border-gray-200 bg-white p-3 items-center justify-between md:flex-nowrap flex-wrap"
      >
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Link href={`/polls/${creator.id}`}>
              <Image
                src={creator.image || "/assets/images/avatar.svg"}
                alt="creator"
                width={100}
                height={100}
              />
            </Link>
          </div>
          <div className="">
            <Link href={`/polls/${creator.id}`}>
              <h4 className="text-primary cursor-pointer font-bold text-md md:text-2xl hover:text-primary/80">
                {creator.name}
                {creator.reports && (
                  <span className="text-sm text-red-500">
                    {creator.reports} reports
                  </span>
                )}
              </h4>
            </Link>
            <p className="text-sm text-gray-500">{creator.email}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex md:flex-col gap-2 items-end md:items-start">
            <p className="text-md text-primary text-end">
              {creator.pollsCount} polls
            </p>
            <p className="text-md text-primary text-end md:hidden">/</p>
            <p className="text-xl text-primary text-end">
              {creator.pollViews} poll views
            </p>
          </div>
        </div>

        <div className="flex gap-6 justify-center">
          <div className="flex md:flex-col flex-row gap-2">
            <Link href={`/dashboard/creators/${creator.id}`}>
              <CommonButton>view profile</CommonButton>
            </Link>
            <CommonButton variant="outline">block user</CommonButton>
          </div>
          <div className=" flex md:justify-end justify-between flex-row gap-4">
            <Image
              src="/assets/icons/share.svg"
              alt="share"
              width={20}
              height={20}
            />
            {/* <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            /> */}
            <Image
              src="/assets/icons/download.svg"
              alt="download"
              width={20}
              height={20}
            />
            {/* <Image
              src="/assets/icons/delete.svg"
              alt="delete"
              width={20}
              height={20}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorsListItem;
