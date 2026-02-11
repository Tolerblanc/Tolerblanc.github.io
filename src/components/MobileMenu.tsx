import React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Github, Linkedin, Mail, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryGroup {
  name: string;
  totalPosts: number;
  children: {
    id: string;
    path: string;
    name: string;
    postCount: number;
  }[];
}

interface RecentPost {
  slug: string;
  title: string;
  date: string;
}

interface MobileMenuProps {
  currentPath: string;
  categoryGroups: CategoryGroup[];
  recentPosts: RecentPost[];
}

export function MobileMenu({ currentPath, categoryGroups, recentPosts }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-2 text-left">
           <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
               <img 
                src="https://avatars.githubusercontent.com/u/52883827?v=4" 
                alt="Tolerblanc" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold">Tolerblanc</SheetTitle>
              <SheetDescription className="text-xs">인생은 B와 D사이 Code다</SheetDescription>
            </div>
           </div>
           
           <div className="flex gap-2">
             <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
               <a href="https://github.com/Tolerblanc" target="_blank" rel="noreferrer">
                 <Github className="w-4 h-4" /> GitHub
               </a>
             </Button>
             <Button variant="outline" size="icon" className="shrink-0" asChild>
               <a href="mailto:tolerblanc@gmail.com">
                 <Mail className="w-4 h-4" />
               </a>
             </Button>
           </div>
        </SheetHeader>

        <div className="px-6 py-4">
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Menu</h3>
            <nav className="flex flex-col gap-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/posts', label: 'Blog' },
                { href: '/series', label: 'Series' },
                { href: '/tags', label: 'Tags' },
                { href: '/about', label: 'About' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mb-6">
             <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Posts</h3>
             <ul className="flex flex-col gap-2">
               {recentPosts.slice(0, 3).map((post) => (
                 <li key={post.slug}>
                   <a 
                    href={`/${post.slug}`}
                    onClick={() => setOpen(false)}
                    className="block p-2 rounded-md hover:bg-muted transition-colors"
                   >
                     <span className="block text-sm font-medium truncate">{post.title}</span>
                     <span className="block text-xs text-muted-foreground">{post.date}</span>
                   </a>
                 </li>
               ))}
             </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categories</h3>
            <div className="flex flex-col gap-4">
              {categoryGroups.map((group) => (
                <div key={group.name} className="flex flex-col gap-1">
                   <div className="px-2 py-1 text-sm font-semibold">{group.name}</div>
                   {group.children.map((category) => (
                      <a
                        key={category.id}
                        href={category.path}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs bg-muted-foreground/10 px-1.5 py-0.5 rounded-full">{category.postCount}</span>
                      </a>
                   ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
