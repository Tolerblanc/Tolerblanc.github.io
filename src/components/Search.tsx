import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Search as SearchIcon, FileText, Home, BookOpen, Tag, User, Sun, Moon } from 'lucide-react';

interface PagefindResult {
  url: string;
  meta: { title: string };
  excerpt: string;
}

interface Pagefind {
  search: (query: string) => Promise<{ results: { data: () => Promise<PagefindResult> }[] }>;
}

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Blog', href: '/posts', icon: BookOpen },
  { label: 'Series', href: '/series', icon: BookOpen },
  { label: 'Tags', href: '/tags', icon: Tag },
  { label: 'About', href: '/about', icon: User },
];

export const Search = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const pagefindRef = useRef<Pagefind | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Load Pagefind JS API on first open
  const loadPagefind = useCallback(async () => {
    if (pagefindRef.current) return;
    try {
      // Pagefind is generated at build time; use dynamic import with @vite-ignore
      const pf = await (new Function('return import("/pagefind/pagefind.js")')()) as Pagefind;
      pagefindRef.current = pf;
    } catch {
      // Pagefind not available (dev mode)
    }
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load Pagefind when dialog opens
  useEffect(() => {
    if (open) {
      loadPagefind();
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open, loadPagefind]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!pagefindRef.current) {
        setLoading(false);
        return;
      }
      try {
        const search = await pagefindRef.current.search(query);
        const data = await Promise.all(
          search.results.slice(0, 8).map((r) => r.data())
        );
        setResults(data);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const navigate = (href: string) => {
    setOpen(false);
    window.location.href = href;
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.add('theme-transitioning');
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setTimeout(() => html.classList.remove('theme-transitioning'), 200);
    setOpen(false);
  };

  return (
    <>
      {/* Desktop trigger */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 h-10 rounded-lg border border-border/40 hover:border-border/80 bg-background/50 hover:bg-background/80 transition-all duration-200"
        aria-label="검색"
      >
        <SearchIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">검색...</span>
        <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/40 bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
        aria-label="검색"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      {/* Spotlight dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="검색어를 입력하거나 페이지로 이동..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? '검색 중...' : query ? '검색 결과가 없습니다.' : '검색어를 입력하세요.'}
          </CommandEmpty>

          {/* Search results */}
          {results.length > 0 && (
            <CommandGroup heading="검색 결과">
              {results.map((result) => (
                <CommandItem
                  key={result.url}
                  value={`search-${result.url}`}
                  onSelect={() => navigate(result.url)}
                  className="flex items-start gap-3 py-3"
                >
                  <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-medium text-sm truncate">{result.meta.title}</span>
                    <span
                      className="text-xs text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Quick navigation */}
          {!query && (
            <>
              <CommandGroup heading="페이지 이동">
                {NAV_ITEMS.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`nav-${item.label}`}
                    onSelect={() => navigate(item.href)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="설정">
                <CommandItem value="action-theme" onSelect={toggleTheme}>
                  <Sun className="mr-2 h-4 w-4 dark:hidden" />
                  <Moon className="mr-2 h-4 w-4 hidden dark:block" />
                  <span>테마 전환</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
