import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ponto" },
      {
        name: "description",
        content: "Uma página minimalista com um único ponto azul centralizado.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ponto" },
      {
        property: "og:description",
        content: "Uma página minimalista com um único ponto azul centralizado.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <span className="block h-3 w-3 rounded-full bg-blue-600" />
    </div>
  );
}
