import { Metadata } from "next";
import { getPoll } from "@/app/utils/polls";
import AdComponent from "@/app/components/Ads/AdComponent";
import PollList from "@/app/components/pages/PollList";
import PollDetails from "@/app/components/polls/PollDetails";
import React from "react";

// Generate dynamic metadata for the poll
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const poll = await getPoll(params.id);
    const title = poll.title;
    const description = poll.description;
    const imageUrl = poll.image || "/assets/default-poll-image.png"; // Use poll image or fallback
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/polls/${params.id}`;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: url,
        siteName: "Your Poll Site Name",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
      other: {
        "og:image:width": "1200",
        "og:image:height": "630",
      },
    };
  } catch (error) {
    return {
      title: "Poll",
      description: "View poll details",
    };
  }
}

function Page() {
  return (
    <div className="flex flex-col gap-10 mb-20">
      <div className="min-w-full min-h-full flex gap-5 md:flex-row flex-col md:p-5 p-2 ">
        <AdComponent />
        <PollDetails />
        <AdComponent />
      </div>
      <div className="flex flex-col gap-10 justify-center items-center">
        <h6 className="text-primary text-2xl font-bold">Discover more polls</h6>
        <PollList />
      </div>
    </div>
  );
}

export default Page;
