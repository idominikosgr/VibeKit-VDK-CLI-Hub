import { Metadata } from "next"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { LegalSection } from "@/components/legal/legal-section"

export const metadata: Metadata = {
  title: "Terms of Service | Vibe Coding Rules Hub",
  description: "Terms of service for Vibe Coding Rules Hub - your rights and responsibilities when using our platform.",
}

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="By using Vibe Coding Rules Hub, you agree to these terms and conditions. Please read them carefully."
      icon="documentation"
      lastUpdated={new Date().toLocaleDateString()}
    >
      <LegalSection title="Acceptance of Terms" icon="check" highlight>
        <p>
          By accessing and using Vibe Coding Rules Hub, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
      </LegalSection>

      <LegalSection title="Description of Service" icon="code">
        <p>
          Vibe Coding Rules Hub is a platform that provides AI-assisted development rules and guidelines to enhance coding workflows. Our service includes:
        </p>
        <ul>
          <li>Access to a comprehensive catalog of coding rules</li>
          <li>Tools for creating and managing custom rule collections</li>
          <li>Rule Generators for AI coding assistants</li>
          <li>Community features for sharing and discovering rules</li>
        </ul>
      </LegalSection>

      <LegalSection title="User Account and Responsibilities" icon="user">
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
        </p>
        <ul>
          <li>Maintaining the confidentiality of your account</li>
          <li>All activities that occur under your account</li>
          <li>Ensuring your content complies with our guidelines</li>
          <li>Respecting the intellectual property rights of others</li>
        </ul>
      </LegalSection>

             <LegalSection title="Acceptable Use" icon="security" highlight>
        <p>You agree not to use our service to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on the rights of others</li>
          <li>Upload malicious code or harmful content</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with the proper functioning of the service</li>
        </ul>
      </LegalSection>

      <LegalSection title="Content and Intellectual Property" icon="folder">
        <p>
          You retain ownership of the content you create and upload to our platform. By using our service, you grant us a license to store, display, and distribute your content as necessary to provide our services.
        </p>
        <p>
          Our platform content, including rules, documentation, and software, is protected by intellectual property laws. Some content is made available under open source licenses.
        </p>
      </LegalSection>

      <LegalSection title="Privacy" icon="security">
        <p>
          Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
        </p>
      </LegalSection>

      <LegalSection title="Service Availability" icon="settings">
        <p>
          We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. We may temporarily suspend the service for maintenance, updates, or other operational reasons.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability" icon="alertTriangle" highlight>
        <p>
          In no event shall Vibe Coding Rules Hub be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </p>
      </LegalSection>

      <LegalSection title="Termination" icon="logout">
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </LegalSection>

      <LegalSection title="Changes to Terms" icon="refresh">
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
        </p>
      </LegalSection>

      <LegalSection title="Contact Information" icon="github">
        <p>
          If you have any questions about these Terms, please contact us through our GitHub repository.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
} 