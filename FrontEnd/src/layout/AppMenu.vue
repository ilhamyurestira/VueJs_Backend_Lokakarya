<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import AppMenuItem from './AppMenuItem.vue';
import '@fortawesome/fontawesome-free/css/all.css';

const roleMenu = ref(null);

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
            { label: 'Master Bank', icon: 'fa fa-fw fa-solid fa-building-columns', to: '/bankadm/masterBank' },
            { label: 'Transaksi Nasabah', icon: 'fa fa-fw fa-solid fa-money-bill-transfer', to: '/bankadm/transaksiNasabah' },
            { label: 'Histori Nasabah', icon: 'fa fa-fw fa-solid fa-clock-rotate-left', to: '/bankadm/historyBank' }
        ]
    },
    {
        label: 'Telpon Admin',
        items: [
            { label: 'Master Pelanggan', icon: 'pi pi-fw pi-exclamation-circle', to: { name: 'masterPelanggan' } },
            { label: 'Transaksi Telpon', icon: 'pi pi-fw pi-mobile', to: { name: 'transaksiTelpon' } },
            { label: 'Histori Transaksi', icon: 'pi pi-fw pi-table', to: { name: 'historiTransaksi' } }
        ]
    },
    {
        label: 'Nasabah',
        items: [
            { label: 'Cek Saldo', icon: 'pi pi-wallet', to: { name: 'cekSaldo' } },
            { label: 'Setor', icon: 'pi pi-dollar', to: { name: 'setor' } },
            { label: 'Ambil', icon: 'pi pi-money-bill', to: { name: 'tarik' } },
            { label: 'Transfer', icon: 'pi pi-arrow-right-arrow-left', to: { name: 'transfer' } },
            { label: 'Bayar Telpon', icon: 'pi pi-mobile', to: { name: 'bayarTelpon' } }
        ]
    }
    // {
    //     //comment this section when done building
    //     label: 'Development Kit',
    //     items: [
    //         {
    //             label: 'Utilities',
    //             items: [
    //                 { label: 'Icons', to: { name: 'icons' } },
    //                 { label: 'Blocks', to: { name: 'blocks' } },
    //                 { label: 'Documentation', to: { name: 'documentation' } }
    //             ]
    //         },
    //         {
    //             label: 'UI Kit',
    //             items: [
    //                 { label: 'Form Layout', to: { name: 'formlayout' } },
    //                 { label: 'Input', to: { name: 'input' } },
    //                 { label: 'Float Label', to: { name: 'floatlabel' } },
    //                 { label: 'Button', to: { name: 'button' } },
    //                 { label: 'Table', to: { name: 'table' } },
    //                 { label: 'Message', to: { name: 'message' } },
    //                 { label: 'Chart', to: { name: 'charts' } },
    //                 { label: 'File', to: { name: 'file' } },
    //                 { label: 'Invalid State', to: { name: 'invalidState' } },
    //                 { label: 'List', to: { name: 'lists' } },
    //                 { label: 'Pick', to: { name: 'picks' } },
    //                 {
    //                     label: 'Menus',
    //                     items: [
    //                         { label: 'Demo', to: { name: 'menuDemo' } },
    //                         { label: 'Personal', to: { name: 'personalMenu' } },
    //                         { label: 'Seat', to: { name: 'seatMenu' } },
    //                         { label: 'Payment', to: { name: 'paymentMenu' } },
    //                         { label: 'Confirmation', to: { name: 'confirmationMenu' } }
    //                     ]
    //                 },
    //                 { label: 'Miscellanious', to: { name: 'misc' } }
    //             ]
    //         },
    //         {
    //             label: 'Pages',
    //             items: [
    //                 {
    //                     label: 'Authorization',
    //                     items: [
    //                         { label: 'Access', to: { name: 'accessDenied' } },
    //                         { label: 'Error', to: { name: 'error' } },
    //                         { label: 'Login', to: { name: 'login' } }
    //                     ]
    //                 },
    //                 { label: 'Empty', to: { name: 'emptyPage' } },
    //                 { label: 'Landing', to: { name: 'landing' } },
    //                 { label: 'NotFound', to: { name: 'notfound' } },
    //                 { label: 'Timeline', to: { name: 'timeline' } },
    //                 { label: 'CRUD', to: { name: 'crud' } }
    //             ]
    //         }
    //     ]
    // }
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
