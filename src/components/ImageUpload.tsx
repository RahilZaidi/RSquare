import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage: string | null;
}

export const ImageUpload = ({ onImageUpload, uploadedImage }: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onImageUpload(imageUrl);
      toast.success("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleRemoveImage = () => {
    onImageUpload("");
    toast.info("Image removed");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!uploadedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragOver 
              ? "border-orange bg-orange/5 scale-105" 
              : "border-muted-foreground/25 hover:border-orange/50 hover:bg-orange/5"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-orange/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-orange" />
            </div>
            <div>
              <p className="text-lg font-medium mb-2">Upload Your Design</p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop your image here, or click to browse
              </p>
            </div>
            <Button variant="secondary" className="relative overflow-hidden">
              <ImageIcon className="h-4 w-4 mr-2" />
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl border bg-card p-4">
          <div className="flex items-start gap-4">
            <img
              src={uploadedImage}
              alt="Uploaded design"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium">Design Uploaded</p>
              <p className="text-sm text-muted-foreground">
                Ready to preview on products
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};