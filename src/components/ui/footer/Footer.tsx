function Footer() {
  return (
    <footer className="bg-slate w-full mt-auto py-8 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-x divide-greyer">
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
          <div className="flex-col px-8">
            <h5 className="text-xl font-bold text-whitish font-cormorant">
              Follow Us
            </h5>
            <div className="space-x-4 m-auto">
              <a href="#" className="text-whitish">
                Facebook
              </a>
              <a href="#" className="text-whitish">
                Twitter
              </a>
              <a href="#" className="text-whitish">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-gray-700">
          <p className="text-whitish text-center">
            © 2024 Joseph Laoutaris. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
