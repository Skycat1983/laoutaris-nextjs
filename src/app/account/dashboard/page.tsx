import LogoutForm from "@/components/ui/forms/user/LogoutForm";
import { getUserDashboardData } from "@/lib/server/user/use_cases/getUserDashboardData";
import { formatDate } from "@/utils/formatDate";

export default async function UserDashboard() {
  const { email, username, favourites, watchlist, createdAt } =
    await getUserDashboardData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <ul>
        <li>
          User Profile: Display and update user&apos;s profile information.
        </li>
        <p>Email: {email}</p>
        <p>Username: {username}</p>
        <p>Favourited artworks: {favourites.length}</p>
        <p>Watchlist artworks: {watchlist.length}</p>
        <p>Account created: {formatDate(createdAt)}</p>
        <li>
          Account Settings: Customize account settings, such as privacy and
          notifications.
        </li>
        <li>
          Order History: Show a history of the user&apos;s orders or
          transactions.
        </li>
        <li>
          Security: Update password, enable two-factor authentication, view
          active sessions.
        </li>
        <li>
          Activity Log: Show a history of the user&apos;s activity on the
          platform.
        </li>
        <li>
          Subscription Details: Display user&apos;s subscription status and
          renewal date.
        </li>
        <li>
          Help and Support: Provide links to help resources, FAQs, or support
          contact information.
        </li>
        <li>
          Feedback: Include a form for users to provide feedback or report
          issues.
        </li>
      </ul>
      <LogoutForm />
    </main>
  );
}
