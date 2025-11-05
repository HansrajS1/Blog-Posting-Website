/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", selectedCategory],
    queryFn: async () => {
      // eslint-disable-next-line prefer-const
      let query = supabase
        .from("posts")
        .select(`
          *,
          post_categories (
            category_id,
            categories (
              id,
              name,
              slug
            )
          )
        `)
        .eq("published", true)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;

      // Filter by category if selected
      if (selectedCategory) {
        return data.filter(post =>
          post.post_categories.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (pc: any) => pc.categories.id === selectedCategory
          )
        );
      }

      return data;
    },
  });

  const isLoading = categoriesLoading || postsLoading;

  return (
    <div className="min-h-screen bg-background">      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Posts</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover stories, insights, and ideas from our community of writers
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All Posts
            </Badge>
            {categories?.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt || post.content.substring(0, 150) + "..."}
                categories={post.post_categories.map((pc: any) => pc.categories)}
                createdAt={post.created_at}
                published={post.published}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No posts found. {selectedCategory && "Try selecting a different category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;