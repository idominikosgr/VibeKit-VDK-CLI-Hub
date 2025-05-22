import {
  AlertTriangle,
  Brain,
  Check,
  ChevronRight,
  ClipboardList,
  Code,
  Copy,
  Download,
  FolderClosed,
  Github,
  GitBranch,
  Loader2,
  LogIn,
  LogOut,
  LucideProps,
  Maximize2,
  Menu,
  Moon,
  RefreshCw,
  Search,
  Settings,
  SunMedium,
  Tag,
  ThumbsUp,
  User,
  UserPlus,
  type Icon as LucideIcon
} from "lucide-react"

export type Icon = typeof LucideIcon

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  sun: SunMedium,
  moon: Moon,
  menu: Menu,
  code: Code,
  brain: Brain,
  settings: Settings,
  tasks: ClipboardList,
  git: GitBranch,
  github: Github,
  download: Download,
  tag: Tag,
  user: User,
  userPlus: UserPlus,
  login: LogIn,
  logout: LogOut,
  folder: FolderClosed,
  spinner: Loader2, // Use Loader2 for spinner animation
  chevronRight: ChevronRight,
  copy: Copy,
  check: Check,
  loader: Loader2,
  search: Search,
  alertTriangle: AlertTriangle,
  thumbsUp: ThumbsUp,
  refresh: RefreshCw,
  maximize: Maximize2,
  expand: Maximize2 // Alias for maximize
}
