/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CategoryBadge from "@/components/CategoryBadge";

interface PostForm {
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  categoryIds: string[];
}

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    content: "",
    excerpt: "",
    published: false,
    categoryIds: [],
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["dashboard-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
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

  const createPostMutation = useMutation({
    mutationFn: async (post: PostForm) => {
      const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const { data: newPost, error: postError } = await supabase
        .from("posts")
        .insert({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          slug,
          published: post.published,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Add categories
      if (post.categoryIds.length > 0) {
        const { error: categoryError } = await supabase
          .from("post_categories")
          .insert(
            post.categoryIds.map((categoryId) => ({
              post_id: newPost.id,
              category_id: categoryId,
            }))
          );

        if (categoryError) throw categoryError;
      }

      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      resetForm();
      toast.success("Post created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create post");
      console.error(error);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, post }: { id: string; post: PostForm }) => {
      const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const { error: postError } = await supabase
        .from("posts")
        .update({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          slug,
          published: post.published,
        })
        .eq("id", id);

      if (postError) throw postError;

      // Delete existing categories
      await supabase.from("post_categories").delete().eq("post_id", id);

      // Add new categories
      if (post.categoryIds.length > 0) {
        const { error: categoryError } = await supabase
          .from("post_categories")
          .insert(
            post.categoryIds.map((categoryId) => ({
              post_id: id,
              category_id: categoryId,
            }))
          );

        if (categoryError) throw categoryError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      resetForm();
      toast.success("Post updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update post");
      console.error(error);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete post");
      console.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      published: false,
      categoryIds: [],
    });
    setEditingId(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      published: post.published,
      categoryIds: post.post_categories.map((pc: any) => pc.category_id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePostMutation.mutate({ id: editingId, post: formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  return (
    <div className="min-h-screen bg-background">      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Post Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Post" : "Create New Post"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content (Markdown supported)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    required
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories?.map((category) => (
                      <Badge
                        key={category.id}
                        variant={
                          formData.categoryIds.includes(category.id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createPostMutation.isPending || updatePostMutation.isPending}>
                    {(createPostMutation.isPending || updatePostMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingId ? "Update" : "Create"} Post
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Posts</h2>
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.post_categories.map((pc: any) => (
                            <CategoryBadge
                              key={pc.categories.id}
                              name={pc.categories.name}
                            />
                          ))}
                          {!post.published && (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt || post.content.substring(0, 100)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          disabled={deletePostMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                No posts yet. Create your first post!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;