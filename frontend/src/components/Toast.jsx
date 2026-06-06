import { Toaster } from "react-hot-toast"

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2800,
        style: {
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          color: "#0f172a",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
        },
      }}
    />
  )
}
