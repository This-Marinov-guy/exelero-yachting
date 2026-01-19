'use client';
import BlogGridView from '@/components/commonComponents/blogGridView';

const BlogInfiniteScrollContainer = () => {
  return <BlogGridView gridSize={3} type='infinite-scroll' />;
}

export default BlogInfiniteScrollContainer