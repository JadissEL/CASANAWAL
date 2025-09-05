// Filter and sorting logic for menu operations
export interface MenuFilters {
  category?: string;
  search?: string;
  is_vegetarian?: string;
  is_spicy?: string;
  min_price?: string;
  max_price?: string;
  sort_by?: string;
  sort_order?: string;
  featured_only?: string;
  limit?: string;
  offset?: string;
}

export interface QueryParams {
  whereConditions: string[];
  params: any[];
  orderBy: string;
}

export const buildWhereConditions = (filters: MenuFilters): QueryParams => {
  let whereConditions = ['p.is_active = true'];
  let params: any[] = [];
  let orderBy = 'p.sort_order ASC, p.created_at DESC';

  // Category filter
  if (filters.category && filters.category !== 'all') {
    if (filters.category === 'featured') {
      whereConditions.push('p.is_featured = true');
    } else {
      whereConditions.push(`c.slug = $${params.length + 1}`);
      params.push(filters.category);
    }
  }

  // Search filter
  if (filters.search) {
    whereConditions.push(`(
      p.name ILIKE $${params.length + 1} OR
      p.description ILIKE $${params.length + 1} OR
      p.sku ILIKE $${params.length + 1}
    )`);
    params.push(`%${filters.search}%`);
  }

  // Dietary filters
  if (filters.is_vegetarian === 'true') {
    whereConditions.push('p.is_vegetarian = true');
  }

  if (filters.is_spicy === 'true') {
    whereConditions.push('p.is_spicy = true');
  }

  // Price range filters
  if (filters.min_price) {
    whereConditions.push(`p.base_price >= $${params.length + 1}`);
    params.push(parseFloat(filters.min_price));
  }

  if (filters.max_price) {
    whereConditions.push(`p.base_price <= $${params.length + 1}`);
    params.push(parseFloat(filters.max_price));
  }

  // Featured only filter
  if (filters.featured_only === 'true') {
    whereConditions.push('p.is_featured = true');
  }

  // Sorting
  orderBy = buildOrderByClause(filters.sort_by, filters.sort_order);

  return { whereConditions, params, orderBy };
};

export const buildOrderByClause = (sortBy: string = 'sort_order', sortOrder: string = 'ASC'): string => {
  switch (sortBy) {
    case 'price_asc':
      return 'p.base_price ASC';
    case 'price_desc':
      return 'p.base_price DESC';
    case 'rating':
      return 'p.rating DESC, p.rating_count DESC';
    case 'popular':
      return 'p.rating_count DESC, p.rating DESC';
    case 'newest':
      return 'p.created_at DESC';
    default:
      return `p.sort_order ${sortOrder === 'DESC' ? 'DESC' : 'ASC'}, p.created_at DESC`;
  }
};

export const buildPaginationData = (
  totalProducts: number,
  limit: string = '50',
  offset: string = '0'
) => {
  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);
  const totalPages = Math.ceil(totalProducts / limitNum);

  return {
    total: totalProducts,
    pages: totalPages,
    currentPage: Math.floor(offsetNum / limitNum) + 1,
    hasNext: (offsetNum + limitNum) < totalProducts,
    hasPrev: offsetNum > 0
  };
};

export const buildFilterSummary = (filters: MenuFilters) => ({
  category: filters.category,
  search: filters.search,
  is_vegetarian: filters.is_vegetarian === 'true',
  is_spicy: filters.is_spicy === 'true',
  min_price: filters.min_price ? parseFloat(filters.min_price) : null,
  max_price: filters.max_price ? parseFloat(filters.max_price) : null,
  sort_by: filters.sort_by,
  sort_order: filters.sort_order,
  featured_only: filters.featured_only === 'true'
});
