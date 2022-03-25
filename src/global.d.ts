declare global {
  interface Window {
    gtag: Gtag.Gtag;
  }
}

declare module 'redux-persist-indexeddb-storage';
declare module 'elevator.js';
