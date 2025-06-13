import {
  CodeIcon,
  HashIcon,
  ListIcon,
  ListNumbersIcon,
  CheckSquareIcon,
  QuotesIcon,
  TextTIcon,
} from "@phosphor-icons/react"

export const blockTypeToBlockName: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  paragraph: {
    label: 'Paragraph',
    icon: <TextTIcon className="size-4" />,
  },
  h1: {
    label: 'Heading 1',
    icon: <HashIcon className="size-4" />,
  },
  h2: {
    label: 'Heading 2',
    icon: <HashIcon className="size-4" />,
  },
  h3: {
    label: 'Heading 3',
    icon: <HashIcon className="size-4" />,
  },
  h4: {
    label: 'Heading 4',
    icon: <TextTIcon className="size-4" />,
  },
  h5: {
    label: 'Heading 5',
    icon: <TextTIcon className="size-4" />,
  },
  h6: {
    label: 'Heading 6',
    icon: <TextTIcon className="size-4" />,
  },
  code: {
    label: 'Code Block',
    icon: <CodeIcon className="size-4" />,
  },
  ul: {
    label: 'Bulleted List',
    icon: <ListIcon className="size-4" />,
  },
  ol: {
    label: 'Numbered List',
    icon: <ListNumbersIcon className="size-4" />,
  },
  check: {
    label: 'Check List',
    icon: <CheckSquareIcon className="size-4" />,
  },
  quote: {
    label: 'Quote',
    icon: <QuotesIcon className="size-4" />,
  },
}
