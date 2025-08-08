import type { Category } from "../types/knowledge-base"

export const calculateTotalArticles = (categories: Category[]): number => {
  return categories.reduce((total, category) => {
    // Count articles in main category
    const categoryArticles = category.articles.length
    
    // Count articles in all subcategories
    const subcategoryArticles = category.subcategories.reduce(
      (subTotal, subcategory) => subTotal + subcategory.articles.length,
      0
    )
    
    return total + categoryArticles + subcategoryArticles
  }, 0)
}

export const getArticleStats = (categories: Category[]) => {
  let totalArticles = 0
  let totalCategories = categories.length
  let totalSubcategories = 0
  let categoriesWithArticles = 0
  let subcategoriesWithArticles = 0

  categories.forEach((category) => {
    // Count articles in main category
    totalArticles += category.articles.length
    if (category.articles.length > 0) {
      categoriesWithArticles++
    }

    // Count subcategories and their articles
    totalSubcategories += category.subcategories.length
    category.subcategories.forEach((subcategory) => {
      totalArticles += subcategory.articles.length
      if (subcategory.articles.length > 0) {
        subcategoriesWithArticles++
      }
    })
  })

  return {
    totalArticles,
    totalCategories,
    totalSubcategories,
    categoriesWithArticles,
    subcategoriesWithArticles,
  }
}
