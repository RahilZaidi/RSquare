import React from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useProducts, useNavigation } from "../contexts/DesignContext";
import { ProductService } from "../services/ProductService";

export const ReviewQuoteView = () => {
  const { products } = useProducts();
  const { goBack } = useNavigation();

  const total = products.reduce((sum, product) => {
    return (
      sum +
      ProductService.calculateProductPrice(
        product.templateId,
        product.color,
        product.size,
        product.quantity
      )
    );
  }, 0);

  const handleRequestQuote = () => {
    // This will be implemented with WhatsApp integration
    const message = `Hello! I'd like a quote for ${
      products.length
    } custom products. Total estimate: $${total.toFixed(2)}`;
    const phoneNumber = "+1234567890";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold">Review Your Order</h1>
      </div>

      {products.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No products in your cart yet.</p>
          <Button onClick={goBack} className="mt-4">
            Add Products
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Products List */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {products.map((product) => {
                const template = ProductService.getProduct(product.templateId);
                const price = ProductService.calculateProductPrice(
                  product.templateId,
                  product.color,
                  product.size,
                  product.quantity
                );

                return (
                  <div
                    key={product.id}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div>
                      <h3 className="font-medium">{template?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.color} • {product.size} • Qty:{" "}
                        {product.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${price.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Estimate:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Final pricing will be confirmed in your quote
              </p>
            </div>
          </Card>

          {/* Quote Request */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Request Quote</h2>
            <p className="text-muted-foreground mb-4">
              Click below to send your order details via WhatsApp and receive a
              detailed quote.
            </p>
            <Button
              onClick={handleRequestQuote}
              size="lg"
              className="w-full bg-orange hover:bg-orange-dark text-white"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Request Quote via WhatsApp
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
