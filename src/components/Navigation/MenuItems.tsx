import { menuItems } from '../../config/menuItems';
import type { Page } from '../../types';

interface MenuItemsProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onShare: () => void;
  onClose: () => void;
}

export function MenuItems({ currentPage, onPageChange, onShare, onClose }: MenuItemsProps) {
  const handleClick = (item: typeof menuItems[0], event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (item.action === 'share') {
      onShare();
    } else if (item.page) {
      onPageChange(item.page);
    }
    onClose();
  };

  return (
    <nav className="py-1" onClick={e => e.stopPropagation()}>
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={(e) => handleClick(item, e)}
          className={`w-full px-4 py-2 text-left flex items-center gap-3 ${
            item.page === currentPage
              ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-800/50'
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
    </nav>
  );
}