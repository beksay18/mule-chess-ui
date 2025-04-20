import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import CategoryIcon from '@mui/icons-material/Category';
import ExtensionIcon from '@mui/icons-material/Extension';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Orders',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
        <Label color="error" variant="inverted">
          +3
        </Label>
    ),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Product Types',
    path: '/products-types',
    icon: <CategoryIcon />,
  },
  {
    title: 'Products',
    path: '/products',
    icon: <ExtensionIcon/>,
  },
];
