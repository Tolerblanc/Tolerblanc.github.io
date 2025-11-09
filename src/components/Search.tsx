import { useEffect, useRef, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface PagefindUI {
  new (options: {
    element: HTMLElement;
    showSubResults?: boolean;
    bundlePath?: string;
    placeholder?: string;
    autofocus?: boolean;
    translations?: {
      placeholder?: string;
      clear_search?: string;
      load_more?: string;
      search_label?: string;
      filters_label?: string;
      zero_results?: string;
      many_results?: string;
      one_result?: string;
      alt_search?: string;
      search_suggestion?: string;
      searching?: string;
    };
  }): void;
}

declare global {
  interface Window {
    PagefindUI?: PagefindUI;
  }
}

export const Search = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 검색 다이얼로그 토글
  const toggleSearch = () => {
    if (dialogRef.current) {
      if (isOpen) {
        dialogRef.current.close();
        setIsOpen(false);
        // 모달을 닫을 때 Pagefind UI 정리 (중첩 방지)
        if (searchRef.current) {
          searchRef.current.innerHTML = '';
        }
      } else {
        dialogRef.current.showModal();
        setIsOpen(true);
      }
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleSearch();
      }
      // Cmd/Ctrl + K로 검색 열기
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Pagefind UI 초기화
  useEffect(() => {
    const currentRef = searchRef.current;
    if (!currentRef || !isOpen) return;

    const initPagefind = async () => {
      // Pagefind UI 스크립트 동적 로드
      if (!window.PagefindUI) {
        const script = document.createElement('script');
        script.src = '/pagefind/pagefind-ui.js';
        script.async = true;

        script.onload = () => {
          if (currentRef && window.PagefindUI) {
            new window.PagefindUI({
              element: currentRef,
              showSubResults: true,
              autofocus: true,
              translations: {
                placeholder: '검색어를 입력하세요...',
                clear_search: '검색 지우기',
                load_more: '더 보기',
                search_label: '검색',
                zero_results: '검색 결과가 없습니다.',
                many_results: '개의 결과',
                one_result: '1개의 결과',
                searching: '검색 중...',
              },
            });
          }
        };

        document.body.appendChild(script);

        // CSS도 로드
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/pagefind/pagefind-ui.css';
        document.head.appendChild(link);
      } else {
        // 이미 로드된 경우
        new window.PagefindUI({
          element: currentRef,
          showSubResults: true,
          autofocus: true,
          translations: {
            placeholder: '검색어를 입력하세요...',
            clear_search: '검색 지우기',
            load_more: '더 보기',
            search_label: '검색',
            zero_results: '검색 결과가 없습니다.',
            many_results: '개의 결과',
            one_result: '1개의 결과',
            searching: '검색 중...',
          },
        });
      }
    };

    initPagefind();
  }, [isOpen]);

  return (
    <>
      {/* 검색 트리거 버튼 */}
      <button
        onClick={toggleSearch}
        className="hidden md:flex items-center gap-2 px-4 h-10 rounded-lg border border-border/40 hover:border-border/80 bg-background/50 hover:bg-background/80 transition-all duration-200"
        aria-label="검색"
      >
        <SearchIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">검색...</span>
        <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/40 bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* 모바일 검색 버튼 */}
      <button
        onClick={toggleSearch}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
        aria-label="검색"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      {/* 검색 다이얼로그 */}
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/50 bg-transparent border-0 p-4 inset-0 m-auto max-w-2xl w-full max-h-[80vh] rounded-lg shadow-2xl overflow-visible"
        onClick={(e) => {
          // 배경 클릭 시 닫기
          if (e.target === dialogRef.current) {
            toggleSearch();
          }
        }}
      >
        <div className="bg-background rounded-lg p-6 shadow-2xl max-h-full overflow-auto">
          <div ref={searchRef} className="pagefind-search" />
        </div>
      </dialog>
    </>
  );
};
