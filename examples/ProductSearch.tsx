// Example consumer app — shows real usage with TypeScript + JSX (.tsx)
import { useDynamicSearch } from 'react-dynamic-search';

interface Product {
  id: string;
  name: string;
}

interface ProductFilters {
  category: string;
}

async function fetchProducts(query: string, filters: ProductFilters): Promise<Product[]> {
  const res = await fetch(`/api/products?q=${query}&category=${filters.category ?? ''}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export default function ProductSearch() {
  const { query, setQuery, filters, setFilters, results, isLoading, isFetching, error } =
    useDynamicSearch<Product, ProductFilters>({
      onSearch: fetchProducts,
      debounceTime: 400,
      minQueryLength: 2,
      initialFilters: { category: '' },
    });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />

      <select
        value={filters.category}
        onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
      >
        <option value="">All categories</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
      </select>

      {isLoading && <p>Loading...</p>}
      {isFetching && !isLoading && <p>Updating results...</p>}
      {error && <p>Error: {(error as Error).message}</p>}

      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
