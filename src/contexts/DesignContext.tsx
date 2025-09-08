// contexts/DesignContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  AppState,
  AppView,
  DesignProject,
  ProductConfig,
  DesignAsset,
} from "../types";
import { StorageService } from "../services/StorageService.ts";

type DesignAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_VIEW"; payload: AppView }
  | { type: "CREATE_PROJECT"; payload: { name: string; description?: string } }
  | { type: "LOAD_PROJECT"; payload: DesignProject }
  | { type: "UPDATE_PROJECT"; payload: Partial<DesignProject> }
  | { type: "ADD_ASSET"; payload: DesignAsset }
  | { type: "REMOVE_ASSET"; payload: string }
  | { type: "SELECT_ASSET"; payload: string | null }
  | { type: "ADD_PRODUCT"; payload: ProductConfig }
  | {
      type: "UPDATE_PRODUCT";
      payload: { id: string; updates: Partial<ProductConfig> };
    }
  | { type: "REMOVE_PRODUCT"; payload: string }
  | { type: "SELECT_PRODUCT"; payload: string | null }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_PREVIEW_MODE"; payload: "2d" | "3d" }
  | { type: "RESET_PROJECT" };

const initialState: AppState = {
  currentProject: null,
  currentView: "welcome",
  selectedProductId: null,
  selectedAssetId: null,
  isLoading: false,
  error: null,
  ui: {
    sidebarOpen: true,
    previewMode: "2d",
    showGrid: false,
  },
};

const designReducer = (state: AppState, action: DesignAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_VIEW":
      return { ...state, currentView: action.payload };

    case "CREATE_PROJECT":
      const newProject: DesignProject = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        description: action.payload.description,
        assets: [],
        products: [],
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          quoteRequestCount: 0,
        },
      };
      return {
        ...state,
        currentProject: newProject,
        currentView: "upload",
        error: null,
      };

    case "LOAD_PROJECT":
      return {
        ...state,
        currentProject: action.payload,
        currentView:
          action.payload.assets.length > 0 ? "product-selection" : "upload",
      };

    case "UPDATE_PROJECT":
      if (!state.currentProject) return state;
      const updatedProject = {
        ...state.currentProject,
        ...action.payload,
        updatedAt: new Date(),
      };
      return {
        ...state,
        currentProject: updatedProject,
      };

    case "ADD_ASSET":
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          assets: [...state.currentProject.assets, action.payload],
          updatedAt: new Date(),
        },
        selectedAssetId: action.payload.id,
        currentView: "product-selection",
      };

    case "REMOVE_ASSET":
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          assets: state.currentProject.assets.filter(
            (asset) => asset.id !== action.payload
          ),
          updatedAt: new Date(),
        },
        selectedAssetId:
          state.selectedAssetId === action.payload
            ? null
            : state.selectedAssetId,
      };

    case "SELECT_ASSET":
      return {
        ...state,
        selectedAssetId: action.payload,
      };

    case "ADD_PRODUCT":
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          products: [...state.currentProject.products, action.payload],
          status: "configured",
          updatedAt: new Date(),
        },
        selectedProductId: action.payload.id,
      };

    case "UPDATE_PRODUCT":
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          products: state.currentProject.products.map((product) =>
            product.id === action.payload.id
              ? { ...product, ...action.payload.updates }
              : product
          ),
          updatedAt: new Date(),
        },
      };

    case "REMOVE_PRODUCT":
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          products: state.currentProject.products.filter(
            (product) => product.id !== action.payload
          ),
          updatedAt: new Date(),
        },
        selectedProductId:
          state.selectedProductId === action.payload
            ? null
            : state.selectedProductId,
      };

    case "SELECT_PRODUCT":
      return {
        ...state,
        selectedProductId: action.payload,
        currentView: action.payload
          ? "product-customization"
          : "product-selection",
      };

    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
      };

    case "SET_PREVIEW_MODE":
      return {
        ...state,
        ui: { ...state.ui, previewMode: action.payload },
      };

    case "RESET_PROJECT":
      return {
        ...initialState,
        ui: state.ui, // preserve UI settings
      };

    default:
      return state;
  }
};

interface DesignContextType {
  state: AppState;
  dispatch: React.Dispatch<DesignAction>;
}

const DesignContext = createContext<DesignContextType | null>(null);

export const DesignProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(designReducer, initialState);

  // Auto-save current project
  useEffect(() => {
    if (state.currentProject) {
      StorageService.saveProject(state.currentProject);
    }
  }, [state.currentProject]);

  // Load saved project on mount
  useEffect(() => {
    const savedProject = StorageService.getLastProject();
    if (savedProject) {
      dispatch({ type: "LOAD_PROJECT", payload: savedProject });
    }
  }, []);

  return (
    <DesignContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error("useDesign must be used within DesignProvider");
  }
  return context;
};

// Custom hooks for common operations
export const useProject = () => {
  const { state, dispatch } = useDesign();

  return {
    project: state.currentProject,
    isLoading: state.isLoading,
    error: state.error,

    createProject: (name: string, description?: string) => {
      dispatch({ type: "CREATE_PROJECT", payload: { name, description } });
    },

    updateProject: (updates: Partial<DesignProject>) => {
      dispatch({ type: "UPDATE_PROJECT", payload: updates });
    },

    resetProject: () => {
      dispatch({ type: "RESET_PROJECT" });
    },
  };
};

export const useAssets = () => {
  const { state, dispatch } = useDesign();

  return {
    assets: state.currentProject?.assets || [],
    selectedAsset:
      state.currentProject?.assets.find(
        (a) => a.id === state.selectedAssetId
      ) || null,

    addAsset: (asset: DesignAsset) => {
      dispatch({ type: "ADD_ASSET", payload: asset });
    },

    removeAsset: (assetId: string) => {
      dispatch({ type: "REMOVE_ASSET", payload: assetId });
    },

    selectAsset: (assetId: string | null) => {
      dispatch({ type: "SELECT_ASSET", payload: assetId });
    },
  };
};

export const useProducts = () => {
  const { state, dispatch } = useDesign();

  return {
    products: state.currentProject?.products || [],
    selectedProduct:
      state.currentProject?.products.find(
        (p) => p.id === state.selectedProductId
      ) || null,

    addProduct: (product: ProductConfig) => {
      dispatch({ type: "ADD_PRODUCT", payload: product });
    },

    updateProduct: (id: string, updates: Partial<ProductConfig>) => {
      dispatch({ type: "UPDATE_PRODUCT", payload: { id, updates } });
    },

    removeProduct: (productId: string) => {
      dispatch({ type: "REMOVE_PRODUCT", payload: productId });
    },

    selectProduct: (productId: string | null) => {
      dispatch({ type: "SELECT_PRODUCT", payload: productId });
    },
  };
};

export const useNavigation = () => {
  const { state, dispatch } = useDesign();

  return {
    currentView: state.currentView,

    navigateTo: (view: AppView) => {
      dispatch({ type: "SET_VIEW", payload: view });
    },

    goBack: () => {
      // Smart navigation based on current state
      if (state.currentView === "product-customization") {
        dispatch({ type: "SET_VIEW", payload: "product-selection" });
      } else if (state.currentView === "product-selection") {
        dispatch({ type: "SET_VIEW", payload: "upload" });
      } else if (state.currentView === "upload") {
        dispatch({ type: "SET_VIEW", payload: "welcome" });
      }
    },
  };
};
