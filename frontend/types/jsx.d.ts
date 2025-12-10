// Temporary shim to ensure JSX.IntrinsicElements is available during build
// This avoids TypeScript errors from some third-party type definitions
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
