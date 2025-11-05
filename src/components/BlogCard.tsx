import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories: Category[];
  createdAt: string;
  published: boolean;
}

const BlogCard = ({ id, title, slug, excerpt, categories, createdAt, published }: BlogCardProps) => {
  const readingTime = Math.ceil(excerpt.split(" ").length / 200);
  
  return (
    <Link to={`/blog/${slug}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
            {!published && (
              <Badge variant="outline">Draft</Badge>
            )}
          </div>
          <h3 className="text-2xl font-bold line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardContent>
        
        <CardFooter className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(createdAt), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;