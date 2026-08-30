import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ponto Azul | Página Minimalista" },
      {
        name: "description",
        content: "Página minimalista e responsiva com um único ponto azul centralizado em fundo limpo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ponto Azul | Página Minimalista" },
      {
        property: "og:description",
        content: "Um único ponto azul centralizado em uma tela limpa e responsiva.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BlueDotPage,
});

function BlueDotPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white">
      <h1 className="sr-only">Ponto azul centralizado</h1>
      <div className="h-3 w-3 rounded-full bg-blue-600" aria-hidden="true" />
    </main>
  );
}
