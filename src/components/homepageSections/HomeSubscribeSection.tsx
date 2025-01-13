import React from "react";
import SubscribeForm from "../ui/forms/SubscribeForm";

const HomeSubscribeSection = () => {
  return (
    <div className="border border-black grid grid-cols-12 gap-4 bg-slate/5">
      <div className="col-start-1 col-end-6 flex flex-col items-center justify-center gap-8 text-center bg-slate/10">
        <div>
          <h1 className="text-4xl font-cormorant">Stay up to date</h1>
        </div>
        <div>
          <h1>Subscribe to our newsletter for discounts and updates.</h1>
        </div>
      </div>

      <div className="bg-slate-100 border col-start-7 col-end-12">
        <SubscribeForm />
      </div>
    </div>
  );
};

export default HomeSubscribeSection;
