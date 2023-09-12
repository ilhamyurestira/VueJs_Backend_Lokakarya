export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'USER ADM',
  },
  {
    component: 'CNavItem',
    name: 'Role',
    to: '/theme/colors',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Role Menu',
    to: '/theme/typography',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Menu',
    to: '/theme/typography',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Hak Akses',
    to: '/theme/typography',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Users',
    to: '/theme/typography',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavTitle',
    name: 'BANK ADM',
  },
  {
    component: 'CNavItem',
    name: 'Master BANK',
    to: '/theme/typography',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'Transaksi Nasabah',
    to: '/theme/typography',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavGroup',
    name: 'History Transaksi',
    to: '/base',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'Setor',
        to: '/base/accordion',
      },
      {
        component: 'CNavItem',
        name: 'Ambil',
        to: '/base/breadcrumbs',
      },
      {
        component: 'CNavItem',
        name: 'Transfer',
        to: '/base/cards',
      },
      {
        component: 'CNavItem',
        name: 'Bayar Telepon',
        to: '/base/carousels',
      },
    ],
  },

  {
    component: 'CNavTitle',
    name: 'Telepon ADM',
  },
  {
    component: 'CNavTitle',
    name: 'Nasabah',
  },

  // {
  //   component: 'CNavItem',
  //   name: 'Download CoreUI',
  //   href: 'http://coreui.io/vue/',
  //   icon: { name: 'cil-cloud-download', class: 'text-white' },
  //   _class: 'bg-success text-white',
  //   target: '_blank'
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Try CoreUI PRO',
  //   href: 'http://coreui.io/pro/vue/',
  //   icon: { name: 'cil-layers', class: 'text-white' },
  //   _class: 'bg-danger text-white',
  //   target: '_blank'
  // }
]
