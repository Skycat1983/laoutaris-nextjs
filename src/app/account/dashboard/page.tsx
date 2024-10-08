export default function UserDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <ul>
        <li>User Profile: Display and update user's profile information.</li>
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
    </main>
  );
}
