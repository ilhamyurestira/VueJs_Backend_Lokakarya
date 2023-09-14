<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

const model = ref([
    {
        label: 'User Admin',
        items: [
            { label: 'User Manager', icon: 'pi pi-fw pi-user-edit', to: { name: 'userManager' } },
            { label: 'Role Manager', icon: 'pi pi-fw pi-users', to: { name: 'roleManager' } },
            { label: 'Menu Manager', icon: 'pi pi-fw pi-align-left', to: { name: 'menuManager' } },
            { label: 'Manage Hak Akses', icon: 'pi pi-fw pi-wrench', to: { name: 'hakAksesManager' } },
            { label: 'Manage Role Menus', icon: 'pi pi-fw pi-wrench', to: { name: 'roleMenuManager' } }
        ]
    },
    {
        label: 'Bank Admin',
        items: [
            { label: 'Master Bank', icon: 'fa fa-solid fa-building-columns', to: '/bankadm/masterBank' },
            { label: 'Transaksi Nasabah', icon: 'fa fa-solid fa-money-bill-transfer', to: '/bankadm/transaksiNasabah' },
            { label: 'Histori Nasabah', icon: 'fa fa-solid fa-clock-rotate-left', to: '/bankadm/historyBank', customIcon: 'fa-light fa-chevron-down' }
        ]
    },
    {
        label: 'Telpon Admin',
        items: [
            { label: 'Master Pelanggan', icon: 'pi pi-fw pi-exclamation-circle', to: '/tlpadm/masterpelanggan' },
            { label: 'Transaksi Telpon', icon: 'pi pi-fw pi-mobile', to: '/tlpadm/transaksiTelpon' },
            { label: 'Histori Transaksi', icon: 'pi pi-fw pi-table', to: '/tlpadm/historiTransaksi' }
        ]
    },
    {
        label: 'Nasabah',
        items: [
            { label: 'Cek Saldo', icon: 'pi pi-wallet', to: '/uikit/CekSaldoComponent' },
            { label: 'Setor', icon: 'pi pi-dollar', to: '/uikit/SetorComponent' },
            { label: 'Ambil', icon: 'pi pi-money-bill', to: '/uikit/TarikComponent' },
            { label: 'Transfer', icon: 'pi pi-arrow-right-arrow-left', to: '/uikit/TransferComponent' },
            { label: 'Bayar Telpon', icon: 'pi pi-mobile', to: '/uikit/BayarTelponComponent' }
        ]
    },
    {
        label: 'Hierarchy',
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <!-- <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li> -->
    </ul>
</template>

<style lang="scss" scoped></style>
