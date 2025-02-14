import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React from "react";
import HorizontalDivider from "../src/components/elements/misc/HorizontalDivider";
import { FileText, Image as ImageIcon, User } from "lucide-react";
import CollectionIcon from "../src/components/elements/icons/CollectionIcon";
import BlogIcon from "../src/components/elements/icons/BlogIcon";
import LogoutIcon from "../src/components/elements/icons/LogoutIcon";
import { CreateArtworkForm } from "../src/components/modules/forms/admin/CreateArtworkForm";

type Props = {};

type CrudOperationType = "create" | "read" | "update" | "delete";

const createTabClass = (crudOperation: CrudOperationType) => {
  const tabClass =
    "text-xl font-archivo px-8 text-gray-400 outline-none data-[selected]:border-b-4 data-[selected]:border-black data-[selected]:text-black p-4";

  switch (crudOperation) {
    case "create":
      return (
        tabClass +
        " data-[selected]:text-green-700 data-[selected]:border-green-700"
      );
    case "read":
      return (
        tabClass +
        " data-[selected]:text-blue-400 data-[selected]:border-blue-400"
      );
    case "update":
      return (
        tabClass +
        " data-[selected]:text-orange-400 data-[selected]:border-orange-400"
      );
    case "delete":
      return (
        tabClass +
        " data-[selected]:text-red-700 data-[selected]:border-red-700"
      );
    default:
      return tabClass;
  }
};

const adminConfig = [
  {
    label: "Users",
    icon: <User />,
    endpoint: "users",
    tabs: [
      {
        label: "Create",
        crudOperation: "create",
        className: createTabClass("create"),
        //   component: <SignUp />,
      },
      {
        label: "Delete",
        crudOperation: "delete",
        className: createTabClass("delete"),
        //   component: <SignUp />,
      },
    ],
  },
  {
    label: "Articles",
    icon: <FileText />,
    endpoint: "articles",
    tabs: [
      {
        label: "Create",
        crudOperation: "create",
        className: createTabClass("create"),
        //   component: <CreateArticle />,
      },
      {
        label: "Update",
        crudOperation: "update",
        className: createTabClass("update"),
        //   component: <UpdateBlogPost />,
      },
      {
        label: "Delete",
        crudOperation: "delete",
        className: createTabClass("delete"),
        //   component: <DeleteBlogPost />,
      },
    ],
  },
  {
    label: "Artwork",
    icon: <ImageIcon />,
    endpoint: "artwork",
    tabs: [
      {
        label: "Create",
        crudOperation: "create",
        className: createTabClass("create"),
        component: <CreateArtworkForm />,
      },
      {
        label: "Delete",
        crudOperation: "delete",
        className: createTabClass("delete"),
        //   component: <DeleteArtwork />,
      },
      {
        label: "Update",
        crudOperation: "update",
        className: createTabClass("update"),
        //   component: <UpdateArtwork />,
      },
    ],
  },
  {
    label: "Collections",
    icon: <CollectionIcon />,
    endpoint: "artwork-collections",
    tabs: [
      {
        label: "Create",
        crudOperation: "create",
        className: createTabClass("create"),
        //   component: <CreateArtwork />,
      },
      {
        label: "Delete",
        crudOperation: "delete",
        className: createTabClass("delete"),
        //   component: <DeleteArtwork />,
      },
      {
        label: "Update",
        crudOperation: "update",
        className: createTabClass("update"),
        //   component: <UpdateArtwork />,
      },
    ],
  },
  {
    label: "Blogs",
    icon: <BlogIcon />,
    endpoint: "blogs",
    tabs: [
      {
        label: "Create",
        crudOperation: "create",
        className: createTabClass("create"),
        //   component: <CreateBlogPost />,
      },
      {
        label: "Update",
        crudOperation: "update",
        className: createTabClass("update"),
        //   component: <UpdateBlogPost />,
      },
      {
        label: "Delete",
        crudOperation: "delete",
        className: createTabClass("delete"),
        //   component: <DeleteBlogPost />,
      },
    ],
  },
];

const DashboardLayout = (props: Props) => {
  const myh2 = "text-xl font-archivo px-8 bg-whitish ";

  return (
    <TabGroup>
      <div className="grid grid-cols-5">
        <div className="col-span-1 shadow-xl">
          <TabList>
            <div className="flex flex-col text-left m-8 gap-5">
              {adminConfig.map((tab, i) => (
                <Tab
                  key={i}
                  as="div"
                  className={"flex flex-row items-center outline-none"}
                >
                  {tab.icon}
                  <h2 className={myh2}>{tab.label}</h2>
                </Tab>
              ))}
              <div className="flex flex-row bg-white ">
                <HorizontalDivider />
              </div>
              <div
                className="flex flex-row bg-whitish items-center cursor-pointer"
                // onClick={handleLogout}
              >
                <LogoutIcon />
                <h2 className={myh2}>Logout</h2>
              </div>
            </div>
          </TabList>
        </div>
        <div className="col-span-4 pl-2">
          <TabPanels>
            <TabPanel>
              {/* <Dashboard
            label={adminConfig[0].label}
            endpoint={adminConfig[0].endpoint}
            tabs={adminConfig[0].tabs}
          /> */}
            </TabPanel>
            <TabPanel>
              {/* <Dashboard
            label={adminConfig[1].label}
            endpoint={adminConfig[1].endpoint}
            tabs={adminConfig[1].tabs}
          /> */}
            </TabPanel>
            <TabPanel>
              {/* <Dashboard
            label={adminConfig[2].label}
            endpoint={adminConfig[2].endpoint}
            tabs={adminConfig[2].tabs}
          /> */}
            </TabPanel>
            <TabPanel>
              {/* <Dashboard
            label={adminConfig[3].label}
            endpoint={adminConfig[3].endpoint}
            tabs={adminConfig[3].tabs}
          /> */}
            </TabPanel>
          </TabPanels>
        </div>
      </div>
    </TabGroup>
  );
};

export default DashboardLayout;
