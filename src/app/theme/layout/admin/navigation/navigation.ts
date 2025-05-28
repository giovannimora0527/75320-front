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
<<<<<<< HEAD
=======

>>>>>>> 3098747 (Frontend ultima entrega semestre)
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
<<<<<<< HEAD
        id: 'autores',
        title: 'Gestión de Autores',
        type: 'item',
        url: '/inicio/autores',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'libros',
=======
        id: 'autor',
        title: 'Gestión de Autores',
        type: 'item',
        url: '/inicio/autores',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'libro',
>>>>>>> 3098747 (Frontend ultima entrega semestre)
        title: 'Gestión de Libros',
        type: 'item',
        url: '/inicio/libros',
        icon: 'feather icon-book',
        classes: 'nav-item'
      },
      {
<<<<<<< HEAD
        id: 'prestamos',
        title: 'Gestión de Prestamos',
        type: 'item',
        url: '/inicio/prestamos',
        icon: 'feather icon-credit-card',
=======
        id: 'prestamo',
        title: 'Gestión de Prestamos',
        type: 'item',
        url: '/inicio/prestamos',
        icon: 'feather icon-users',
>>>>>>> 3098747 (Frontend ultima entrega semestre)
        classes: 'nav-item'
      }
    ]
  },
<<<<<<< HEAD
=======
  /* ---------- Nuevos menus aqui -------------  */  
>>>>>>> 3098747 (Frontend ultima entrega semestre)
];
