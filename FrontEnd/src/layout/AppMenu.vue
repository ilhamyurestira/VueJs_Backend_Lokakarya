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
    // console.log(current);
    currentAccess.value = current;
    console.log(currentAccess.value);
    switch (currentAccess.value.roleId) {
        case 1:
            isUserAdmin.value = true;
            break;
        case 2:
            isBankAdmin.value = true;
            break;
        case 3:
            isTelpAdmin.value = true;
            break;
        case 4:
            isBankUser.value = true;
            break;
        case 8:
            isDeveloper.value = true;
            break;
        default:
            isUser.value = true;
    }
};

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
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
            { label: 'Master Bank', icon: 'fa fa-fw fa-solid fa-building-columns', to: '/masterBank' },
            { label: 'Transaksi Nasabah', icon: 'fa fa-fw fa-solid fa-money-bill-transfer', to: '/transaksiNasabah' },
            { label: 'Histori Nasabah', icon: 'fa fa-fw fa-solid fa-clock-rotate-left', to: '/historyBank' }
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
