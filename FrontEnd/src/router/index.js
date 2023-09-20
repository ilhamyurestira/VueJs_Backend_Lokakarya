import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/denied',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/empty',
            name: 'empty',
            component: () => import('@/views/pages/Empty.vue')
        },
        {
            path: '/app',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/useradm',
                    children: [
                        {
                            path: '/userManager',
                            name: 'userManager',
                            component: () => import('@/views/userAdm/UserManager.vue')
                        },
                        {
                            path: '/roleManager',
                            name: 'roleManager',
                            component: () => import('@/views/userAdm/RoleManager.vue')
                        },
                        {
                            path: '/menuManager',
                            name: 'menuManager',
                            component: () => import('@/views/userAdm/MenuManager.vue')
                        },
                        {
                            path: '/manageRoleMenu',
                            name: 'roleMenuManager',
                            component: () => import('@/views/userAdm/RoleMenuManager.vue')
                        },
                        {
                            path: '/manageHakAkses',
                            name: 'hakAksesManager',
                            component: () => import('@/views/userAdm/HakAksesManager.vue')
                        }
                    ]
                },
                {
                    path: '/bankadm',
                    children: [
                        {
                            path: '/masterBank',
                            name: 'masterBank',
                            component: () => import('@/views/bankadm/MasterBank.vue')
                        },
                        {
                            path: '/transaksiNasabah',
                            name: 'transaksiNasabah',
                            component: () => import('@/views/bankadm/TransaksiNasabah.vue')
                        },
                        {
                            path: '/historyBank',
                            name: 'historyBank',
                            component: () => import('@/views/bankadm/HistoryBank.vue')
                        }
                    ]
                },
                {
                    path: '/tlpadm',
                    children: [
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
                        }
                    ]
                },
                {
                    path: '/user',
                    children: [
                        {
                            path: '/user/cekSaldo',
                            name: 'cekSaldo',
                            component: () => import('@/views/nasabah/CekSaldoComponent.vue')
                        },
                        {
                            path: '/user/setor',
                            name: 'setor',
                            component: () => import('@/views/nasabah/SetorComponent.vue')
                        },
                        {
                            path: '/user/tarik',
                            name: 'tarik',
                            component: () => import('@/views/nasabah/TarikComponent.vue')
                        },
                        {
                            path: '/user/ransfert',
                            name: 'transfer',
                            component: () => import('@/views/nasabah/TransferComponent.vue')
                        },
                        {
                            path: '/user/bayar/telpon',
                            name: 'bayarTelpon',
                            component: () => import('@/views/nasabah/BayarTelponComponent.vue')
                        }
                    ]
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
                {
                    path: '/uikit/invalidstate',
                    name: 'invalidstate',
                    component: () => import('@/views/uikit/InvalidState.vue')
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
                    path: '/uikit/invalidState',
                    name: 'invalidState',
                    component: () => import('@/views/uikit/InvalidState.vue')
                },
                {
                    path: '/uikit/lists',
                    name: 'lists',
                    component: () => import('@/views/uikit/ListCom.vue')
                },
                {
                    path: '/uikit/picks',
                    name: 'picks',
                    component: () => import('@/views/uikit/pick.vue')
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
            path: '/pages/timeline',
            name: 'timeline',
            component: () => import('@/views/pages/Timeline.vue')
        },
        {
            path: '/pages/crud',
            name: 'crud',
            component: () => import('@/views/pages/Crud.vue')
        }
    ]
});

export default router;
