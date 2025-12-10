// Temporary module shim for react-markdown to avoid complex type errors during build
declare module 'react-markdown' {
  import { ComponentType } from 'react';
  const ReactMarkdown: ComponentType<any>;
  export default ReactMarkdown;
}

declare module 'remark-gfm' {
  const plugin: any;
  export default plugin;
}
