import * as React from "react";

const InitialLoadContext = React.createContext();
InitialLoadContext.displayName = "InitialLoadContext";

function InitialLoadProvider({ children }) {
  const [initialLocation] = React.useState(document.location.href);

  const [initialLoad, setInitialLoad] = React.useState(true);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      if (initialLocation !== document.location.href) {
        setInitialLoad(false);
      }
    });

    observer.observe(document.getElementById("root"), {
      childList: true,
    });

    return () => observer.disconnect();
  }, [initialLocation]);

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
