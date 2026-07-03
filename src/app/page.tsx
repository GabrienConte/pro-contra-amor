"use client";

import { useEffect, useState } from "react";

type Card = {
  id: string;
  title: string;
  description: string;
  type: "PRO" | "CON";
};

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"PRO" | "CON">("PRO");
  const [loading, setLoading] = useState(true);

  async function loadCards() {
    const res = await fetch("/api/cards");
    const data = await res.json();
    setCards(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCards();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) return;

    await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, type }),
    });

    setTitle("");
    setDescription("");
    loadCards();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    loadCards();
  }

  const pros = cards.filter((c) => c.type === "PRO");
  const cons = cards.filter((c) => c.type === "CON");

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Prós e Contras
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 mb-10 border rounded-lg p-4"
      >
        <input
          className="border rounded p-2"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border rounded p-2"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={type}
          onChange={(e) => setType(e.target.value as "PRO" | "CON")}
        >
          <option value="PRO">Prós</option>
          <option value="CON">Contra</option>
        </select>
        <button
          type="submit"
          className="bg-black text-white rounded p-2 hover:opacity-80"
        >
          Adicionar
        </button>
      </form>

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-green-700 mb-3">
              Prós
            </h2>
            <div className="flex flex-col gap-3">
              {pros.map((card) => (
                <div
                  key={card.id}
                  className="border border-green-300 bg-green-50 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{card.title}</h3>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      remover
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-red-700 mb-3">
              Contras
            </h2>
            <div className="flex flex-col gap-3">
              {cons.map((card) => (
                <div
                  key={card.id}
                  className="border border-red-300 bg-red-50 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{card.title}</h3>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      remover
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}