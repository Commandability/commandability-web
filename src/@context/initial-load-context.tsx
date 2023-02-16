import * as React from "react";

const InitialLoadContext = React.createContext(true);
InitialLoadContext.displayName = "InitialLoadContext";

function InitialLoadProvider({ children }: {children: React.ReactNode}) {
  const [initialLocation] = React.useState(document.location.href);

  const [initialLoad, setInitialLoad] = React.useState(true);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      if (initialLocation !== document.location.href) {
        setInitialLoad(false);
      }
    });

    const element = document.querySelector("#root");

    if (element) {
      observer.observe(element as Node, {
        childList: true,
      });
    } else {
      throw new Error("No root element is present in the DOM")
    }

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
