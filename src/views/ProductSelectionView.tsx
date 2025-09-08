import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Plus, ShoppingCart } from "lucide-react";
import {
  useAssets,
  useProducts,
  useNavigation,
} from "../contexts/DesignContext";
import { ProductService } from "../services/ProductService";
import { ProductConfig } from "../types";
import { toast } from "sonner";

export const ProductSelectionView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { assets, selectedAsset } = useAssets();
  const { products, addProduct } = useProducts();
  const { goBack, navigateTo } = useNavigation();

  const allProducts = ProductService.getAllProducts();
  const categories = ProductService.getCategories();

  const filteredProducts = selectedCategory
    ? ProductService.getProductsByCategory(selectedCategory)
    : allProducts;

  const handleAddProduct = (templateId: string) => {
    if (!selectedAsset) {
      toast.error("Please select a design first");
      return;
    }

    const template = ProductService.getProduct(templateId);
    if (!template) return;

    const newProduct: ProductConfig = {
      id: crypto.randomUUID(),
      templateId: template.id,
      name: template.name,
      quantity: 1,
      color: template.colors[0].value,
      size: template.sizes[0].value,
      designPosition: template.defaultPosition,
    };

    addProduct(newProduct);
    toast.success(`${template.name} added to your project!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Create simple SVG mockups for each product type
  const getMockupSVG = (productId: string, color: string = "white") => {
    const colorHex =
      {
        white: "#FFFFFF",
        black: "#000000",
        navy: "#1e3a8a",
        red: "#dc2626",
        green: "#16a34a",
        blue: "#2563eb",
        "heather-gray": "#9ca3af",
        "royal-blue": "#2563eb",
        natural: "#fef3c7",
      }[color] || "#FFFFFF";

    switch (productId) {
      case "classic-tshirt":
        return (
          <div className="relative w-full h-full">
            {/* Real T-shirt image (transparent background PNG) */}
            <img
              src="src/assets/WhiteTshirt.png" // place in your public/assets folder
              alt="T-shirt mockup"
              className="w-full h-full object-contain"
            />

            {/* Overlay design */}
            {selectedAsset && (
              <div
                className="absolute"
                style={{
                  top: "30%", // adjust to position design
                  left: "50%",
                  width: "40%",
                  transform: "translateX(-50%)",
                }}
              >
                <img
                  src={selectedAsset.url}
                  alt="Design overlay"
                  className="w-full object-contain opacity-80 mix-blend-multiply"
                />
              </div>
            )}
          </div>
        );

      case "ceramic-mug":
        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Mug body */}
            <ellipse cx="150" cy="220" rx="60" ry="15" fill="#ddd" />
            <rect
              x="90"
              y="120"
              width="120"
              height="100"
              fill={colorHex}
              stroke="#ddd"
              strokeWidth="2"
              rx="8"
            />
            <ellipse
              cx="150"
              cy="120"
              rx="60"
              ry="15"
              fill={colorHex}
              stroke="#ddd"
              strokeWidth="2"
            />
            {/* Handle */}
            <path
              d="M210 140 Q240 140 240 180 Q240 200 210 200"
              fill="none"
              stroke="#ddd"
              strokeWidth="8"
            />
            {/* Design area */}
            <rect
              x="110"
              y="140"
              width="80"
              height="60"
              fill="rgba(0,0,0,0.05)"
              stroke="rgba(0,0,0,0.1)"
              strokeDasharray="3,3"
              rx="4"
            />
          </svg>
        );

      case "canvas-poster":
        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Frame */}
            <rect x="40" y="60" width="220" height="180" fill="#8B4513" />
            {/* Canvas */}
            <rect
              x="50"
              y="70"
              width="200"
              height="160"
              fill={colorHex}
              stroke="#ddd"
              strokeWidth="1"
            />
            {/* Design area */}
            <rect
              x="60"
              y="80"
              width="180"
              height="140"
              fill="rgba(0,0,0,0.05)"
              stroke="rgba(0,0,0,0.1)"
              strokeDasharray="4,4"
              rx="4"
            />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <rect
              x="50"
              y="50"
              width="200"
              height="200"
              fill={colorHex}
              stroke="#ddd"
              strokeWidth="2"
              rx="8"
            />
            <text x="150" y="160" textAnchor="middle" fill="#666" fontSize="16">
              Product Mockup
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Choose Products</h1>
            <p className="text-muted-foreground">
              Select products to customize with your design
            </p>
          </div>
        </div>

        {products.length > 0 && (
          <Button
            onClick={() => navigateTo("review-quote")}
            className="bg-orange hover:bg-orange-dark text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Review Cart ({products.length})
          </Button>
        )}
      </div>

      {/* Design Preview */}
      {selectedAsset && (
        <Card className="p-4 mb-8 bg-orange/5 border-orange/20">
          <div className="flex items-center gap-4">
            <img
              src={selectedAsset.url}
              alt="Selected design"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-medium">Selected Design</h3>
              <p className="text-sm text-muted-foreground">
                {selectedAsset.name}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          size="sm"
        >
          All Products
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            size="sm"
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isAdded = products.some((p) => p.templateId === product.id);

          return (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-50 relative">
                {/* Product SVG mockup */}
                <div className="w-full h-full">
                  {getMockupSVG(product.id, product.colors[0].value)}
                </div>

                {/* Design overlay preview */}
                {selectedAsset && (
                  <div
                    className="absolute opacity-80"
                    style={{
                      top: `${product.designArea.top}%`,
                      left: `${product.designArea.left}%`,
                      width: `${product.designArea.width}%`,
                      height: `${product.designArea.height}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <img
                      src={selectedAsset.url}
                      alt="Design preview"
                      className="w-full h-full object-contain rounded-sm"
                    />
                  </div>
                )}

                {isAdded && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white">Added</Badge>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">
                      {formatPrice(product.basePrice)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.colors.length} colors • {product.sizes.length}{" "}
                      sizes
                    </p>
                  </div>

                  <Button
                    onClick={() => handleAddProduct(product.id)}
                    disabled={isAdded}
                    size="sm"
                    className={isAdded ? "bg-green-500 text-white" : ""}
                  >
                    {isAdded ? (
                      "Added"
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};
