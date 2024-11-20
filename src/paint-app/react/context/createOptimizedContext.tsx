import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore
} from 'react';

export const createOptimizedContext = <Store,>(initialState: Store) => {
  const NOT_FOUND_MSG = 'Store should be called inside respective context!';

  function useStoreData() {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store>) => {
      for (const x in value) {
        if (value[x] !== store.current[x]) {
          store.current = { ...store.current, [x]: value[x] };
        }
      }

      subscribers.current.forEach(cb => cb());
    }, []);

    const subscribe = useCallback((cb: () => void) => {
      subscribers.current.add(cb);
      return () => subscribers.current.delete(cb);
    }, []);

    return { get, set, subscribe };
  }

  const StoreContext = createContext<ReturnType<typeof useStoreData> | null>(
    null
  );

  function Provider({ children }: { children: React.ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useStoreSelector<T>(selector: (store: Store) => T): T {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error(NOT_FOUND_MSG);
    }

    const state = useSyncExternalStore(store.subscribe, () =>
      selector(store.get())
    );

    return state;
  }

  function useStoreDispatch() {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error(NOT_FOUND_MSG);
    }

    return store.set;
  }

  return { Provider, useStoreSelector, useStoreDispatch };
};
