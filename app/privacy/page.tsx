import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | CodePilot Rules Hub",
  description: "Privacy policy for CodePilot Rules Hub - how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>Information We Collect</h2>
        <p>
          CodePilot Rules Hub is committed to protecting your privacy. We collect minimal information necessary to provide our services:
        </p>
        <ul>
          <li><strong>Authentication Data:</strong> When you sign up, we collect your email address and basic profile information from your chosen authentication provider (Google, GitHub, etc.).</li>
          <li><strong>Usage Data:</strong> We collect anonymous usage statistics to improve our service, including page views and feature usage.</li>
          <li><strong>Content Data:</strong> Rules and collections you create are stored securely and associated with your account.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and maintain our service</li>
          <li>Authenticate your account</li>
          <li>Save and sync your rules and collections</li>
          <li>Improve our platform through anonymous analytics</li>
          <li>Communicate important service updates</li>
        </ul>

        <h2>Data Storage and Security</h2>
        <p>
          Your data is stored securely using industry-standard encryption and security practices. We use Supabase as our backend service provider, which complies with SOC 2 Type II and other security standards.
        </p>

        <h2>Data Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties. We may share anonymous, aggregated usage statistics to help improve our service.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and associated data</li>
          <li>Export your data</li>
        </ul>

        <h2>Cookies and Analytics</h2>
        <p>
          We use essential cookies for authentication and user experience. We may use anonymous analytics to understand how our service is used and improve it.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our GitHub repository or via email.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify users of any material changes by posting the new Privacy Policy on this page.
        </p>
      </div>
    </div>
  )
} 