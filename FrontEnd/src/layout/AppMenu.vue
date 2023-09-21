<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import '@fortawesome/fontawesome-free/css/all.css';

const currentAccess = ref(null);
const isUserAdmin = ref(false);
const isBankAdmin = ref(false);
const isTelpAdmin = ref(false);
const isBankUser = ref(false);
const isUser = ref(false);
const isDeveloper = ref(false);

onMounted(() => {
    checkAccess();
});

const checkAccess = () => {
    const current = JSON.parse(localStorage.getItem('token'));
    currentAccess.value = current;
    switch (currentAccess.value.previllages) {
        case 'User Admin':
            isUserAdmin.value = true;
            break;
        case 'Bank Admin':
            isBankAdmin.value = true;
            break;
        case 'Telp Admin':
            isTelpAdmin.value = true;
            break;
        case 'Nasabah':
            isBankUser.value = true;
            break;
        case 'Developer':
            isDeveloper.value = true;
            break;
        default:
            isUser.value = true;
    }
};

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'fa fa-fw fa-solid fa-house', to: '/dashboard' }]
    },
    {
        label: 'User Admin',
        items: [
            { label: 'User Manager', icon: 'fa fa-fw fa-solid fa-user-pen', to: '/userManager' },
            { label: 'Role Manager', icon: 'fa fa-fw fa-solid fa-user-group', to: '/roleManager' },
            { label: 'Menu Manager', icon: 'fa fa-fw fa-solid fa-list', to: '/menuManager' },
            { label: 'Manage Hak Akses', icon: 'fa fa-fw fa-solid fa-user-lock', to: '/manageHakAkses' },
            { label: 'Manage Role Menus', icon: 'fa fa-fw fa-solid fa-users-gear', to: '/manageRoleMenu' }
        ]
    },
    {
        label: 'Bank Admin',
        items: [
            { label: 'Master Bank', icon: 'fa fa-fw fa-solid fa-building-columns', to: '/masterBank' },
            { label: 'Transaksi Nasabah', icon: 'fa fa-fw fa-solid fa-money-bill-transfer', to: '/transaksiNasabah' },
            { label: 'Histori Nasabah', icon: 'fa fa-fw fa-solid fa-clock-rotate-left', to: '/historyBank' }
        ]
    },
    {
        label: 'Telpon Admin',
        items: [
            { label: 'Master Pelanggan', icon: 'fa fa-fw fa-solid fa-user-tie', to: '/masterPelanggan' },
            { label: 'Transaksi Telpon', icon: 'fa fa-fw fa-solid fa-money-bill-transfer', to: '/transaksiTelpon' },
            { label: 'Histori Transaksi', icon: 'fa fa-fw fa-solid fa-clock-rotate-left', to: '/historiTransaksi' }
        ]
    },
    {
        label: 'Nasabah',
        items: [
            { label: 'Cek Saldo', icon: 'fa fa-fw fa-solid fa-wallet', to: '/cekSaldo' },
            { label: 'Setor', icon: 'fa fa-fw fa-solid fa-sack-dollar', to: '/setor' },
            { label: 'Ambil', icon: 'fa fa-fw fa-solid fa-hand-holding-dollar', to: '/tarik' },
            { label: 'Transfer', icon: 'fa fa-fw fa-solid fa-money-bill-transfer', to: '/transfer' },
            { label: 'Bayar Telpon', icon: 'fa fa-fw fa-solid fa-money-bill-wave', to: '/bayarTelpon' }
        ]
    },
    {
        //comment this section when done building
        label: 'Development Kit',
        items: [
            {
                label: 'Utilities',
                items: [
                    { label: 'Icons', to: { name: 'icons' } },
                    { label: 'Blocks', to: { name: 'blocks' } },
                    { label: 'Documentation', to: { name: 'documentation' } }
                ]
            },
            {
                label: 'UI Kit',
                items: [
                    { label: 'Form Layout', to: { name: 'formlayout' } },
                    { label: 'Input', to: { name: 'input' } },
                    { label: 'Float Label', to: { name: 'floatlabel' } },
                    { label: 'Button', to: { name: 'button' } },
                    { label: 'Table', to: { name: 'table' } },
                    { label: 'Message', to: { name: 'message' } },
                    { label: 'Chart', to: { name: 'charts' } },
                    { label: 'File', to: { name: 'file' } },
                    { label: 'Invalid State', to: { name: 'invalidState' } },
                    { label: 'List', to: { name: 'lists' } },
                    { label: 'Pick', to: { name: 'picks' } },
                    {
                        label: 'Menus',
                        items: [
                            { label: 'Demo', to: { name: 'menuDemo' } },
                            { label: 'Personal', to: { name: 'personalMenu' } },
                            { label: 'Seat', to: { name: 'seatMenu' } },
                            { label: 'Payment', to: { name: 'paymentMenu' } },
                            { label: 'Confirmation', to: { name: 'confirmationMenu' } }
                        ]
                    },
                    { label: 'Miscellanious', to: { name: 'misc' } }
                ]
            },
            {
                label: 'Pages',
                items: [
                    {
                        label: 'Authorization',
                        items: [
                            { label: 'Access', to: { name: 'accessDenied' } },
                            { label: 'Error', to: { name: 'error' } },
                            { label: 'Login', to: { name: 'login' } }
                        ]
                    },
                    { label: 'Empty', to: { name: 'empty' } },
                    { label: 'Landing', to: { name: 'landing' } },
                    { label: 'NotFound', to: { name: 'notfound' } },
                    { label: 'Timeline', to: { name: 'timeline' } },
                    { label: 'CRUD', to: { name: 'crud' } }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <div v-if="item.label === 'Home'">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </div>
            <div v-if="item.label === 'User Admin' && (isUserAdmin || isDeveloper)">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </div>
            <div v-if="item.label === 'Bank Admin' && (isBankAdmin || isDeveloper)">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </div>
            <div v-if="item.label === 'Telpon Admin' && (isTelpAdmin || isDeveloper)">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </div>
            <div v-if="item.label === 'Nasabah' && (isBankUser || isDeveloper)">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </div>
            <div v-if="item.label === 'Development Kit' && isDeveloper">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </div>
        </template>
        <!-- <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li> -->
    </ul>
</template>

<style lang="scss" scoped></style>
