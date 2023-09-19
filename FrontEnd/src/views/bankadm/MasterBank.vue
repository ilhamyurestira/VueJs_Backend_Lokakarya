<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';

import axios from 'axios'; // Import Axios

const currentPage = ref(1);
const totalPages = ref(0);
const totalElements = ref(0);
const limit = ref(5); // Nilai default limit
const keyword = ref('');

const showPaginator = ref(false);

const toast = useToast();

const datas = ref([]);
const apiUrl = 'http://localhost:8000/api/v1/masterBank'; // Replace with your API URL
const dataDialog = ref(false);
const deleteDialog = ref(false);
const data = ref({});
const selectedDatas = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});
// Fetch data from the API on component mount
onMounted(() => {
    fetchData();
    fetchUsers();
});
const formatCurrency = (value) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

const usersList = ref([]);

const fetchUsers = () => {
    axios
        .get('http://localhost:8000/api/v1/admin/manage/users')
        .then((response) => {
            // Response dari API berisi daftar pengguna
            const users = response.data; // Asumsikan API mengembalikan array objek pengguna
            // Assign daftar pengguna ke variabel di dalam data
            usersList.value = users;
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
        });
};

const fetchData = () => {
    axios
        .post(apiUrl, {
            page: currentPage.value,
            limit: limit.value,
            keyword: keyword.value
        })
        .then((response) => {
            const responseData = response.data;
            const data = responseData.data;
            const status = responseData.status;
            const startIndex = (currentPage.value - 1) * limit.value + 1;
            const masterBanksData = data.list.map((item, index) => ({
                ...item,
                No: startIndex + index,
            }));

            datas.value = masterBanksData;
            totalPages.value = data.totalPages;
            totalElements.value = data.totalElements;

            showPaginator.value = datas.value.length > 0;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data dari API', life: 3000 });
        });
};

const handlePageChange = (event) => {
    currentPage.value = event.page + 1; // Event.page dimulai dari 0, tambahkan 1
    fetchData(); // Ambil data untuk halaman baru
};

const openNew = () => {
    data.value = {};
    submitted.value = false;
    dataDialog.value = true;
    currentPage.value = 1; // Set currentPage kembali ke 1
};

const hideDialog = () => {
    dataDialog.value = false;
    submitted.value = false;
    data.value = {};
};

const saveRekening = () => {
    submitted.value = true;
    if (data.value.userId && data.value.saldo >= 100000) {
        // Validasi saldo minimal 100000
        const newData = {
            userId: data.value.userId,
            saldo: parseInt(data.value.saldo),
        };

        // Kirim permintaan POST ke BE
        axios
            .post(`${apiUrl}/tambah`, newData)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `Rekening atas nama "${data.nama}" berhasil dibuat`,
                        life: 3000,
                    });
                    fetchData(); // Refresh data
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Rekening gagal dibuat`,
                        life: 3000,
                    });
                }
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Rekening gagal dibuat`,
                    life: 3000,
                });
            });
        dataDialog.value = false;
        data.value = {};
    }
};

const confirmDeleteRekening = (editdata) => {
    data.value = editdata;
    deleteDialog.value = true;
};

const deleteRekening = () => {
    deleteRekeningById(data.value.id);
    deleteDialog.value = false;
    data.value = {};
};

const deleteRekeningById = (id) => {
    axios
        .delete(`${apiUrl}/hapus/${id}`)
        .then((response) => {
            if (response.status === 200) {
                // Successful deletion
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'data Deleted',
                    life: 3000,
                });
                fetchData(); // Refresh the data after deletion
            } else {
                // Handle deletion failure
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete data',
                    life: 3000,
                });
            }
        })
        .catch((error) => {
            // Handle API request error
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete data',
                life: 3000,
            });
        });
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const search = () => {
    fetchData();
    data.value = {};
};

const clearInput = () => {
    keyword.value = "";
    fetchData();
}

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <!-- Button nambah data baru -->
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Buat Rekening" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openNew" />
                        </div>
                    </template>

                </Toolbar>

                <!-- Tabel data -->
                <DataTable ref="dt" :value="datas" v-model:selection="selectedDatas" dataKey="id" @page="handlePageChange"
                    :rowHover="true">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Data Nasabah</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="keyword" @keydown.enter="search" placeholder="Cari Nama..." />
                                <Button icon="pi pi-times" @click="clearInput" severity="secondary" v-if="keyword" text
                                    class="clear-icon" />
                            </span>
                        </div>
                    </template>

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <Column field="No" header="No" :sortable="false" headerStyle="width:5%; min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No</span>
                            {{ slotProps.data.No }}
                        </template>
                    </Column>
                    <Column field="nama" header="Nama" :sortable="false" headerStyle="width20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama</span>
                            {{ slotProps.data.nama }}
                        </template>
                    </Column>
                    <Column field="noTlp" header="No Telpon" :sortable="false" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No Telpon</span>
                            {{ slotProps.data.noTlp }}
                        </template>
                    </Column>
                    <Column field="alamat" header="Alamat" :sortable="false" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Alamat</span>
                            {{ slotProps.data.alamat }}
                        </template>
                    </Column>
                    <Column field="norek" header="No Rekening" :sortable="false" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No Rekening</span>
                            {{ slotProps.data.norek }}
                        </template>
                    </Column>
                    <Column field="saldo" header="Saldo" :sortable="false" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Saldo</span>
                            {{ slotProps.data.saldo !== null ? formatCurrency(slotProps.data.saldo) : 'Rp 0' }}
                        </template>
                    </Column>
                    <Column header="Action" headerStyle="width:20%;min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editdata(slotProps.data)" /> -->
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeleteRekening(slotProps.data)" />
                        </template>
                    </Column>

                    <template #empty>
                        <div class="p-datatable-emptymessage">
                            Tidak ada hasil yang ditemukan.
                        </div>
                    </template>
                </DataTable>
                <Paginator :rows="limit" :totalRecords="totalElements" v-if="showPaginator"
                    :rowsPerPageOptions="[10, 20, 30]"
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" @page="handlePageChange">
                </Paginator>

                <!-- Dialog untuk tambah dan edit data -->
                <Dialog v-model:visible="dataDialog" :style="{ width: '450px' }" header="Buat Rekening Baru" :modal="true"
                    class="p-fluid">
                    <div class="field">
                        <label for="nama">Nama</label>
                        <Dropdown v-model="data.userId" optionLabel="nama" optionValue="id" :options="usersList"
                            placeholder="Pilih User" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !data.userId }" />
                        <small class="p-invalid" v-if="submitted && !data.userId">Nama harus diisi.</small>
                    </div>
                    <div class="field">
                        <label for="saldo">Saldo</label>
                        <InputNumber v-model="data.saldo" inputId="currency-indonesia" mode="currency" currency="IDR"
                            locale="id-ID" id="saldo" required="true" autofocus
                            :class="{ 'p-invalid': submitted && (!data.saldo || data.saldo < 100000 || data.saldo > 999999999) }" />
                        <small class="p-invalid" v-if="submitted && (!data.saldo || data.saldo < 100000)">Saldo harus diisi
                            minimal Rp 100.000.</small>
                        <small class="p-invalid" v-if="submitted && (data.saldo > 999999999)">Pengisian saldo maksimal Rp
                            999.999.999.</small>
                    </div>
                    <template #footer>
                        <Button label="Batal" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Simpan" icon="pi pi-check" class="p-button-text" @click="saveRekening" />
                    </template>
                </Dialog>

                <!-- Dialog untuk yakin hapus data -->
                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="data">Are you sure you want to delete <b>{{ data.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteRekening" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="data">Apakah kamu yakin menghapus Rekening dengan Nomor Rekening : <b>{{ data.norek
                        }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteRekening" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
button.p-button-secondary.p-button-icon-only.clear-icon {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
}

.p-datatable .p-datatable-tbody>tr>td {
    height: 70px;
}

.p-datatable-emptymessage {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
