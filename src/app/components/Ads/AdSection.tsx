import React from "react";
import CommonButton from '../buttons/CommonButton'
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";

function AdSection() {
  return (
    <section className="w-full h-full flex items-center justify-center py-10 md:py-24 px-10 gap-10 animate-dropIn">
      <div className="w-full h-full flex items-center justify-center flex-col gap-7">
        <h3 className="text-primary text-5xl font-bold text-center">
          Connect with us to advertise your brand
        </h3>
        <p className="text-gray-500 text-center text-xl">
          We offer a variety of advertising options to suit your brand's needs.
        </p>
        <div className="w-full h-full flex items-center justify-center gap-5">
          <Link href="mailto:pollmate4u@gmail.com">
            <CommonButton className="px-6 py-3 rounded-full flex items-center gap-2">
              Mail us <FaEnvelope />
            </CommonButton>
          </Link>
          <Link href="mailto:pollmate4u@gmail.com">
            <p className="text-primary text-xl">pollmate4u@gmail.com</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AdSection;
