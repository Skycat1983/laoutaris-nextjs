"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/shadcn/menubar";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import {
  ChevronDown,
  CircleUserIcon,
  Heart,
  Link,
  LogIn,
  LogOut,
  Mail,
  ShoppingBasket,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import SignUpForm from "../forms/SignUpForm";
import SignInForm from "../forms/SignInFormBackup";
import { useSession, signIn, signOut } from "next-auth/react";
import ModalMessage from "@/components/ui/common/ModalMessage";
import { useRouter } from "next/router";
import LoginForm from "@/components/ui/forms/LoginForm";
import { AccountMenu } from "./accountMenu/AccountMenu";

interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function AccountMenuBar() {
  const { data, status } = useSession();

  //  the nullish coalescing operator (??)returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
  const session: UserSession | null = data?.user ?? null;

  const { openModal, setModalContent } = useGlobalFeatures();
  const [selectedLanguage, setSelectedLanguage] = useState("eng");

  const menubarTriggerClassname = "menubar-trigger p-2 lg:p-3";

  return (
    <>
      <div className="flex flex-row bg-whitish items-center justify-center">
        {/* <AccountMenu session={session} /> */}
        <AccountMenu />

        <Menubar className="flex flex-row w-auto gap-0 items-center bg-whitish">
          <MenubarMenu>
            <MenubarTrigger disabled className={menubarTriggerClassname}>
              <Heart className="" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Find</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Search the web</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Find...</MenubarItem>
                  <MenubarItem>Find Next</MenubarItem>
                  <MenubarItem>Find Previous</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Cut</MenubarItem>
              <MenubarItem>Copy</MenubarItem>
              <MenubarItem>Paste</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger disabled className={menubarTriggerClassname}>
              <div className="p-1 border-2 border-whitish hover:border-slate/50 rounded-full">
                <ShoppingBasket />
              </div>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem>
                Always Show Bookmarks Bar
              </MenubarCheckboxItem>
              <MenubarCheckboxItem checked>
                Always Show Full URLs
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarItem inset>
                Reload <MenubarShortcut>⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled inset>
                Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem inset>Toggle Fullscreen</MenubarItem>
              <MenubarSeparator />
              <MenubarItem inset>Hide Sidebar</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <div className="hidden md:block">
            <MenubarMenu>
              <MenubarTrigger className={menubarTriggerClassname}>
                <div className="flex flex-row pr-6 items-center">
                  <h1>{selectedLanguage.toUpperCase()}</h1>
                  <ChevronDown />
                </div>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <MenubarRadioItem value="de">DE</MenubarRadioItem>
                  <MenubarRadioItem value="en">EN</MenubarRadioItem>
                  <MenubarRadioItem value="fr">FR</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
          </div>
        </Menubar>
      </div>
    </>
  );
}

{
  /* <MenubarSeparator />
                <MenubarItem inset>Edit...</MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Add Profile...</MenubarItem> */
}

{
  /* <MenubarMenu>
          <MenubarTrigger>
            <User />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled={!session?.user} onSelect={() => {}}>
              {session?.user?.name || "Profile"}
              <MenubarShortcut>
                <CircleUserIcon className="w-4 h-4" />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onSelect={() => {
                setModalContent(<SignUpForm />);
                openModal();
              }}
              disabled={!!session?.user}
            >
              Sign up{" "}
              <MenubarShortcut>
                <Mail className="w-4 h-4" />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              disabled={!!session?.user}
              onSelect={() => {
                setModalContent(<SignInForm />);
                openModal();
              }}
            >
              Sign in
              <MenubarShortcut>
                <LogIn className="w-4 h-4" />
              </MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />
            <MenubarItem
              disabled={!session?.user}
              onSelect={() => {
                signOut();
                setModalContent(<ModalMessage message="Sign out successful" />);
                openModal();
              }}
            >
              Sign out{" "}
              <MenubarShortcut>
                <LogOut className="w-4 h-4" />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu> */
}
