import React from "react";
import { DesignProvider } from "./contexts/DesignContext";
import { Header } from "./components/Header.tsx";
import { AppRouter } from "./components/AppRouter.tsx";
import { Toaster } from "sonner";

function App() {
  return (
    <DesignProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <AppRouter />
        </main>
        <Toaster position="top-right" />
      </div>
    </DesignProvider>
  );
}

export default App;
