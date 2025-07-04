import {
  WarningIcon,
  BrainIcon,
  CheckIcon,
  CaretRightIcon,
  ClipboardTextIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  FolderIcon,
  GithubLogoIcon,
  GitBranchIcon,
  HeartIcon,
  CircleNotchIcon,
  SignInIcon,
  SignOutIcon,
  ArrowsOutIcon,
  ListIcon,
  MoonIcon,
  ArrowsClockwiseIcon,
  MagnifyingGlassIcon,
  GearIcon,
  SunIcon,
  TagIcon,
  ThumbsUpIcon,
  UserIcon,
  UserPlusIcon,
  // New icons for better category representation
  StackIcon,
  DatabaseIcon,
  PaintBrushIcon,
  LightningIcon,
  GlobeIcon,
  ShieldIcon,
  WrenchIcon,
  CpuIcon,
  CloudIcon,
  DeviceMobileIcon,
  MonitorIcon,
  PuzzlePieceIcon,
  BriefcaseIcon,
  BookIcon,
  TargetIcon,
  FileCodeIcon,
  PackageIcon,
  TerminalIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { IconProps } from "@phosphor-icons/react";

export type Icon = React.ComponentType<IconProps>;

export const Icons = {
  logo: (props: IconProps) => {
    const { className } = props;

    return (
      <Image
        src="/images/logo.png"
        alt="VibeKit VDK Hub"
        width={24}
        height={24}
        className={className}
      />
    );
  },
  sun: SunIcon,
  moon: MoonIcon,
  menu: ListIcon,
  code: CodeIcon,
  brain: BrainIcon,
  settings: GearIcon,
  tasks: ClipboardTextIcon,
  git: GitBranchIcon,
  github: GithubLogoIcon,
  download: DownloadIcon,
  tag: TagIcon,
  user: UserIcon,
  userPlus: UserPlusIcon,
  login: SignInIcon,
  logout: SignOutIcon,
  folder: FolderIcon,
  spinner: CircleNotchIcon, // Use CircleNotch for spinner animation
  chevronRight: CaretRightIcon,
  copy: CopyIcon,
  check: CheckIcon,
  loader: CircleNotchIcon,
  search: MagnifyingGlassIcon,
  alertTriangle: WarningIcon,
  thumbsUp: ThumbsUpIcon,
  refresh: ArrowsClockwiseIcon,
  maximize: ArrowsOutIcon,
  expand: ArrowsOutIcon, // Alias for maximize
  // Enhanced category icons
  languages: FileCodeIcon,
  technologies: StackIcon,
  frameworks: PackageIcon,
  databases: DatabaseIcon,
  design: PaintBrushIcon,
  performance: LightningIcon,
  web: GlobeIcon,
  security: ShieldIcon,
  tools: WrenchIcon,
  hardware: CpuIcon,
  cloud: CloudIcon,
  mobile: DeviceMobileIcon,
  desktop: MonitorIcon,
  puzzle: PuzzlePieceIcon,
  business: BriefcaseIcon,
  documentation: BookIcon,
  testing: TargetIcon,
  backend: DatabaseIcon,
  frontend: MonitorIcon,
  terminal: TerminalIcon,
  aitools: BrainIcon,
  stacks: StackIcon,
  heart: HeartIcon,
};
