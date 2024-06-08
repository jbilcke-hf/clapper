import { SpaceEntry} from "@huggingface/hub"
import { ApiSpaceInfo } from "@huggingface/hub/dist/src/types/api/api-space"

export type GradioSpace =
  SpaceEntry & Pick<ApiSpaceInfo, "cardData" | "runtime" | "tags" | "models">