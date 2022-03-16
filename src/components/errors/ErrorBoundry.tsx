import React from 'react';
import Error from './Error';

class ErrorBoundary extends React.Component<{}, { error: any }> {
  constructor(props: {}) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error) return <Error error={error} />;

    return children;
  }
}

export default ErrorBoundary;
