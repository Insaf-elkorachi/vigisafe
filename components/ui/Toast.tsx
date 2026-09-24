"use client";

export function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" }) {
  if (!message) return null;
  return (
    <div role="status" className={`fixed bottom-5 right-5 z-50 rounded-md px-4 py-3 text-sm font-semibold text-white shadow-soft ${type === "success" ? "bg-success" : "bg-danger"}`}>
      {message}
    </div>
  );
}
