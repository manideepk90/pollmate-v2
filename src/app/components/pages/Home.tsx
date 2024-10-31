import Image from "next/image";
import React from "react";
import CommonButton from "../buttons/CommonButton";
import Link from "next/link";
import PollList from "./poll-list";
import Logo from "../common/logo";

function HomePage() {
  return (
    <main className="w-full h-full">
      <section className="w-full h-full flex items-center flex-col-reverse md:flex-row justify-center py-16 pb-2 md:py-24 px-10 gap-5 animate-dropIn">
        <div className="w-full h-full translate-x-3 md:translate-x-0 flex items-center justify-center">
          <Image
            src="/assets/icons/home_image.svg"
            alt="home-bg"
            width={625}
            height={665}
          />
        </div>
        <div className="w-full h-full flex items-center justify-center flex-col gap-7">
          <h1 className="text-primary text-5xl font-bold text-center">
            Power Your Voice with Pollmate
          </h1>
          <h3 className="text-gray-500 text-center text-2xl font-medium">
            Create, participate in, and analyze polls with ease. Join the
            conversation and make data-driven decisions.
          </h3>
          <div className="flex items-center justify-center gap-5">
            <Link href="/polls/create">
              <CommonButton className="px-6 py-3 rounded-full">
                Create poll
              </CommonButton>
            </Link>
            <Link href="/polls">
              <CommonButton
                variant="outline"
                className="px-6 py-3 rounded-full"
              >
                Explore polls
              </CommonButton>
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full h-full flex items-center flex-col justify-center py-10 md:py-24 px-10 gap-10 animate-dropIn">
        <div className="w-full h-full flex items-center justify-center flex-col gap-7">
          <h1 className="text-primary text-5xl font-medium text-center">
            Why Poll<span className="text-secondary">mate?</span>
          </h1>
        </div>
        <div className="w-full h-full flex md:flex-row flex-col items-center justify-center gap-5 ">
          <div
            className="w-full h-full min-w-[250px] min-h-[250px] p-5 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--linear)",
            }}
          >
            <p className="text-white text-2xl   text-center">
              Design polls tailored to your needs, from single-choice questions
              to in-depth surveys.
            </p>
          </div>
          <div
            className="w-full h-full min-w-[250px] min-h-[250px] p-5  rounded-xl flex items-center justify-center"
            style={{
              background: "var(--linear)",
            }}
          >
            <p className="text-white text-2xl  text-center">
              Watch as votes pour in with live updates, making data insights
              accessible immediately.
            </p>
          </div>
          <div
            className="w-full h-full min-w-[250px] min-h-[250px] p-5  rounded-xl flex items-center justify-center"
            style={{
              background: "var(--linear)",
            }}
          >
            <p className="text-white text-2xl text-center">
              Analyze participation trends, demographics, and response data
              effortlessly.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full h-full flex items-center flex-col justify-center py-10 md:py-24 px-10 gap-10 animate-dropIn">
        <div className="w-full h-full flex items-center justify-center flex-col gap-7">
          <h3 className="text-primary text-5xl font-bold text-center">
            Discover Polls
          </h3>
        </div>
        <div className="w-full h-full flex items-center justify-center translate-x-[-30px] md:translate-x-0">
          <PollList />
        </div>

        <div>
          <Link href="/polls">
            <CommonButton className="px-6 py-3 rounded-full">
              Explore polls
            </CommonButton>
          </Link>
        </div>
      </section>
      <section className="w-full h-full flex items-center flex-col justify-center py-10 md:py-24 px-10 gap-10 animate-dropIn">
        <div className="w-full h-full flex items-center justify-center flex-col gap-7">
          <h3 className="text-primary text-5xl font-bold text-center">
            Get Started with Pollmate
          </h3>
        </div>
        <div className="w-full h-full flex items-center justify-center flex-col md:flex-row gap-7 py-11">
          <div className="w-full h-full flex items-center justify-center flex-col gap-7 md:max-w-[300px]">
            <Image
              src="/assets/images/feature-1.svg"
              alt="home-bg"
              width={200}
              height={200}
            />
            <p className="text-center text-xl">
              Start by setting up a question and poll type in just a few clicks.
            </p>
          </div>
          <div className="w-full h-full flex items-center justify-center flex-col gap-7 md:max-w-[300px]">
            <Image
              src="/assets/images/feature-2.svg"
              alt="home-bg"
              width={200}
              height={200}
            />
            <p className="text-center text-xl">
              Share your poll link with friends, family, or the world!
            </p>
          </div>
          <div className="w-full h-full flex items-center justify-center flex-col gap-7 md:max-w-[300px]">
            <Image
              src="/assets/images/feature-3.svg"
              alt="home-bg"
              width={200}
              height={200}
            />
            <p className="text-center text-xl">
              View live responses and analyze trends with beautiful charts and
              summaries.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <Link href="/polls/create">
            <CommonButton className="px-6 py-3 rounded-full">
              Create poll
            </CommonButton>
          </Link>
          <Link href="/polls">
            <CommonButton variant="outline" className="px-6 py-3 rounded-full">
              Explore polls
            </CommonButton>
          </Link>
        </div>
      </section>
      <section className="w-full h-full flex items-center flex-col justify-center py-10 md:py-24 px-10 gap-10 animate-dropIn">
        <div className="w-full h-full flex items-center justify-center flex-col gap-7">
          <h3 className="text-primary text-5xl font-bold text-center">
            Ready to take your polls to the next level?
          </h3>
        </div>
        <div className="w-full h-full flex items-center justify-center flex-col gap-7">
          <CommonButton className="px-6 py-3 rounded-full">
            Get started
          </CommonButton>
        </div>
      </section>
      <section className="w-full h-full flex items-center justify-center py-10 md:py-24 px-10 gap-10 border-t border-gray-200 animate-dropIn">
        <div className="w-full h-full flex items-center justify-center flex-col gap-4">
          <Logo size="xl" />
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-primary">Poll</span>
            <span className="text-secondary">mate</span>. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            made with <span className="text-primary">❤️</span> by{" "}
            <Link
              href="https://github.com/manideepk90"
              target="_blank"
              className="text-primary"
            >
              manideepk90
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
