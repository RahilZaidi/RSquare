import React from "react";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigation } from "../contexts/DesignContext";

export const ProductCustomizationView = () => {
  const { goBack } = useNavigation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Customize Product</h1>
      </div>

      <div className="text-center py-20">
        <p className="text-muted-foreground">
          Product customization coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include color picker, size selector, design positioning,
          etc.
        </p>
      </div>
    </div>
  );
};
