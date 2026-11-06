import { useEffect, useState } from "react";
import { db } from "./db";
import "./App.css";

type Categoria = { id: number; nome: string; tipo: "receita" | "despesa"; cor: string };

export default function App() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    db.then((d) => d.select<Categoria[]>("SELECT * FROM categorias ORDER BY tipo, nome"))
      .then(setCategorias)
      .catch((e) => setErro(String(e)));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-teal-700">Minhas Finanças</h1>
      {erro ? (
        <p className="mt-2 text-red-700">Erro no banco: {erro}</p>
      ) : (
        <p className="mt-2 text-gray-600">Banco conectado ✔ — {categorias.length} categorias</p>
      )}
      <ul className="mt-6 flex flex-wrap gap-2">
        {categorias.map((c) => (
          <li key={c.id} className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ background: c.cor }} />
            {c.nome} <span className="text-gray-500">({c.tipo})</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
