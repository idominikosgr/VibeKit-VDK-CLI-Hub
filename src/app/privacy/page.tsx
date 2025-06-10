import { Metadata } from "next"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { LegalSection } from "@/components/legal/legal-section"

export const metadata: Metadata = {
  title: "Privacy Policy | Vibe Coding Rules Hub",
  description: "Privacy policy for Vibe Coding Rules Hub - how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="We're committed to protecting your privacy and being transparent about how we collect, use, and protect your data."
      icon="security"
      lastUpdated={new Date().toLocaleDateString()}
    >
      <LegalSection title="Information We Collect" icon="databases" highlight>
        <p>
          Vibe Coding Rules Hub is committed to protecting your privacy. We collect minimal information necessary to provide our services:
        </p>
        <ul>
          <li><strong>Authentication Data:</strong> When you sign up, we collect your email address and basic profile information from your chosen authentication provider (Google, GitHub, etc.).</li>
          <li><strong>Usage Data:</strong> We collect anonymous usage statistics to improve our service, including page views and feature usage.</li>
          <li><strong>Content Data:</strong> Rules and collections you create are stored securely and associated with your account.</li>
        </ul>
      </LegalSection>

      <LegalSection title="How We Use Your Information" icon="settings">
        <p>We use your information to:</p>
        <ul>
          <li>Provide and maintain our service</li>
          <li>Authenticate your account</li>
          <li>Save and sync your rules and collections</li>
          <li>Improve our platform through anonymous analytics</li>
          <li>Communicate important service updates</li>
        </ul>
      </LegalSection>

             <LegalSection title="Data Storage and Security" icon="security">
        <p>
          Your data is stored securely using industry-standard encryption and security practices. We use Supabase as our backend service provider, which complies with SOC 2 Type II and other security standards.
        </p>
      </LegalSection>

      <LegalSection title="Data Sharing" icon="user">
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties. We may share anonymous, aggregated usage statistics to help improve our service.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights" icon="check" highlight>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and associated data</li>
          <li>Export your data</li>
        </ul>
      </LegalSection>

      <LegalSection title="Cookies and Analytics" icon="search">
        <p>
          We use essential cookies for authentication and user experience. We may use anonymous analytics to understand how our service is used and improve it.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us" icon="github">
        <p>
          If you have any questions about this Privacy Policy, please contact us through our GitHub repository or via email.
        </p>
      </LegalSection>

      <LegalSection title="Changes to This Policy" icon="refresh">
        <p>
          We may update this Privacy Policy from time to time. We will notify users of any material changes by posting the new Privacy Policy on this page.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
} 