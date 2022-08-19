import * as React from "react";
import { useLocation } from "react-router-dom";

const InitialLoadContext = React.createContext();
InitialLoadContext.displayName = "InitialLoadContext";

function InitialLoadProvider({ children }) {
  const { pathname, hash } = useLocation();
  const [initialPath] = React.useState(pathname);
  const [initialHash] = React.useState(hash);
  const [initialLoad, setInitialLoad] = React.useState(true);

  React.useEffect(() => {
    if (initialPath !== pathname || initialHash !== hash) {
      setInitialLoad(false);
    }
  }, [initialPath, pathname, initialHash, hash]);

  return (
    <InitialLoadContext.Provider value={initialLoad}>
      {children}
    </InitialLoadContext.Provider>
  );
}

function useInitialLoad() {
  const context = React.useContext(InitialLoadContext);
  if (context === undefined) {
    throw new Error(
      `useInitialLoad must be used within an InitialLoadProvider`
    );
  }
  return context;
}

export { InitialLoadProvider, useInitialLoad };
