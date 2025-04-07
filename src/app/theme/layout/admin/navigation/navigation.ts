export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Inicio',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'usuario',
        title: 'Gestión de Usuarios',
        type: 'item',
        url: '/inicio/usuarios',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'autor',
        title: 'Gestión de Autores',
        type: 'item',
        url: '/inicio/autores',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },

      {
        id: 'libro',
        title: 'Gestión de Libros',
        type: 'item',
        url: '/inicio/libro',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },

      {
        id: 'prestamo',
        title: 'Gestion de Prestamo',
        type: 'item',
        url: '/inicio/prestamo',
        icon: 'feather icon-users',
        classes: 'nav-item'
      }
    ]
  },
  /* ---------- Nuevos menus aqui -------------  */
];
