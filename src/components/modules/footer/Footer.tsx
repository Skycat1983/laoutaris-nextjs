import Link from "next/link";
import { SecurityBannerGrey } from "../banners/SecurityBanners";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <SecurityBannerGrey />
      <footer className="bg-slate w-full mt-auto py-8 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-x divide-greyer">
            <div className="px-8">
              <h5 className="text-xl font-bold mb-2 text-whitish font-cormorant">
                About Us
              </h5>
              <p className="text-whitish">Artwork of Joseph Laoutaris</p>
            </div>
            <div className="px-8">
              <h5 className="text-xl font-bold mb-2 text-whitish font-cormorant">
                Contact
              </h5>
              <ul className="text-whitish">
                <li>Email: hlaoutaris@gmail.com</li>
                <li>Phone: 0049 1577 045 6469</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-700">
            <nav
              aria-label="Legal"
              className="mb-3 flex justify-center gap-4 text-sm text-whitish"
            >
              <Link className="hover:underline" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:underline" href="/terms">
                Terms
              </Link>
            </nav>
            <p className="text-whitish text-center">
              © {currentYear} Joseph Laoutaris. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
