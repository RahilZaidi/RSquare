import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WhatsAppCTAProps {
  hasUploadedImage: boolean;
}

export const WhatsAppCTA = ({ hasUploadedImage }: WhatsAppCTAProps) => {
  const handleQuoteRequest = () => {
    const phoneNumber = "+1234567890";
    const message = encodeURIComponent("Hello! I'd like a quotation for my custom merch with my uploaded design.");
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
    
    if (hasUploadedImage) {
      window.open(whatsappUrl, '_blank');
      toast.success("Opening WhatsApp...");
    } else {
      toast.error("Please upload your design first!");
    }
  };

  return (
    <div className="text-center space-y-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-orange" />
          <h2 className="text-3xl font-bold">Ready to Order?</h2>
          <Sparkles className="h-6 w-6 text-orange" />
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Love your design preview? Get a personalized quote in seconds!
        </p>
        <Button
          onClick={handleQuoteRequest}
          size="lg"
          className={`text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
            hasUploadedImage 
              ? "bg-orange hover:bg-orange-dark text-white" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
          disabled={!hasUploadedImage}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Request Quotation via WhatsApp
        </Button>
        {!hasUploadedImage && (
          <p className="text-sm text-muted-foreground mt-2">
            Upload your design to continue
          </p>
        )}
      </div>
    </div>
  );
};