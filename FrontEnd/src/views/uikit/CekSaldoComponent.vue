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
                            <Button label="Submit" class="custom-button" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
// import axios
import axios from "axios";
export default {
    data() {
        return {
            norek: "",
            nasabah: [],
        };
    },
    created: function () {
        this.getSaldo()
    },
    methods: {
        async getSaldo() {
            console.log("cek ini", this.norek);
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/nasabah/cekSaldo`, 
                    {
                        norek: Number(this.norek)
                    }
                );
                this.nasabah = response.data;

                if (!norek.value) {
                    nomorRekeningError.value = true;
                    return;
                } else {
                    nomorRekeningError.value = false;
                }
            } catch (err) {
                console.log(err);
            }
        },

        async cancelProcess() {
            this.$router.push("/uikit/CekSaldoComponent");
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
}</style>
