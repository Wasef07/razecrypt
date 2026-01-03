"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddCard from "@/components/vault/AddCard";
import AddPassword from "@/components/vault/AddPassword";
import CardItem from "@/components/vault/CardItem";
import PasswordItem from "@/components/vault/PasswordItem";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export default function Home() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";
  const isLoaded = status !== "loading";

  const [cards, setCards] = useState<any[]>([]);
  const [passwords, setPasswords] = useState<any[]>([]);
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [editingPassword, setEditingPassword] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVault = async () => {
    setLoading(true);

    const [cardsRes, passwordsRes] = await Promise.all([
      fetch("/api/cards"),
      fetch("/api/passwords"),
    ]);

    setCards(cardsRes.ok ? await cardsRes.json() : []);
    setPasswords(passwordsRes.ok ? await passwordsRes.json() : []);

    setLoading(false);
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setCards([]);
      setPasswords([]);
      setLoading(false);
      return;
    }

    fetchVault();
  }, [isSignedIn, isLoaded]);


  const deletePassword = async (id: string) => {
    await fetch(`/api/passwords?id=${id}`, { method: "DELETE" });
    setPasswords((p) => p.filter((x) => x._id !== id));
    toast.success("Password deleted");
  };

  const deleteCard = async (id: string) => {
    await fetch(`/api/cards?id=${id}`, { method: "DELETE" });
    setCards((c) => c.filter((x) => x._id !== id));
    toast.success("Card deleted");
  };

  return (
    <main className="min-h-screen p-8">

      <h1 className="text-3xl font-bold mb-2">RazeCrypt</h1>
      <p className="text-muted-foreground mb-8">
        Securely store and manage your passwords and cards
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <AddCard
          initialData={editingCard}
          onCancel={() => setEditingCard(null)}
          onSaved={() => {
            setEditingCard(null);
            fetchVault();
          }}
        />

        <AddPassword
          initialData={editingPassword}
          onCancel={() => setEditingPassword(null)}
          onSaved={() => {
            setEditingPassword(null);
            fetchVault();
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-bold mb-4 text-center">Your Cards</h2>

          {!isSignedIn ? (
            <LockedState message="Please log in to see your saved cards" />
          ) : loading ? (
            <LoadingState />
          ) : cards.length === 0 ? (
            <EmptyState message="No cards saved yet" />
          ) : (
            <div className="flex flex-col gap-4">
              {cards.map((card) => (
                <CardItem
                  key={card._id}
                  card={card}
                  onEdit={setEditingCard}
                  onDelete={deleteCard}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-bold mb-4 text-center">Your Passwords</h2>

          {!isSignedIn ? (
            <LockedState message="Please log in to see your saved passwords" />
          ) : loading ? (
            <LoadingState />
          ) : passwords.length === 0 ? (
            <EmptyState message="No passwords saved yet" />
          ) : (
            <div className="flex flex-col gap-4">
              {passwords.map((password) => (
                <PasswordItem
                  key={password._id}
                  password={password}
                  onEdit={setEditingPassword}
                  onDelete={deletePassword}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


function LockedState({ message }: { message: string }) {
  return (
    <div className="bg-muted border border-dashed rounded-xl p-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
      <Lock className="h-5 w-5" />
      <p>{message}</p>
    </div>
  );
}

function LoadingState() {
  return <p className="text-center text-muted-foreground">Loading...</p>;
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-center text-muted-foreground">{message}</p>;
}
