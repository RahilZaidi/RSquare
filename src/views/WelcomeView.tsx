import React from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Upload, Palette, Download, Clock } from "lucide-react";
import { useProject, useNavigation } from "../contexts/DesignContext";
import { StorageService } from "../services/StorageService";

export const WelcomeView = () => {
  const { createProject } = useProject();
  const { navigateTo } = useNavigation();
  const recentProjects = StorageService.getAllProjects().slice(0, 3);

  const handleStartNew = () => {
    const projectName = `Design Project ${new Date().toLocaleDateString()}`;
    createProject(projectName);
  };

  const features = [
    {
      icon: Upload,
      title: "Upload Your Design",
      description: "Drag & drop your artwork or browse to upload",
    },
    {
      icon: Palette,
      title: "Customize Products",
      description: "Choose colors, sizes, and position your design",
    },
    {
      icon: Download,
      title: "Get Instant Quote",
      description: "Receive pricing via WhatsApp in minutes",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/5 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Custom Merchandise
              <span className="text-orange block">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your design, customize products, and get instant quotes.
              Professional quality printing with fast turnaround times.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange hover:bg-orange-dark text-white px-8 py-6 text-lg"
              onClick={handleStartNew}
            >
              <Upload className="h-5 w-5 mr-2" />
              Start New Project
            </Button>

            {recentProjects.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg"
                onClick={() => navigateTo("upload")}
              >
                <Clock className="h-5 w-5 mr-2" />
                Continue Recent
              </Button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-orange" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Recent Projects</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <Card
                  key={project.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{project.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {project.updatedAt.toLocaleDateString()}
                      </span>
                    </div>

                    {project.assets.length > 0 && (
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={project.assets[0].url}
                          alt="Project preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{project.products.length} products</span>
                      <span className="capitalize">{project.status}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // Load project and navigate
                        window.location.reload(); // Simple approach for now
                      }}
                    >
                      Continue Project
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
