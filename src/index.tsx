import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ToastContainer } from 'react-toastify';
import Spinner from './components/shared/spinner';
import * as smoothscroll from 'smoothscroll-polyfill';
import ErrorBoundry from './components/errors/ErrorBoundry';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

smoothscroll.polyfill();

// Lazy load app to improve LCP time
// Loading app involves loading word list and crossword database which takes a long time
const App = React.lazy(() => import('./App'));
let persistor = persistStore(store);

Sentry.init({
  dsn: "https://dfd1f1b23843483d87cf9d87cd52f4dc@o1174397.ingest.sentry.io/6270367",
  integrations: [new BrowserTracing()],
  environment: process.env.NODE_ENV,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.01,
});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundry>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer hideProgressBar={true} limit={1} />
          <Suspense fallback={
            <div className='w-screen h-screen flex justify-center items-center'>
              <Spinner color="indigo-600" size={30} />
            </div>
          }>
            <App />
          </Suspense>
        </PersistGate>
      </Provider>
    </ErrorBoundry>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
