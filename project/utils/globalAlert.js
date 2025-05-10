// utils/globalAlert.js

export const showGlobalAlert = (message) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-global-alert', { detail: message }));
    }
  };
  