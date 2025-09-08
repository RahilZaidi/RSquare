import React from "react";
import { useDesign } from "../contexts/DesignContext";
import { WelcomeView } from "../views/WelcomeView";
import { UploadView } from "../views/UplaodView.tsx";
import { ProductSelectionView } from "../views/ProductSelectionView";
import { ProductCustomizationView } from "../views/ProductCustomizationView";
import { ReviewQuoteView } from "../views/ReviewQuoteView";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";

export const AppRouter = () => {
  const { state } = useDesign();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage
          title="Something went wrong"
          message={state.error}
          showRetry
        />
      </div>
    );
  }

  switch (state.currentView) {
    case "welcome":
      return <WelcomeView />;

    case "upload":
      return <UploadView />;

    case "product-selection":
      return <ProductSelectionView />;

    case "product-customization":
      return <ProductCustomizationView />;

    case "review-quote":
      return <ReviewQuoteView />;

    default:
      return <WelcomeView />;
  }
};
