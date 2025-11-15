/**
 * Mobile Menu Component
 *
 * 모바일에서 햄버거 버튼으로 열리는 메뉴
 * - 네비게이션 메뉴 (Home, Blog, Tags, About)
 * - 사이드바 내용 (프로필, 최근 글, 카테고리)
 */

import * as React from 'react';
import { Menu, Home, BookOpen, Tag, User, Clock, Folder, Mail, List } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface RecentPost {
  slug: string;
  title: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  postCount: number;
  path: string;
}

interface CategoryGroup {
  name: string;
  totalPosts: number;
  children: Category[];
}

interface MobileMenuProps {
  currentPath: string;
  recentPosts: RecentPost[];
  categoryGroups: CategoryGroup[];
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/posts', label: 'Blog', icon: BookOpen },
  { href: '/series', label: 'Series', icon: List },
  { href: '/tags', label: 'Tags', icon: Tag },
  { href: '/about', label: 'About', icon: User },
];

export function MobileMenu({ currentPath, recentPosts, categoryGroups }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath === href || currentPath.startsWith(href + '/');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="mobile-menu-trigger"
          aria-label="메뉴 열기"
        >
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="mobile-menu-content">
        <SheetHeader>
          <SheetTitle className="mobile-menu-title">
            인생은 B와 D사이 Code다
          </SheetTitle>
        </SheetHeader>

        <div className="mobile-menu-body">
          {/* Navigation */}
          <nav className="mobile-nav">
            <h3 className="mobile-section-title">Navigation</h3>
            <ul className="mobile-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                      onClick={() => setOpen(false)}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Profile */}
          <section className="mobile-section">
            <div className="mobile-profile">
              <img
                src="https://avatars.githubusercontent.com/u/52883827?v=4"
                alt="Tolerblanc"
                className="mobile-profile-avatar"
              />
              <div className="mobile-profile-info">
                <h4 className="mobile-profile-name">Tolerblanc</h4>
                <p className="mobile-profile-bio">🍀 GLHF</p>
              </div>
            </div>
            <div className="mobile-profile-links">
              <a
                href="https://github.com/Tolerblanc"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-profile-link"
              >
                <svg className="link-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/hyunjun-kim-981a141aa"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-profile-link"
              >
                <svg className="link-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:tolerblanc@gmail.com"
                className="mobile-profile-link"
              >
                <Mail size={16} />
                <span>Email</span>
              </a>
            </div>
          </section>

          {/* Recent Posts */}
          <section className="mobile-section">
            <h3 className="mobile-section-title">
              <Clock size={16} />
              Recent Posts
            </h3>
            <ul className="mobile-recent-posts">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <a
                    href={`/${post.slug}`}
                    className="mobile-recent-post-link"
                    onClick={() => setOpen(false)}
                  >
                    <span className="post-title">{post.title}</span>
                    <span className="post-date">{post.date}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Categories */}
          <section className="mobile-section">
            <h3 className="mobile-section-title">
              <Folder size={16} />
              Categories
            </h3>
            <div className="mobile-categories">
              {categoryGroups.map((group) => (
                <div key={group.name} className="mobile-category-group">
                  <div className="mobile-group-header">
                    <span className="group-name">{group.name}</span>
                    <span className="group-count">{group.totalPosts}</span>
                  </div>
                  <ul className="mobile-category-list">
                    {group.children.map((category) => (
                      <li key={category.id}>
                        <a
                          href={category.path}
                          className="mobile-category-link"
                          onClick={() => setOpen(false)}
                        >
                          <span>{category.name}</span>
                          <span className="category-count">{category.postCount}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
