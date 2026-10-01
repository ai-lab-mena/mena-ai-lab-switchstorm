import { redirect } from "next/navigation";

export default function UploadRedirectPage() {
  redirect("/switchstorm?tab=upload");
}
