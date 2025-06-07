import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import CategoryIcon from '@mui/icons-material/Category';
import ExtensionIcon from '@mui/icons-material/Extension';
import EmailIcon from '@mui/icons-material/Email';

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const getNavData = (newOrderCount: number): NavItem[] => [
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
    title: 'Product Types',
    path: '/products-types',
    icon: <CategoryIcon />,
  },
  {
    title: 'Products',
    path: '/products',
    icon: <ExtensionIcon />,
  },
];
