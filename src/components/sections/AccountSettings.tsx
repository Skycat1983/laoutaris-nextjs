import { formatDate } from "@/lib/utils/formatDate";
import React from "react";
import LogoutForm from "../modules/forms/user/LogoutForm";
import { FrontendUser } from "@/lib/data/types/userTypes";

export const AccountSettings = async (props: FrontendUser) => {
  const { email, username, favourites, watchlist, createdAt } = props;

  return (
    <>
      {/* <AccountSettingsV1 {...props} /> */}
      {/* <AccountSettingsV2 {...props} /> */}
      <AccountSettingsV3 {...props} />
    </>
  );
};

export const AccountSettingsV1 = async (props: FrontendUser) => {
  const { email, username, favourites, watchlist, createdAt } = props;

  return (
    <main className="min-h-screen bg-whitish py-12 px-4 sm:px-6 lg:px-8 m-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{username}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Favourited Artworks</p>
              <p className="font-medium">{favourites.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Watchlist Items</p>
              <p className="font-medium">{watchlist.length}</p>
            </div>
            <div className="col-span-2 space-y-2">
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{formatDate(createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold">Security Settings</h3>
            <p className="text-sm text-gray-500">Update password and 2FA</p>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold">Notification Preferences</h3>
            <p className="text-sm text-gray-500">Manage your alerts</p>
          </button>
        </div>

        <LogoutForm />
      </div>
    </main>
  );
};
export const AccountSettingsV2 = async (props: FrontendUser) => {
  const { email, username, favourites, watchlist, createdAt } = props;

  return (
    <main className="min-h-screen bg-gradient-to-br from-whitish to-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div className="mt-2 text-xl font-semibold text-gray-900 truncate">
                {email}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-sm font-medium text-gray-500">Username</div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                {username}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-sm font-medium text-gray-500">
                Member Since
              </div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                {formatDate(createdAt)}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-sm font-medium text-gray-500">
                Favourites
              </div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                {favourites.length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-sm font-medium text-gray-500">Watchlist</div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                {watchlist.length}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <nav className="space-y-2">
                <a
                  href="#"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  Security Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  Notification Preferences
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  Order History
                </a>
                <LogoutForm />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export const AccountSettingsV3 = async (props: FrontendUser) => {
  const { email, username, favourites, watchlist, createdAt } = props;

  return (
    <main className="min-h-screen bg-whitish py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="border-b border-gray-200 pb-8 mb-8">
          <h1 className="text-4xl font-light text-gray-900">Account</h1>
          <p className="mt-2 text-gray-500">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="space-y-12">
          {/* Profile Section */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Profile Information
            </h2>
            <dl className="divide-y divide-gray-100">
              <div className="py-4 flex justify-between">
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{email}</dd>
              </div>
              <div className="py-4 flex justify-between">
                <dt className="text-sm text-gray-500">Username</dt>
                <dd className="text-sm text-gray-900">{username}</dd>
              </div>
              <div className="py-4 flex justify-between">
                <dt className="text-sm text-gray-500">Favourited Artworks</dt>
                <dd className="text-sm text-gray-900">{favourites.length}</dd>
              </div>
              <div className="py-4 flex justify-between">
                <dt className="text-sm text-gray-500">Watchlist Items</dt>
                <dd className="text-sm text-gray-900">{watchlist.length}</dd>
              </div>
              <div className="py-4 flex justify-between">
                <dt className="text-sm text-gray-500">Member Since</dt>
                <dd className="text-sm text-gray-900">
                  {formatDate(createdAt)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Actions Section */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Account Actions
            </h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Security Settings
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Notification Preferences
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Order History
              </button>
              <div className="pt-4">
                <LogoutForm />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
