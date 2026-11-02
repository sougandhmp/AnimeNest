import { fetchCategoryPage } from '@/features/anime/api/queries';
import type { CategoryId } from '@/features/anime/categories';
import { usePagedList } from '@/hooks/use-paged-list';

export function useCategoryList(category: CategoryId) {
  return usePagedList(
    category,
    (page, signal) => fetchCategoryPage(category, page, signal),
    `category:${category}`,
  );
}
