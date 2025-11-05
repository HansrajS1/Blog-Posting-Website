import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenTool, BookOpen, Tags, Zap } from "lucide-react";
import heroImage from "@/assets/hero-blog.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Share Your Stories,
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}Inspire the World
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                A beautiful platform for writers and readers. Create, manage, and share your blog posts with an elegant content management system.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="shadow-elegant" asChild>
                  <Link to="/blog">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Read Blog
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">
                    <PenTool className="mr-2 h-5 w-5" />
                    Start Writing
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-scale-in">
              <img 
                src={heroImage} 
                alt="Modern blogging platform" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Blog
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed for modern content creators
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rich Content Editor</h3>
              <p className="text-muted-foreground">
                Write with markdown support for beautiful, formatted content that engages your readers.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Tags className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Category Management</h3>
              <p className="text-muted-foreground">
                Organize your posts with categories and make it easy for readers to find content they love.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast & Responsive</h3>
              <p className="text-muted-foreground">
                Lightning-fast performance with a beautiful, mobile-responsive design that works everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Blogging Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join our community of writers and share your unique voice with the world.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/dashboard">
              Get Started Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} InkWell. Built with ❤️ for writers everywhere.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;