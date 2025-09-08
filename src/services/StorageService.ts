// services/StorageService.ts
import { DesignProject } from '../types';

export class StorageService {
  private static readonly PROJECT_KEY = 'design_project';
  private static readonly PROJECTS_KEY = 'design_projects';

  static saveProject(project: DesignProject): void {
    try {
      localStorage.setItem(this.PROJECT_KEY, JSON.stringify(project));
      this.addToProjectsList(project);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  }

  static getLastProject(): DesignProject | null {
    try {
      const stored = localStorage.getItem(this.PROJECT_KEY);
      if (!stored) return null;
      
      const project = JSON.parse(stored);
      // Convert date strings back to Date objects
      project.createdAt = new Date(project.createdAt);
      project.updatedAt = new Date(project.updatedAt);
      
      return project;
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  }

  static getAllProjects(): DesignProject[] {
    try {
      const stored = localStorage.getItem(this.PROJECTS_KEY);
      if (!stored) return [];
      
      return JSON.parse(stored).map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      }));
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }

  private static addToProjectsList(project: DesignProject): void {
    const projects = this.getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project); // Add to beginning
    }
    
    // Keep only last 10 projects
    const trimmed = projects.slice(0, 10);
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(trimmed));
  }

  static clearProjects(): void {
    localStorage.removeItem(this.PROJECT_KEY);
    localStorage.removeItem(this.PROJECTS_KEY);
  }
}