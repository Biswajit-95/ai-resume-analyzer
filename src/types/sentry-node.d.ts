declare module '@sentry/node' {
  export function init(options: any): void;
  export const Handlers: {
    requestHandler: () => any;
    errorHandler: () => any;
  };
}
