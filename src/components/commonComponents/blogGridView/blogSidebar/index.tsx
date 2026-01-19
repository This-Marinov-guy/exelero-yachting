import Article from "./Article";
import BlogCategories from "./BlogCategories";
import BlogSocial from "./BlogSocial";

const BlogSidebar = () => {
  return (
    <div className='blog-sidebar'>
      <Article />
      <BlogCategories />
      <BlogSocial />
    </div>
  );
};

export default BlogSidebar;
