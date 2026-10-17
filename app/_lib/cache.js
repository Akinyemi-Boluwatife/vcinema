import { revalidatePath, updateTag } from "next/cache";

export const PUBLIC_TAG = "public-data";
export const PUBLIC_TTL = 300;

export function refreshData() {
  updateTag(PUBLIC_TAG);
  revalidatePath("/", "layout");
}
