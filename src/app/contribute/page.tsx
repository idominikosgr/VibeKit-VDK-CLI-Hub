import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeIcon, GitHubLogoIcon, FileTextIcon } from "@radix-ui/react-icons";

// Disable static generation to fix createContext build error
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contribute | VibeKit VDK Hub",
  description:
    "Learn how to contribute to VibeKit VDK Hub - submit rules, report issues, and help build the community.",
};

export default function ContributePage() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Contribute to VibeKit VDK Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Help us build the most comprehensive collection of AI-assisted
          development rules and guidelines.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className="h-5 w-5" />
              Submit Rules
            </CardTitle>
            <CardDescription>
              Share your coding rules and best practices with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create and submit new coding rules, patterns, and guidelines that
              can help other developers improve their AI-assisted workflows.
            </p>
            <Button asChild className="w-full">
              <Link href="/rules">Browse Rules</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitHubLogoIcon className="h-5 w-5" />
              GitHub Issues
            </CardTitle>
            <CardDescription>
              Report bugs, request features, or suggest improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Found a bug or have an idea for a new feature? Open an issue on
              our GitHub repository.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a
                href="https://github.com/idominikosgr/Vibe-Coding-Rules/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                Open Issue
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Documentation
            </CardTitle>
            <CardDescription>
              Help improve our documentation and guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Contribute to our documentation, write tutorials, or help
              translate content.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/docs">View Docs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h2>Ways to Contribute</h2>

        <h3>1. Create and Share Rules</h3>
        <p>
          The heart of our platform is the community-contributed rules. You can
          contribute by:
        </p>
        <ul>
          <li>
            Creating new coding rules for specific technologies or frameworks
          </li>
          <li>Improving existing rules with better examples or descriptions</li>
          <li>Adding compatibility information for different AI assistants</li>
          <li>Organizing rules into useful collections</li>
        </ul>

        <h3>2. Code Contributions</h3>
        <p>Help improve the platform itself by contributing code:</p>
        <ul>
          <li>Fix bugs and issues</li>
          <li>Implement new features</li>
          <li>Improve performance and user experience</li>
          <li>Add tests and improve code quality</li>
        </ul>

        <h3>3. Documentation and Content</h3>
        <p>Help make our platform more accessible:</p>
        <ul>
          <li>Write or improve documentation</li>
          <li>Create tutorials and guides</li>
          <li>Help with translations</li>
          <li>Review and edit existing content</li>
        </ul>

        <h3>4. Community Support</h3>
        <p>Help build our community:</p>
        <ul>
          <li>Answer questions and help other users</li>
          <li>Moderate content and ensure quality</li>
          <li>Share the platform with others</li>
          <li>Provide feedback and suggestions</li>
        </ul>

        <h2>Getting Started</h2>

        <h3>For Rule Contributions</h3>
        <ol>
          <li>Create an account and explore existing rules</li>
          <li>Use our Rule Generator to understand rule formats</li>
          <li>Start by creating rules for technologies you know well</li>
          <li>Test your rules with your AI assistant before sharing</li>
        </ol>

        <h3>For Code Contributions</h3>
        <ol>
          <li>Fork our repository on GitHub</li>
          <li>Set up the development environment</li>
          <li>Look for issues labeled "good first issue"</li>
          <li>Submit a pull request with your changes</li>
        </ol>

        <h2>Guidelines</h2>
        <p>
          To ensure high quality contributions, please follow these guidelines:
        </p>
        <ul>
          <li>
            <strong>Quality:</strong> Ensure your rules are well-tested and
            documented
          </li>
          <li>
            <strong>Clarity:</strong> Write clear, understandable descriptions
            and examples
          </li>
          <li>
            <strong>Originality:</strong> Don't duplicate existing rules without
            adding value
          </li>
          <li>
            <strong>Attribution:</strong> Credit sources and inspirations
            appropriately
          </li>
          <li>
            <strong>Respect:</strong> Be respectful and constructive in all
            interactions
          </li>
        </ul>

        <h2>Recognition</h2>
        <p>
          We value all contributions to our platform. Contributors are
          recognized through:
        </p>
        <ul>
          <li>Attribution on contributed rules and content</li>
          <li>Contributor badges and recognition</li>
          <li>Inclusion in our contributors list</li>
          <li>Early access to new features</li>
        </ul>

        <h2>Questions?</h2>
        <p>
          If you have any questions about contributing, please don't hesitate to
          reach out:
        </p>
        <ul>
          <li>Open an issue on GitHub for technical questions</li>
          <li>Join our Discord community for discussions</li>
          <li>Contact us directly for partnership opportunities</li>
        </ul>
      </div>
    </div>
  );
}
