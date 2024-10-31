import Image from "next/image";
import Link from "next/link";
import React from "react";

function PollListItem({
  poll = {
    title: "test poll",
    description: "test description",
    createdAt: new Date(),
    updatedAt: new Date(),
    options: [],
    publicLink: "123",
  },
}: {
  poll?: Poll;
}) {
  return (
    <div
      style={{ background: "var(--linear)", padding: "1px" }}
      className="w-full rounded-md"
    >
      <div className="w-full h-full rounded-md bg-white p-2 flex gap-4 items-center">
        <div className="flex-1">
          <Link href={`/polls/${poll?.publicLink}`}>
            <h4 className="text-primary cursor-pointer">{poll?.title}</h4>
          </Link>
          <p className="text-sm text-gray-500">{poll?.description}</p>
        </div>
        <div className="flex-1">
          <table
            className="text-sm text-gray-500"
            cellSpacing={10}
            style={{ borderSpacing: "10px 15px" }}
          >
            <tbody>
              <tr>
                <td>Option 1</td>
                <td>150</td>
              </tr>
              <tr>
                <td>Option 2</td>
                <td>10</td>
              </tr>
              <tr>
                <td>Others</td>
                <td>10</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex-1">
          <table
            className="text-sm text-gray-500"
            cellSpacing={10}
            style={{ borderSpacing: "10px 15px" }}
          >
            <tbody>
              <tr>
                <td>1000</td>
                <td>views</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="flex md:flex-row flex-col gap-4">
            <Image
              src="/assets/icons/share.svg"
              alt="share"
              width={20}
              height={20}
            />
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
            <Image
              src="/assets/icons/download.svg"
              alt="download"
              width={20}
              height={20}
            />
            <Image
              src="/assets/icons/delete.svg"
              alt="delete"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollListItem;
