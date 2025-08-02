"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  SecurityScore, 
  ThreatAlert, 
  ShodanDevice, 
  SecurityScoreAPI, 
  VirusTotalAPI, 
  ShodanAPI 
} from '@/lib/api';

// State types
interface DashboardState {
  securityScore: SecurityScore | null;
  threats: ThreatAlert[];
  iotDevices: ShodanDevice[];
  threatMap: Array<{ country: string; attacks: number; latitude?: number; longitude?: number }>;
  loading: {
    securityScore: boolean;
    threats: boolean;
    iotDevices: boolean;
    threatMap: boolean;
  };
  errors: {
    securityScore: string | null;
    threats: string | null;
    iotDevices: string | null;
    threatMap: string | null;
  };
  lastUpdated: {
    securityScore: Date | null;
    threats: Date | null;
    iotDevices: Date | null;
    threatMap: Date | null;
  };
}

// Action types
type DashboardAction =
  | { type: 'SET_LOADING'; payload: { key: keyof DashboardState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof DashboardState['errors']; value: string | null } }
  | { type: 'SET_SECURITY_SCORE'; payload: SecurityScore }
  | { type: 'SET_THREATS'; payload: ThreatAlert[] }
  | { type: 'SET_IOT_DEVICES'; payload: ShodanDevice[] }
  | { type: 'SET_THREAT_MAP'; payload: Array<{ country: string; attacks: number; latitude?: number; longitude?: number }> }
  | { type: 'REFRESH_ALL' };

// Initial state
const initialState: DashboardState = {
  securityScore: null,
  threats: [],
  iotDevices: [],
  threatMap: [],
  loading: {
    securityScore: false,
    threats: false,
    iotDevices: false,
    threatMap: false,
  },
  errors: {
    securityScore: null,
    threats: null,
    iotDevices: null,
    threatMap: null,
  },
  lastUpdated: {
    securityScore: null,
    threats: null,
    iotDevices: null,
    threatMap: null,
  },
};

// Reducer
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value }
      };
    
    case 'SET_SECURITY_SCORE':
      return {
        ...state,
        securityScore: action.payload,
        lastUpdated: { ...state.lastUpdated, securityScore: new Date() }
      };
    
    case 'SET_THREATS':
      return {
        ...state,
        threats: action.payload,
        lastUpdated: { ...state.lastUpdated, threats: new Date() }
      };
    
    case 'SET_IOT_DEVICES':
      return {
        ...state,
        iotDevices: action.payload,
        lastUpdated: { ...state.lastUpdated, iotDevices: new Date() }
      };
    
    case 'SET_THREAT_MAP':
      return {
        ...state,
        threatMap: action.payload,
        lastUpdated: { ...state.lastUpdated, threatMap: new Date() }
      };
    
    case 'REFRESH_ALL':
      return {
        ...state,
        loading: {
          securityScore: true,
          threats: true,
          iotDevices: true,
          threatMap: true,
        },
        errors: {
          securityScore: null,
          threats: null,
          iotDevices: null,
          threatMap: null,
        }
      };
    
    default:
      return state;
  }
}

// Context
interface DashboardContextType {
  state: DashboardState;
  actions: {
    refreshSecurityScore: () => Promise<void>;
    refreshThreats: () => Promise<void>;
    refreshIoTDevices: () => Promise<void>;
    refreshThreatMap: () => Promise<void>;
    refreshAll: () => Promise<void>;
  };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Provider component
interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Action creators
  const refreshSecurityScore = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'securityScore', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'securityScore', value: null } });
    
    try {
      const score = await SecurityScoreAPI.calculateSecurityScore();
      dispatch({ type: 'SET_SECURITY_SCORE', payload: score });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load security score';
      dispatch({ type: 'SET_ERROR', payload: { key: 'securityScore', value: errorMessage } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'securityScore', value: false } });
    }
  };

  const refreshThreats = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'threats', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'threats', value: null } });
    
    try {
      const threats = await VirusTotalAPI.getRecentThreats();
      dispatch({ type: 'SET_THREATS', payload: threats });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load threats';
      dispatch({ type: 'SET_ERROR', payload: { key: 'threats', value: errorMessage } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'threats', value: false } });
    }
  };

  const refreshIoTDevices = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'iotDevices', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'iotDevices', value: null } });
    
    try {
      const devices = await ShodanAPI.searchIoTDevices();
      dispatch({ type: 'SET_IOT_DEVICES', payload: devices });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load IoT devices';
      dispatch({ type: 'SET_ERROR', payload: { key: 'iotDevices', value: errorMessage } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'iotDevices', value: false } });
    }
  };

  const refreshThreatMap = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'threatMap', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'threatMap', value: null } });
    
    try {
      const mapData = await ShodanAPI.getThreatData();
      dispatch({ type: 'SET_THREAT_MAP', payload: mapData });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load threat map';
      dispatch({ type: 'SET_ERROR', payload: { key: 'threatMap', value: errorMessage } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'threatMap', value: false } });
    }
  };

  const refreshAll = async () => {
    dispatch({ type: 'REFRESH_ALL' });
    
    // Run all refreshes in parallel
    await Promise.allSettled([
      refreshSecurityScore(),
      refreshThreats(),
      refreshIoTDevices(),
      refreshThreatMap(),
    ]);
  };

  // Load initial data on mount
  useEffect(() => {
    refreshAll();
  }, []);

  const contextValue: DashboardContextType = {
    state,
    actions: {
      refreshSecurityScore,
      refreshThreats,
      refreshIoTDevices,
      refreshThreatMap,
      refreshAll,
    },
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

// Hook to use the dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}