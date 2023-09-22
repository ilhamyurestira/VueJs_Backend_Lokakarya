<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'; // Import Axios

const currentPage = ref(1);
const totalPages = ref(0);
const totalElements = ref(0);
const limit = ref(10); // Nilai default limit
const keyword = ref('');
const isLoading = ref(true);

const showPaginator = ref(false);

const toast = useToast();
const router = useRouter();
const now = new Date();

const isDeveloper = ref(false);
const isUserAdmin = ref(false);
const isBankAdmin = ref(false);
const isTelpAdmin = ref(false);
const isBankUser = ref(false);
const isUnassignedUser = ref(false);

const datas = ref([]);
const apiUrl = 'http://localhost:8000/api/v1/historyBank';
const selectedDatas = ref(null);
const dt = ref(null);

onBeforeMount(() => {
    checkLogin();
    // checkAdminPrevilage();
});
// Fetch data from the API on component mount
onMounted(() => {
    fetchData();
});
const formatCurrency = (value) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

const checkLogin = () => {
    const Token = JSON.parse(localStorage.getItem('token'));
    setAccess(Token.previllages);
    if (!Token) {
        router.push({ name: 'login' });
    } else if (Token.expiry < now.getTime()) {
        alert('token has expired');
        localStorage.removeItem('userPrevilage');
        localeStorage.removeItem('token');
        router.push({ name: 'login' });
    }
    if (!isBankAdmin || !isDeveloper) {
        router.push({ name: 'accessDenied' });
    }
};

const setAccess = (access) => {
    switch (access) {
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
            isUnassignedUser.value = true;
            break;
    }
};

const fetchData = () => {
    axios
        .post(apiUrl, {
            page: currentPage.value,
            limit: limit.value,
            keyword: keyword.value
        })
        .then((response) => {
            isLoading.value = false;
            const responseData = response.data;
            const data = responseData.data;
            const status = responseData.status;
            const startIndex = (currentPage.value - 1) * limit.value + 1;
            const historyBanksData = data.list.map((item, index) => ({
                ...item,
                No: startIndex + index
            }));

            datas.value = historyBanksData;
            totalPages.value = data.totalPages;
            totalElements.value = data.totalElements;

            showPaginator.value = datas.value.length > 0;

        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data dari API', life: 3000 });
            isLoading.value = false;
        });
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: 'numeric',
        hour12: true
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('id-ID', options);
};

const getKeteranganText = (keterangan) => {
    switch (keterangan) {
        case 1:
            return 'Setor';
        case 2:
            return 'Ambil';
        case 3:
            return 'Transfer';
        case 4:
            return 'Bayar Telpon';
        default:
            return '';
    }
};

const handlePageChange = (event) => {
    currentPage.value = event.page + 1; // Event.page dimulai dari 0, tambahkan 1
    fetchData(); // Ambil data untuk halaman baru
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />

                <div v-if="isLoading" class="text-center mt-4">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                </div>

                <div v-if="!isLoading">
                    <!-- Tabel data -->
                    <DataTable ref="dt" :value="datas" v-model:selection="selectedDatas" dataKey="id"
                        responsiveLayout="scroll" :rowHover="true">
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Histori Nasabah</h5>
                            </div>
                        </template>

                        <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                        <Column field="No" header="No" :sortable="false" headerStyle="width:5%; min-width:5rem;"
                            bodyStyle="height: 70px;">
                            <template #body="slotProps">
                                <span class="p-column-title">No</span>
                                {{ slotProps.data.No }}
                            </template>
                        </Column>
                        <Column field="nama" header="Nama" :sortable="false" headerStyle="width:20%; min-width:8rem;"
                            bodyStyle="height: 70px;">
                            <template #body="slotProps">
                                <span class="p-column-title">Nama</span>
                                {{ slotProps.data.nama }}
                            </template>
                        </Column>
                        <Column field="norek" header="Nomor Rekening" :sortable="false"
                            headerStyle="width20%; min-width:10rem;" bodyStyle="height: 70px;">
                            <template #body="slotProps">
                                <span class="p-column-title">Nomor Rekening</span>
                                {{ slotProps.data.norek }}
                            </template>
                        </Column>
                        <Column field="tanggal" header="Tanggal Transaksi" :sortable="false"
                            headerStyle="width:20%; min-width:12rem;" bodyStyle="height: 70px;">
                            <template #body="slotProps">
                                <span class="p-column-title">Tanggal Transaksi</span>
                                {{ formatDateTime(slotProps.data.tanggal) }}
                            </template>
                        </Column>
                        <Column field="uang" header="Uang" :sortable="false" headerStyle="width:20%; min-width:10rem;"
                            bodyStyle="height: 70px;">
                            <template #body="slotProps">
                                <span class="p-column-title">Uang</span>
                                {{ formatCurrency(slotProps.data.uang) }}
                            </template>
                        </Column>
                        <Column field="status_ket" header="Keterangan" :sortable="false"
                            headerStyle="width:20%; min-width:10rem;" bodyStyle="height: 70px;">
                            <template #body="slotProps">
                                <span class="p-column-title">Keterangan</span>
                                {{ getKeteranganText(slotProps.data.status_ket) }}
                            </template>
                        </Column>
                        <Column field="norek_dituju" header="Rekening Tujuan" :sortable="false"
                            headerStyle="width:20%; min-width:10rem;" bodyStyle="height: 70px;">
                            <template #body="slotProps">
                                <span class="p-column-title">Rekening Tujuan</span>
                                {{ slotProps.data.norek_dituju !== null ? slotProps.data.norek_dituju : '-' }}
                            </template>
                        </Column>
                        <Column field="no_tlp" header="Nomor Telepon" :sortable="false"
                            headerStyle="width:20%; min-width:10rem;" bodyStyle="height: 70px;">
                            <template #body="slotProps">
                                <span class="p-column-title">Nomor Telepon</span>
                                {{ slotProps.data.no_tlp !== null ? slotProps.data.no_tlp : '-' }}
                            </template>
                        </Column>
                        <template #empty>
                            <div class="p-datatable-emptymessage">Tidak ada hasil yang ditemukan.</div>
                        </template>
                    </DataTable>
                    <Paginator :rows="limit" :totalRecords="totalElements" v-if="showPaginator"
                        :rowsPerPageOptions="[10, 20, 30]"
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" @page="handlePageChange">
                    </Paginator>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.p-datatable-emptymessage {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
