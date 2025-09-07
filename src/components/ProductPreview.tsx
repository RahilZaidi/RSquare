import { Card } from "@/components/ui/card";
import tshirtMockup from "@/assets/tshirt-mockup.jpg";
import mugMockup from "@/assets/mug-mockup.jpg";
import posterMockup from "@/assets/poster-mockup.jpg";

interface ProductPreviewProps {
  uploadedImage: string | null;
}

const products = [
  {
    id: "tshirt",
    name: "T-Shirt",
    mockup: tshirtMockup,
    overlayStyle: {
      top: "35%",
      left: "50%",
      width: "30%",
      height: "25%",
      transform: "translateX(-50%)"
    }
  },
  {
    id: "mug",
    name: "Coffee Mug",
    mockup: mugMockup,
    overlayStyle: {
      top: "30%",
      left: "50%",
      width: "25%",
      height: "30%",
      transform: "translateX(-50%)"
    }
  },
  {
    id: "poster",
    name: "Poster",
    mockup: posterMockup,
    overlayStyle: {
      top: "20%",
      left: "50%",
      width: "45%",
      height: "55%",
      transform: "translateX(-50%)"
    }
  }
];

export const ProductPreview = ({ uploadedImage }: ProductPreviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative aspect-square">
            <img
              src={product.mockup}
              alt={`${product.name} mockup`}
              className="w-full h-full object-cover"
            />
            {uploadedImage && (
              <div 
                className="absolute opacity-90"
                style={product.overlayStyle}
              >
                <img
                  src={uploadedImage}
                  alt="Custom design"
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            )}
            {!uploadedImage && (
              <div 
                className="absolute bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-sm flex items-center justify-center"
                style={product.overlayStyle}
              >
                <span className="text-xs text-muted-foreground text-center">
                  Your Design
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-center">{product.name}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
};