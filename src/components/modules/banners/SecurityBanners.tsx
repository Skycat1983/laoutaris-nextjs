"use client";

import React from "react";
import {
  Lock,
  UserRound,
  ShieldCheck,
  Truck,
  Clock,
  CreditCard,
  HeartHandshake,
  Package,
  BadgeCheck,
  Medal,
  ShieldAlert,
  Users,
  Wallet,
  Building,
  Phone,
} from "lucide-react";

export const SecurityBannerWhite = () => {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-8">
          <div className="flex flex-col items-center text-center">
            <Lock className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Secure Payment</h3>
            <p className="text-xs text-gray-600">By invoice or credit card</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <UserRound className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Personal Consultation</h3>
            <p className="text-xs text-gray-600">
              Contact us without obligation
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Buyer Protection</h3>
            <p className="text-xs text-gray-600">100% money-back guarantee</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Truck className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">Insured Shipping</h3>
            <p className="text-xs text-gray-600">Professional art logistics</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="w-8 h-8 mb-4 text-gray-700" />
            <h3 className="text-sm font-medium mb-2">24/7 Support</h3>
            <p className="text-xs text-gray-600">Always here to help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SecurityBannerBlack = () => {
  return (
    <div className="w-full bg-neutral-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-8">
          {[
            {
              icon: <Lock />,
              title: "Secure Payments",
              desc: "Protected transactions",
            },
            {
              icon: <ShieldCheck />,
              title: "Buyer Protection",
              desc: "100% guaranteed",
            },
            {
              icon: <UserRound />,
              title: "Personal Service",
              desc: "Expert assistance",
            },
            {
              icon: <Truck />,
              title: "Global Shipping",
              desc: "Worldwide delivery",
            },
            {
              icon: <HeartHandshake />,
              title: "Trust & Safety",
              desc: "Verified artworks",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                {React.cloneElement(item.icon as React.ReactElement, {
                  className:
                    "w-6 h-6 text-white/80 group-hover:text-white transition-colors",
                })}
              </div>
              <h3 className="text-sm font-medium mb-2 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SecurityBannerGrey = () => {
  return (
    <div className="w-full bg-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-12">
          {[
            {
              icon: <Lock />,
              title: "Secure Platform",
              desc: "Encrypted transactions",
            },
            {
              icon: <ShieldCheck />,
              title: "Verified Artists",
              desc: "Authentic artworks",
            },
            {
              icon: <CreditCard />,
              title: "Safe Payments",
              desc: "Multiple methods",
            },
            {
              icon: <UserRound />,
              title: "Expert Support",
              desc: "Dedicated service",
            },
            {
              icon: <Package />,
              title: "Safe Delivery",
              desc: "Insured shipping",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-whitish flex items-center justify-center mb-4">
                {React.cloneElement(item.icon as React.ReactElement, {
                  className: "w-7 h-7 text-black",
                })}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
