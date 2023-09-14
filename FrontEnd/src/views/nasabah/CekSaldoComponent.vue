<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <h2>Cek Saldo</h2>
                <form @submit.prevent="getSaldo">
                    <div>
                        <div>
                            <h5>No. Rekening:</h5>
                            <InputText type="number" v-model="norek" class="custom-input"
                                :class="{ 'p-invalid': nomorRekeningError }" required /><br />&nbsp;
                            <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
                            <br />&nbsp;
                            <Button label="Cek Saldo" class="custom-button" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <Dialog v-if="showModal" v-model:visible="showModal" modal header="Informasi Saldo" :style="{ width: '50vw' }">
        <p>Nomor Rekening : {{ nasabah.norek }}</p>
        <p>Nama Nasabah : {{ nasabah.nama }}</p>
        <p>Saldo Nasabah : {{ nasabah.saldo }}</p>
    </Dialog>
</template>

<script>
// import axios
import axios from "axios";
import Swal from 'sweetalert2';

export default {
    name: "CekSaldoComponent",
    data() {
        return {
            norek: "",
            nasabah: {},
            nomorRekeningError: false,
            showModal: false,
            nama: "",
            saldo: "",
        };
    },

    methods: {
        async getSaldo() {

            //validasi required field
            if (!this.norek) {
                this.nomorRekeningError = true;
                return;
            } else {
                this.nomorRekeningError = false;
            }

            //get database
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/nasabah/cekSaldo?norek=${this.norek}`,
                    {
                        norek: Number(this.norek)
                    }
                );
                this.nasabah = response.data;
                this.showModal = true;
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    text: error.response.data
                });
            }
        },
    },
};
</script>

<style>
.custom-input {
    width: 200px;
    height: 40px;
    font-size: 16px;
}

.custom-button {
    width: 100px;
    height: 40px;
    font-size: 16px;
}

.p-invalid {
    border-color: red;
    /* Warna border merah jika input tidak valid */
}

.p-error {
    color: red;
    /* Warna teks merah untuk pesan kesalahan */
}
</style>
