import { HomePage } from "@/_components/home/HomePage";

export const metadata = {
  title: "Vcinema",
  description: "A private journal for the films you've watched, with ratings, lists, and stats.",
};

export default async function Page() {
  return <HomePage />;
}
