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
  Heart,
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
  type Icon as LucideIcon,
  // New icons for better category representation
  Layers,
  Database,
  Palette,
  Zap,
  Globe,
  Shield,
  Wrench,
  Cpu,
  Cloud,
  Smartphone,
  Monitor,
  Puzzle,
  Briefcase,
  BookOpen,
  Target,
  FileCode,
  Package,
  Server,
  Terminal
} from "lucide-react"
import Image from "next/image"

export type Icon = typeof LucideIcon

export const Icons = {
  logo: (props: LucideProps) => {
    const { className } = props;
    
    return (
      <Image
        src="/images/logo.png"
        alt="Vibe Coding Rules Hub"
        width={24}
        height={24}
        className={className}
      />
    );
  },
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
  expand: Maximize2, // Alias for maximize
  // Enhanced category icons
  languages: FileCode,
  technologies: Layers,
  frameworks: Package,
  databases: Database,
  design: Palette,
  performance: Zap,
  web: Globe,
  security: Shield,
  tools: Wrench,
  hardware: Cpu,
  cloud: Cloud,
  mobile: Smartphone,
  desktop: Monitor,
  puzzle: Puzzle,
  business: Briefcase,
  documentation: BookOpen,
  testing: Target,
  backend: Server,
  frontend: Monitor,
  terminal: Terminal,
  aitools: Brain,
  stacks: Layers,
  heart: Heart
}
