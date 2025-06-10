import { Metadata } from "next"

export const metadata: Metadata = {
  title: "License | CodePilot Rules Hub",
  description: "MIT License for CodePilot Rules Hub - open source licensing information.",
}

export default function LicensePage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1>MIT License</h1>
        <p className="text-lg text-muted-foreground">
          CodePilot Rules Hub is released under the MIT License
        </p>

        <div className="bg-muted/50 p-6 rounded-lg font-mono text-sm leading-relaxed">
          <p>
            Copyright (c) {new Date().getFullYear()} Dominikos Pritis
          </p>
          <br />
          <p>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
          <br />
          <p>
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
          </p>
          <br />
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
        </div>

        <h2>About Open Source</h2>
        <p>
          CodePilot Rules Hub is built on the foundation of open source software and contributes back to the community. The MIT License is a permissive free software license that allows you to:
        </p>
        <ul>
          <li>Use the software for any purpose</li>
          <li>Modify the software to suit your needs</li>
          <li>Distribute copies of the software</li>
          <li>Distribute modified versions of the software</li>
          <li>Use the software in proprietary applications</li>
        </ul>

        <h2>Third-Party Licenses</h2>
        <p>
          This project makes use of various open source libraries and frameworks, each with their own licenses:
        </p>
        <ul>
          <li><strong>Next.js</strong> - MIT License</li>
          <li><strong>React</strong> - MIT License</li>
          <li><strong>Tailwind CSS</strong> - MIT License</li>
          <li><strong>Radix UI</strong> - MIT License</li>
          <li><strong>Supabase</strong> - Apache 2.0 License</li>
          <li><strong>Framer Motion</strong> - MIT License</li>
          <li><strong>Lucide Icons</strong> - ISC License</li>
        </ul>

        <h2>Contributing</h2>
        <p>
          By contributing to CodePilot Rules Hub, you agree that your contributions will be licensed under the same MIT License that covers the project.
        </p>

        <h2>Acknowledgments</h2>
        <p>
          Special thanks to Seth Rose for the original DevRules project that inspired CodePilot Rules Hub, and to the entire open source community for the tools and libraries that make this project possible.
        </p>
      </div>
    </div>
  )
} 