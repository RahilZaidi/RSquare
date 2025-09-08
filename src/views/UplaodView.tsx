import React, { useState, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Upload, X, Image, ArrowRight, AlertCircle } from "lucide-react";
import {
  useAssets,
  useNavigation,
  useProject,
} from "../contexts/DesignContext";
import { ImageService } from "../services/ImageService";
import { toast } from "sonner";

export const UploadView = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { assets, addAsset, removeAsset } = useAssets();
  const { navigateTo, goBack } = useNavigation();
  const { project } = useProject();

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const asset = await ImageService.processUpload(file);
        addAsset(asset);
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [addAsset]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          handleFileUpload(file);
        }
      });
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        Array.from(files).forEach(handleFileUpload);
      }
    },
    [handleFileUpload]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Upload Your Design</h1>
          <p className="text-muted-foreground mt-2">
            Add your artwork to get started with custom merchandise
          </p>
        </div>
        {project && (
          <Button variant="ghost" onClick={goBack}>
            Back to Projects
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* Upload Area */}
        <Card className="p-8">
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragOver
                ? "border-orange bg-orange/5 scale-[1.02]"
                : "border-muted-foreground/25 hover:border-orange/50 hover:bg-orange/5"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-orange/10 flex items-center justify-center">
                <Upload className="h-10 w-10 text-orange" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {isDragOver
                    ? "Drop your files here"
                    : "Upload Your Design Files"}
                </h3>
                <p className="text-muted-foreground">
                  Drag & drop your images here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: JPG, PNG, SVG • Max size: 10MB each
                </p>
              </div>

              <Button
                size="lg"
                className="relative overflow-hidden"
                disabled={isUploading}
              >
                <Image className="h-5 w-5 mr-2" />
                {isUploading ? "Uploading..." : "Choose Files"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
              </Button>
            </div>
          </div>
        </Card>

        {/* Uploaded Assets */}
        {assets.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                Uploaded Designs ({assets.length})
              </h2>
              <Button
                onClick={() => navigateTo("product-selection")}
                className="bg-orange hover:bg-orange-dark text-white"
              >
                Continue to Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="relative group">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-muted relative">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          removeAsset(asset.id);
                          toast.info("Design removed");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-medium truncate">{asset.name}</h3>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {asset.metadata.width}×{asset.metadata.height}px
                        </span>
                        <span>{formatFileSize(asset.metadata.size || 0)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Uploaded {asset.uploadedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Design Tips */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">
                Design Tips for Best Results
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-resolution images (300 DPI minimum)</li>
                <li>• PNG format with transparent background works best</li>
                <li>• Keep text readable at small sizes</li>
                <li>• Use RGB color mode for screen printing</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
