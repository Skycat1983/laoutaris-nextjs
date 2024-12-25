import LogoutForm from "@/components/ui/forms/LogoutForm";
import { IFrontendUser } from "@/lib/client/types/userTypes";
import { authOptions } from "@/lib/config/authOptions";
import { fetchUser } from "@/lib/server/user/data-fetching/fetchUser";
import { formatDate } from "@/utils/formatDate";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("http://localhost:3000");
  }

  console.log("session i dashboard", session);

  const email = session.user.email;

  // Fetch user data using Pick for type safety
  const response = await fetchUser<IFrontendUser>("email", email);

  if (!response.success) {
    redirect("http://localhost:3000");
  }
  const { data } = response;
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <ul>
        <li>User Profile: Display and update user's profile information.</li>
        <p>Email: {data.email}</p>
        <p>Username: {data.username}</p>
        <p>Favourited artworks: {data.favourites.length}</p>
        <p>Watchlist artworks: {data.watchlist.length}</p>
        <p>Account created: {formatDate(data.createdAt)}</p>
        <li>
          Account Settings: Customize account settings, such as privacy and
          notifications.
        </li>
        <li>
          Order History: Show a history of the user's orders or transactions.
        </li>
        <li>
          Security: Update password, enable two-factor authentication, view
          active sessions.
        </li>
        <li>
          Activity Log: Show a history of the user's activity on the platform.
        </li>
        <li>
          Subscription Details: Display user's subscription status and renewal
          date.
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
