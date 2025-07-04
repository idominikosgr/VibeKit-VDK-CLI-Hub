"use client";

import { useEffect, useState } from "react";
import {
  CaretRightIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type definition for form values from setup-form.tsx
type SetupFormValues = {
  projectName: string;
  projectPath?: string;
  aiAssistant: string;
  otherAssistant?: string;
  ide: string;
  otherIde?: string;
  primaryLanguage: string;
  otherLanguage?: string;
  frameworks?: string[];
  includeCategories: {
    languages: boolean;
    tasks: boolean;
    technologies: boolean;
    aitools: boolean;
  };
  installationMethod: string;
  mcpDatabases: string[];
  versionConstraints?: {
    minVersion?: string;
    maxVersion?: string;
    strictVersionCheck: boolean;
  };
  compatibility?: {
    ides?: string[];
    aiAssistants?: string[];
    frameworks?: string[];
  };
};

// Import Supabase rule service to fetch real data
import {
  getRulesByCategory,
  searchRules,
  findRuleByIdentifier,
} from "@/lib/services/supabase-rule-service";
import { Rule } from "@/lib/types";

// Type for rule compatibility status
type RuleCompatibilityStatus = {
  id: string;
  name: string;
  supported: boolean;
};

// Type for file structure
type FileItem = {
  name: string;
  type: "folder" | "file";
  children?: FileItem[];
};

export function SetupPreview({ config }: { config: SetupFormValues | null }) {
  const [activeTab, setActiveTab] = useState("preview");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample rule content to preview
  // Generate rule preview with real data from Supabase
  const generateRulePreview = async () => {
    if (!config)
      return "// Select categories and options to preview rule content";

    try {
      // Find appropriate rules based on the configuration
      let searchQuery = "";
      let category_id = "";

      // Determine the most relevant search terms based on config
      if (config.primaryLanguage) {
        const langKey =
          config.primaryLanguage === "other"
            ? config.otherLanguage || "typescript"
            : config.primaryLanguage;
        searchQuery = langKey;
        category_id = "languages";
      }

      if (config.frameworks && config.frameworks.length > 0) {
        // If framework is specified, it takes priority
        searchQuery = config.frameworks[0];
        category_id = "technologies";
      }

      if (config.aiAssistant) {
        // If AI assistant is specified, add it to the query
        const assistantKey =
          config.aiAssistant === "other"
            ? config.otherAssistant || "cursor"
            : config.aiAssistant;
        // Only use as main query if no language/framework was specified
        if (!searchQuery) {
          searchQuery = assistantKey;
          category_id = "aitools";
        }
      }

      // Fallback to general terms if nothing specific was found
      if (!searchQuery) {
        searchQuery = "code quality";
        category_id = "tasks";
      }

      console.log(
        `MagnifyingGlassing for rule with query: ${searchQuery}, category: ${category_id}`
      );

      // Try multiple approaches to find a suitable rule
      let rule;
      let foundRules: Rule[] = [];

      // Try a direct category search first if we have a category
      if (category_id) {
        try {
          const categoryResults = await getRulesByCategory(category_id);
          if (categoryResults && categoryResults.data.length > 0) {
            // Filter for most relevant rules
            foundRules = categoryResults.data.filter(
              (r: any) =>
                r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (r.tags &&
                  r.tags.some((tag: any) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                  ))
            );

            if (foundRules.length === 0) {
              // If no specific match, just use the first rule from this category
              foundRules = categoryResults.data;
            }
          }
        } catch (err) {
          console.error("Error fetching category rules:", err);
        }
      }

      // If we didn't find anything by category, try a general search
      if (foundRules.length === 0) {
        try {
          const searchResults = await searchRules(searchQuery);
          if (searchResults && searchResults.data.length > 0) {
            foundRules = searchResults.data;
          }
        } catch (err) {
          console.error("Error searching rules:", err);
        }
      }

      // If we still don't have anything, try a more generic search
      if (foundRules.length === 0) {
        try {
          const genericResults = await searchRules("best practices");
          if (genericResults && genericResults.data.length > 0) {
            foundRules = genericResults.data;
          }
        } catch (err) {
          console.error("Error with generic search:", err);
        }
      }

      // As a last resort, try to find any rule
      if (foundRules.length === 0) {
        try {
          // Try to get any first rule from any category
          const anyResults = await getRulesByCategory("languages");
          if (anyResults && anyResults.data.length > 0) {
            foundRules = anyResults.data;
          }
        } catch (err) {
          console.error("Error fetching any rules:", err);
          // At this point, we have exhausted all options
          throw new Error("Could not find any rules to display");
        }
      }

      // Use the best match (first rule found)
      rule = foundRules[0];
      console.log(`Found rule: ${rule.title}`);

      // Format as MDC content
      return `---
title: ${rule.title}
description: ${rule.description}
version: ${rule.version}
compatibility:
  ides: [${
    rule.compatibility?.ides?.map((ide: string) => `"${ide}"`).join(", ") || ""
  }]
  aiAssistants: [${
    rule.compatibility?.aiAssistants
      ?.map((ai: string) => `"${ai}"`)
      .join(", ") || ""
  }]
  frameworks: [${
    rule.compatibility?.frameworks?.map((fw: string) => `"${fw}"`).join(", ") ||
    ""
  }]
---

${rule.content}`;
    } catch (error) {
      console.error("Error generating rule preview:", error);
      return "// Error fetching rule preview. Please try again or complete your configuration.";
    }
  };

  // Generate installation instructions based on the user's preferences
  const generateInstallationInstructions = () => {
    if (!config) return "";

    // Return appropriate instructions based on selection
    return config.installationMethod === "local"
      ? "Local installation instructions will be included in the download."
      : "Remote installation instructions will be included in the download.";
  };

  // Generate a virtual file structure for preview
  const generateFileStructure = (): FileItem[] => {
    if (!config) return [];

    // Root structure
    const structure: FileItem[] = [
      {
        name: ".ai",
        type: "folder",
        children: [
          {
            name: "rules",
            type: "folder",
            children: [],
          },
        ],
      },
    ];

    // Add main config file
    structure.push({
      name: "vibekit-vdk-rules.json",
      type: "file",
    });

    // Add README
    structure.push({
      name: "README.md",
      type: "file",
    });

    return structure;
  };

  const handleGeneratePackage = () => {
    setIsGenerating(true);

    // Simulate package generation
    setTimeout(() => {
      setIsGenerating(false);
      setActiveTab("download");
      toast.success("Package generated successfully");
    }, 2000);
  };

  const handleDownloadPackage = () => {
    setIsDownloading(true);

    try {
      // Get configuration in JSON format
      const configData = JSON.stringify(config, null, 2);

      // For now, we'll just create a text file with the configuration
      const blob = new Blob([configData], { type: "application/json" });

      // Create download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `vibekit-vdk-rules-config.json`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Configuration package downloaded");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download rules package");
    } finally {
      setIsDownloading(false);
    }
  };

  // Get file structure for preview
  const fileStructure = generateFileStructure();
  const installationInstructions = generateInstallationInstructions();
  const [rulePreview, setRulePreview] = useState<string>(
    "// Loading rule preview..."
  );

  // Load rule preview when config changes
  useEffect(() => {
    const loadPreview = async () => {
      const preview = await generateRulePreview();
      setRulePreview(preview);
    };

    loadPreview();
  }, [config]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Configuration Preview</h3>
        <p className="text-muted-foreground">
          Preview and download your configuration package
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rule Preview</CardTitle>
              <CardDescription>
                Sample rule content based on your configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] rounded-md border p-4">
                <pre className="whitespace-pre font-mono text-sm">
                  {rulePreview}
                </pre>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGeneratePackage}
                disabled={!config || isGenerating}
              >
                {isGenerating ? <>Generating Package</> : <>Generate Package</>}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          {fileStructure.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Package Structure</CardTitle>
                <CardDescription>
                  Files and folders included in your package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="pl-4">
                  {fileStructure.map((item, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex items-center">
                        {item.type === "folder" ? (
                          <>
                            <FolderIcon className="h-4 w-4 mr-2 text-primary" />
                            <span className="font-medium">{item.name}/</span>
                          </>
                        ) : (
                          <>
                            <FileIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{item.name}</span>
                          </>
                        )}
                      </div>
                      {item.children && item.children.length > 0 && (
                        <div className="pl-6 border-l border-border mt-2">
                          {/* Recursive rendering would go here */}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="mb-2 text-xl font-medium">
                No Configuration Found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete the configuration to preview files
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download Configuration</CardTitle>
              <CardDescription>
                Get your rules configuration package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 rounded-md border p-4">
                <h4 className="text-sm font-medium mb-2">
                  Configuration Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Name:</span>
                    <span>{config?.projectName || "Unnamed Project"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span>
                      {config?.primaryLanguage === "other"
                        ? config?.otherLanguage
                        : config?.primaryLanguage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IDE:</span>
                    <span>
                      {config?.ide === "other" ? config?.otherIde : config?.ide}
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Installation Instructions
                </h4>
                <p className="text-sm text-muted-foreground">
                  {installationInstructions}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleDownloadPackage}
                disabled={!config || isDownloading}
              >
                {isDownloading ? (
                  <>Downloading...</>
                ) : (
                  <>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download Package
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
