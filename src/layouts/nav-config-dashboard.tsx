import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import ExtensionIcon from '@mui/icons-material/Extension';
import EmailIcon from '@mui/icons-material/Email';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const getNavData = (newOrderCount: number, role?: string): NavItem[] => {
  const items: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: icon('ic-cart'),
    info:
        newOrderCount > 0 ? (
            <Label color="error" variant="inverted">
              +{newOrderCount}
            </Label>
        ) : undefined,
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Contacts',
    path: '/contacts',
    icon: <EmailIcon />,
  },
  {
    title: 'FAQ',
    path: '/faq',
    icon: <QuestionAnswerIcon />,
  },
  {
    title: 'Blog',
    path: '/blog-posts',
    icon: <ArticleOutlinedIcon />,
  },
  {
    title: 'Products',
    path: '/products-types',
    icon: <ExtensionIcon />,
  },
  ];

  if (role === 'ROLE_MANAGER') {
    const allowed = new Set(['/dashboard', '/orders', '/user', '/contacts', '/faq', '/blog-posts']);
    return items.filter((item) => allowed.has(item.path));
  }

  return items;
};
