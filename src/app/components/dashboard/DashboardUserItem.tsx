import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePollCount } from "@/app/hooks/usePollCount";

interface DashboardUserItemProps {
  creator: {
    id: string;
    name: string;
    image: string;
    category: string;
    email?: string;
  };
}

function DashboardUserItem({ creator }: DashboardUserItemProps) {
  const { pollsCount, loading, pollsViewsCount } = usePollCount(creator.id);

  return (
    <div
      style={{ background: "var(--linear)", borderRadius: "10px" }}
      className="w-full border p-[1px]"
    >
      <div
        style={{ borderRadius: "8px" }}
        className="w-full flex gap-4 flex-col border-gray-200 p-4 bg-white  justify-between md:flex-nowrap flex-wrap"
      >
        <div className="flex items-center gap-3">
          {creator.image ? (
            <Image
              src={creator.image}
              alt={creator.name || "user"}
              width={30}
              height={30}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-[30px] h-[30px] relative">
              <Image
                src="/assets/icons/user.svg"
                alt={creator.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <Link href={`/dashboard/creators/${creator.id}`}>
              <h3 className="font-semibold text-primary cursor-pointer text-xl">
                {creator.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500">
              {creator.email || "No email provided"}
            </p>
          </div>
        </div>

        <div className="flex md:flex-col gap-2 items-end md:items-start">
          <p className="text-md text-primary text-end">
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${pollsCount.toLocaleString()} ${
                pollsCount === 1 ? "poll" : "polls"
              }`
            )}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
              {pollsViewsCount.toLocaleString()} views
            </span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href={`/dashboard/creators/${creator.id}`}>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all">
              View Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardUserItem;
