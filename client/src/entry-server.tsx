import { renderToPipeableStream } from "react-dom/server";
import type { Writable } from "stream";
import App from "./App";
import { SSRDataContext } from "./lib/ssr-data-context";

export function render(
  url: string,
  initialData: Record<string, unknown>,
  res: Writable,
  onReady: () => void,
  onError: (err: unknown) => void
) {
  const { pipe } = renderToPipeableStream(
    <SSRDataContext.Provider value={initialData}>
      <App ssrPath={url} />
    </SSRDataContext.Provider>,
    {
      onAllReady() {
        onReady();
        pipe(res);
      },
      onError(err) {
        onError(err);
      },
    }
  );
}
