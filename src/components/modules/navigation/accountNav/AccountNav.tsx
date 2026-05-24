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
} from "@/components/shadcn/menubar";
import { UserIcon } from "@/components/elements/icons/UserIcon";
import { ChevronDown, Heart, ShoppingBasket } from "lucide-react";
import { lazy, Suspense, useState } from "react";

const LazyAccountNavDropdown = lazy(() =>
  import("./accountNavDropdown/AccountNavDropdown").then((module) => ({
    default: module.AccountNavDropdown,
  }))
);

interface AccountNavTriggerShellProps {
  isLoading?: boolean;
  onAccountMenuIntent: (options?: { openAfterLoad?: boolean }) => void;
}

function AccountNavTriggerShell({
  isLoading = false,
  onAccountMenuIntent,
}: AccountNavTriggerShellProps) {
  const handleOpenIntent = () => {
    onAccountMenuIntent({ openAfterLoad: true });
  };

  const handleLoadIntent = () => {
    onAccountMenuIntent();
  };

  return (
    <div className="relative z-10 m-0 flex max-w-max flex-1 items-center justify-center p-0">
      <button
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-busy={isLoading || undefined}
        className="group inline-flex w-max items-center justify-center rounded-md bg-whitish px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
        onClick={handleOpenIntent}
        onFocus={handleLoadIntent}
        onPointerEnter={handleOpenIntent}
      >
        <div className="p-1 -m-1 border-2 border-whitish hover:border-slate/50 rounded-full">
          <UserIcon />
        </div>
      </button>
    </div>
  );
}

export function AccountNav() {
  const [selectedLanguage, setSelectedLanguage] = useState("eng");
  const [hasAccountMenuIntent, setHasAccountMenuIntent] = useState(false);
  const [openAccountMenuOnLoad, setOpenAccountMenuOnLoad] = useState(false);

  const menubarTriggerClassname = "menubar-trigger p-2 lg:p-3";

  const handleAccountMenuIntent = (
    options: { openAfterLoad?: boolean } = {}
  ) => {
    if (options.openAfterLoad) {
      setOpenAccountMenuOnLoad(true);
    }

    setHasAccountMenuIntent(true);
  };

  return (
    <>
      <div className="flex flex-row bg-whitish items-center justify-center">
        {hasAccountMenuIntent ? (
          <Suspense
            fallback={
              <AccountNavTriggerShell
                isLoading
                onAccountMenuIntent={handleAccountMenuIntent}
              />
            }
          >
            <LazyAccountNavDropdown initialOpen={openAccountMenuOnLoad} />
          </Suspense>
        ) : (
          <AccountNavTriggerShell
            onAccountMenuIntent={handleAccountMenuIntent}
          />
        )}

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
