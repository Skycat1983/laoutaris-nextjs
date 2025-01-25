import { TabList } from "@headlessui/react";
import React from "react";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-3 h-full">
      <div className="col-span-2 bg-greyish/10 hover:bg-whitish">
        {/* <div className="flex flex-col m-2 bg-yellow-100"> */}
        <div className="flex flex-col p-4 ">
          <div className="flex flex-row">
            {/* <h1 className={myH1}>{label}</h1> */}
          </div>
          {/* <TabList> */}
          <div className="flex flex-row gap-10 border-b-2 border-greyish/50">
            {/* {tabs.map((tab, i) => (
              <Tab key={i} as="div" className={tab.className}>
                {tab.label}
              </Tab>
            ))} */}
          </div>
          {/* </TabList> */}
        </div>
        {/* LOWER ROW (operations) */}
        <div>
          {/* <TabPanels>
          {tabs.map((tab, i) => (
            <TabPanel key={i}>{tab.component}</TabPanel>
          ))}
        </TabPanels> */}
        </div>
      </div>
      {/* RIGHT COL (latest) */}
      <div className="col-span-1 bg-greyish/10 hover:bg-whitish border-l-2">
        <div className="flex flex-col gap-5">
          <div className="flex flex-row m-2  border-b-2">
            {/* <h1 className={myH1}>Feed</h1> */}
          </div>

          {/* {feedItems &&
          feedItems.map((item: FeedItem, index: number) => (
            <NavLink
              key={index}
              to={`/${label.toLocaleLowerCase()}/${item._id}`}
              className="mx-8"
            >
              <div
                className={getFeedItemClassNames(endpoint as Endpoint)}
              >
                {Object.entries(item).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-row justify-between m-2"
                  >
                    <h2
                      className={"text-xl font-archivo w-1/2 text-left"}
                    >
                      {key}
                    </h2>
                    <h2
                      className={
                        "text-xl font-archivo text-gray-600 truncate w-1/2 text-left"
                      }
                    >
                      {value !== null && value !== undefined
                        ? value.toString()
                        : ""}
                    </h2>
                  </div>
                ))}
              </div>
            </NavLink>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
