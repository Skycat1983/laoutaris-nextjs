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
import { useGlobalFeatures } from "@/lib/contexts/GlobalFeaturesContext";
import {
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  Mail,
  ShoppingBasket,
  User,
} from "lucide-react";
import { useState } from "react";
import SignUpForm from "../forms/SignUpForm";
import SignInForm from "../forms/SignInForm";

export function AccountMenuBar() {
  const { openModal, setModalContent } = useGlobalFeatures();
  const [selectedLanguage, setSelectedLanguage] = useState("eng");
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <User />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onSelect={() => {
              setModalContent(<SignUpForm />);
              openModal();
            }}
          >
            Sign up{" "}
            <MenubarShortcut>
              <Mail className="w-4 h-4" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            onSelect={() => {
              setModalContent(<SignInForm />);
              openModal();
            }}
          >
            Sign in{" "}
            <MenubarShortcut>
              <LogIn className="w-4 h-4" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>
            Sign out{" "}
            <MenubarShortcut>
              <LogOut className="w-4 h-4" />
            </MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger disabled className="menubar-trigger">
          <Heart />
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
        <MenubarTrigger disabled className="menubar-trigger">
          <ShoppingBasket />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
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
      <MenubarMenu>
        <MenubarTrigger>
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
          {/* <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem> */}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
