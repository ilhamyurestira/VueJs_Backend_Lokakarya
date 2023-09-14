import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/Input.vue')
                },
                {
                    path: '/uikit/floatlabel',
                    name: 'floatlabel',
                    component: () => import('@/views/uikit/FloatLabel.vue')
                },
                // {
                //     path: '/uikit/invalidstate',
                //     name: 'invalidstate',
                //     component: () => import('@/views/uikit/InvalidState.vue')
                // },
                {
                    path: '/useradm/manage/menus',
                    name: 'menuManager',
                    component: () => import('@/views/userAdm/MenuManager.vue')
                },
                {
                    path: '/useradm/manage/roles',
                    name: 'roleManager',
                    component: () => import('@/views/userAdm/RoleManager.vue')
                },
                {
                    path: '/useradm/manage/roleMenus',
                    name: 'roleMenuManager',
                    component: () => import('@/views/userAdm/RoleMenuManager.vue')
                },
                {
                    path: '/useradm/manage/hakAkses',
                    name: 'hakAksesManager',
                    component: () => import('@/views/userAdm/HakAksesManager.vue')
                },
                {
                    path: '/useradm/manage/users',
                    name: 'userManager',
                    component: () => import('@/views/userAdm/UserManager.vue')
                },
                {
                    path: '/bankadm/masterBank',
                    name: 'masterBank',
                    component: () => import('@/views/bankadm/MasterBank.vue')
                },
                {
                    path: '/bankadm/transaksiNasabah',
                    name: 'transaksiNasabah',
                    component: () => import('@/views/bankadm/TransaksiNasabah.vue')
                },
                {
                    path: '/bankadm/historyBank',
                    name: 'historyBank',
                    component: () => import('@/views/bankadm/HistoryBank.vue')
                },
                {
                    path: '/tlpadm/masterpelanggan',
                    name: 'masterPelanggan',
                    component: () => import('@/views/tlpadm/MasterPelanggan.vue')
                },
                {
                    path: '/tlpadm/transaksiTelpon',
                    name: 'transaksiTelpon',
                    component: () => import('@/views/tlpadm/TransaksiTelpon.vue')
                },
                {
                    path: '/tlpadm/historiTransaksi',
                    name: 'historiTransaksi',
                    component: () => import('@/views/tlpadm/historiTransaksi.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/Button.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/Table.vue')
                },
                {
                    path: '/uikit/CekSaldoComponent',
                    name: 'cekSaldo',
                    component: () => import('@/views/nasabah/CekSaldoComponent.vue')
                },
                {
                    path: '/uikit/SetorComponent',
                    name: 'setor',
                    component: () => import('@/views/nasabah/SetorComponent.vue')
                },
                {
                    path: '/uikit/TarikComponent',
                    name: 'tarik',
                    component: () => import('@/views/nasabah/TarikComponent.vue')
                },
                {
                    path: '/uikit/TransferComponent',
                    name: 'transfer',
                    component: () => import('@/views/nasabah/TransferComponent.vue')
                },
                {
                    path: '/uikit/BayarTelponComponent',
                    name: 'bayarTelpon',
                    component: () => import('@/views/nasabah/BayarTelponComponent.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'personalMenu',
                    component: () => import('@/views/uikit/Menu.vue'),
                    children: [
                        {
                            path: '/uikit/menu/demo',
                            name: 'menuDemo',
                            component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                        },
                        {
                            path: '/uikit/menu/seat',
                            name: 'seatMenu',
                            component: () => import('@/views/uikit/menu/SeatDemo.vue')
                        },
                        {
                            path: '/uikit/menu/payment',
                            name: 'paymentMenu',
                            component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                        },
                        {
                            path: '/uikit/menu/confirmation',
                            name: 'confirmationMenu',
                            component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                        }
                    ]
                },
                {
                    path: '/uikit/TransferComponent',
                    name: 'transfer',
                    component: () => import('@/views/uikit/TransferComponent.vue')
                },
                {
                    path: '/uikit/TransferComponent',
                    name: 'transfer',
                    component: () => import('@/views/uikit/TransferComponent.vue')
                },
                {
                    path: '/uikit/TransferComponent',
                    name: 'transfer',
                    component: () => import('@/views/uikit/TransferComponent.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/Messages.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/File.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/Misc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/utilities/icons',
                    name: 'icons',
                    component: () => import('@/views/utilities/Icons.vue')
                },
                {
                    path: '/pages/timeline',
                    name: 'timeline',
                    component: () => import('@/views/pages/Timeline.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
