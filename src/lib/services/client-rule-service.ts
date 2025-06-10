// Client-side service for rules that uses API routes instead of direct server calls
import { Rule, RuleCategory, PaginatedResult } from '../types';

/**
 * Fetch all rule categories
 */
export async function fetchRuleCategories(): Promise<RuleCategory[]> {
  try {
    // Try the dedicated categories endpoint first
    let response = await fetch('/api/categories');
    if (!response.ok) {
      // Fallback to the main rules endpoint
      response = await fetch('/api/rules');
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Fetch all rules with pagination
 */
export async function fetchAllRules(page: number = 1, limit: number = 50): Promise<PaginatedResult<Rule>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await fetch(`/api/rules/all?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rules: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all rules:', error);
    throw error;
  }
}

/**
 * Search rules with pagination
 */
export async function fetchSearchRules(query: string, page: number = 1, limit: number = 50): Promise<PaginatedResult<Rule>> {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      pageSize: limit.toString()
    });
    
    const response = await fetch(`/api/rules/search?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to search rules: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching rules:', error);
    throw error;
  }
}

/**
 * Fetch rules by category
 */
export async function fetchRulesByCategory(categoryId: string, page: number = 1, limit: number = 50): Promise<PaginatedResult<Rule>> {
  try {
    const params = new URLSearchParams({
      category: categoryId,
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await fetch(`/api/rules?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rules by category: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rules by category:', error);
    throw error;
  }
}

/**
 * Fetch a single rule by ID
 */
export async function fetchSingleRule(ruleId: string, categorySlug?: string): Promise<Rule> {
  try {
    // Use the category slug if provided, otherwise default to 'core'
    const category = categorySlug || 'core';
    
    const response = await fetch(`/api/rules/${category}/${ruleId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rule: ${response.statusText}`);
    }
    const data = await response.json();
    return data.rule;
  } catch (error) {
    console.error('Error fetching single rule:', error);
    throw error;
  }
} 