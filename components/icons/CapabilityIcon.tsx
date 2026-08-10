import {
  LuBlocks,
  LuBot,
  LuDatabase,
  LuFactory,
  LuFileText,
  LuGlobe,
  LuLayers,
  LuMessagesSquare,
  LuPlug,
  LuScanEye,
  LuSmartphone,
  LuWorkflow,
} from "react-icons/lu";
import type { IconType } from "react-icons";

/**
 * Maps a capability's `icon` key to a line icon. Kept in one place so the
 * content layer never imports from a component library.
 */
const ICONS: Record<string, IconType> = {
  chat: LuMessagesSquare,
  vision: LuScanEye,
  factory: LuFactory,
  automation: LuWorkflow,
  custom: LuBlocks,
  web: LuGlobe,
  mobile: LuSmartphone,
  saas: LuLayers,
  data: LuDatabase,
  llm: LuFileText,
  agent: LuBot,
  api: LuPlug,
};

export function CapabilityIcon({
  name,
  className,
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = ICONS[name] ?? LuBlocks;
  return (
    <Icon
      className={className}
      size={size}
      aria-hidden="true"
      strokeWidth={1.6}
    />
  );
}
