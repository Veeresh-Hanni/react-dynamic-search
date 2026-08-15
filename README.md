# react-dynamic-search

A debounced, filterable, cache-aware search hook for React — built on top of [TanStack Query](https://tanstack.com/query).

Handles debouncing, request caching, filter state, and loading states so you don't have to wire them up by hand every time you build a search box.

## Install

```bash
npm install react-dynamic-search @tanstack/react-query
```

`react` and `@tanstack/react-query` are peer dependencies — this package doesn't bundle them, so your app's existing versions are used.

You'll also need a `QueryClientProvider` set up somewhere near the root of your app (standard React Query setup):

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
```

## Usage

```jsx
import { useDynamicSearch } from 'react-dynamic-search';

function ProductSearch() {
  const { query, setQuery, filters, setFilters, results, isLoading, isFetching, error } =
    useDynamicSearch({
      onSearch: (q, filters) =>
        fetch(`/api/products?q=${q}&category=${filters.category ?? ''}`).then((r) => r.json()),
      debounceTime: 400,
      minQueryLength: 2,
      initialFilters: { category: '' },
    });

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {isLoading && <p>Loading...</p>}
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}
```

Works the same in plain JavaScript/JSX or TypeScript/TSX — see [`examples/`](./examples) for both.

## API

### `useDynamicSearch(config)`

| Option | Type | Default | Description |
|---|---|---|---|
| `onSearch` | `(query, filters) => Promise<T[]>` | required | Called with the debounced query and current filters. |
| `debounceTime` | `number` | `500` | Milliseconds to wait after typing stops before searching. |
| `minQueryLength` | `number` | `2` | Minimum query length before a search fires. |
| `initialFilters` | `object` | `{}` | Starting filter values. |

**Returns**

| Field | Type | Description |
|---|---|---|
| `query` | `string` | Current raw input value. |
| `setQuery` | `(value: string) => void` | Update the query. |
| `filters` | `object` | Current filter values. |
| `setFilters` | `React.Dispatch<SetStateAction>` | Update filters. |
| `results` | `T[]` | Latest search results (empty array if none yet). |
| `isLoading` | `boolean` | True only on the very first load. |
| `isFetching` | `boolean` | True during any fetch, including background refetches — use this for a subtle "updating" indicator without a full loading state on every keystroke. |
| `error` | `unknown` | Error from the last failed search, if any. |

## Design notes

- **Debounce is hand-rolled internally** — a small, well-understood mechanism, not worth pulling in a separate dependency for.
- **Caching, request dedup, and stale-request handling are delegated to React Query** rather than reimplemented — its `queryKey` includes both the debounced query and filters, so filter changes correctly bust the cache instead of serving stale results.
- **No pagination by default** — kept out until there's an actual need (YAGNI); add it at the consumer level via `onSearch` if your API paginates.

## Development

```bash
npm install
npm run dev        # watch mode build
npm run typecheck
npm run test
npm run build       # production build → dist/
```

## License

MIT
