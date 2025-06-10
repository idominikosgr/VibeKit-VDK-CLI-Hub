import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | CodePilot Rules Hub",
  description: "Terms of service for CodePilot Rules Hub - your rights and responsibilities when using our platform.",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using CodePilot Rules Hub, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>Description of Service</h2>
        <p>
          CodePilot Rules Hub is a platform that provides AI-assisted development rules and guidelines to enhance coding workflows. Our service includes:
        </p>
        <ul>
          <li>Access to a comprehensive catalog of coding rules</li>
          <li>Tools for creating and managing custom rule collections</li>
          <li>Setup wizards for AI coding assistants</li>
          <li>Community features for sharing and discovering rules</li>
        </ul>

        <h2>User Account and Responsibilities</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
        </p>
        <ul>
          <li>Maintaining the confidentiality of your account</li>
          <li>All activities that occur under your account</li>
          <li>Ensuring your content complies with our guidelines</li>
          <li>Respecting the intellectual property rights of others</li>
        </ul>

        <h2>Acceptable Use</h2>
        <p>You agree not to use our service to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on the rights of others</li>
          <li>Upload malicious code or harmful content</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with the proper functioning of the service</li>
        </ul>

        <h2>Content and Intellectual Property</h2>
        <p>
          You retain ownership of the content you create and upload to our platform. By using our service, you grant us a license to store, display, and distribute your content as necessary to provide our services.
        </p>
        <p>
          Our platform content, including rules, documentation, and software, is protected by intellectual property laws. Some content is made available under open source licenses.
        </p>

        <h2>Privacy</h2>
        <p>
          Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
        </p>

        <h2>Service Availability</h2>
        <p>
          We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. We may temporarily suspend the service for maintenance, updates, or other operational reasons.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          In no event shall CodePilot Rules Hub be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </p>

        <h2>Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
        </p>

        <h2>Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us through our GitHub repository.
        </p>
      </div>
    </div>
  )
} 