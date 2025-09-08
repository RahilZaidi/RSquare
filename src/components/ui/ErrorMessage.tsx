import React from "react";
import { Button } from "./button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage = ({
  title = "Something went wrong",
  message,
  showRetry = false,
  onRetry,
  className = "",
}: ErrorMessageProps) => {
  return (
    <div className={`text-center space-y-4 p-6 ${className}`}>
      <div className="flex justify-center">
        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
      </div>

      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};
