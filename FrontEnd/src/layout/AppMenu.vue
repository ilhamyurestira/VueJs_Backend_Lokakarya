<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'User Admin',
        items: [
            { label: 'Role', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Role Menu', icon:'pi pi-fw pi-home', to: '/'},
            { label: 'Menu', icon:'pi pi-fw pi-home', to: '/'},
            { label: 'Hak Akses', icon:'pi pi-fw pi-home', to: '/'},
            { label: 'User', icon:'pi pi-fw pi-home', to: '/'}
        ]
    },
    {
        label: 'Bank Admin',
        items: [
            { label: 'Master Bank', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            { label: 'Transaksi Nasabah', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            { label: 'Histori Nasabah', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' }
            ]
    },
    {
        label: 'Telpon Admin',
        items: [
            { label: 'Master Pelanggan', icon: 'pi pi-fw pi-exclamation-circle', to: '/tlpadm/masterpelanggan' },
            { label: 'Transaksi Telpon', icon: 'pi pi-fw pi-mobile', to: '/tlpadm/transaksiTelpon' },
            { label: 'Histori Transaksi', icon: 'pi pi-fw pi-table', to: '/tlpadm/historiTransaksi' },
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
    },
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
