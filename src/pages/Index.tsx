import { useState } from "react";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { ProductPreview } from "@/components/ProductPreview";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-orange to-orange-dark bg-clip-text text-transparent">
                Custom Merch Made Simple
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Upload your design and see it come to life on premium products. 
                Get instant previews and personalized quotes in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Start with Your Design
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload any image and watch it transform into professional merchandise
              </p>
            </div>
            
            <ImageUpload 
              onImageUpload={setUploadedImage} 
              uploadedImage={uploadedImage}
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Preview Your Products
              </h2>
              <p className="text-lg text-muted-foreground">
                See how your design looks on our premium products
              </p>
            </div>
            
            <ProductPreview uploadedImage={uploadedImage} />
            
            {uploadedImage && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  ✨ This is just a preview! Final products may vary in placement and sizing.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="quote" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <WhatsAppCTA hasUploadedImage={!!uploadedImage} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose PrintCraft?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-orange rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-semibold">Premium Quality</h3>
                  <p className="text-primary-foreground/80">
                    High-quality printing on premium materials that last
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-orange rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold">Fast Turnaround</h3>
                  <p className="text-primary-foreground/80">
                    Quick production and shipping for urgent orders
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-orange rounded-full flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-xl font-semibold">Personal Support</h3>
                  <p className="text-primary-foreground/80">
                    Direct WhatsApp support for all your questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 PrintCraft. Made with ❤️ for creators everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;