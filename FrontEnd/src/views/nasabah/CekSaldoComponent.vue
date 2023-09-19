<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <h2 style="margin-bottom: 25px; ">Cek Saldo</h2>
        <form @submit.prevent="getSaldo">
          <div>
            <div>
              <h5 style="margin-bottom: 10px;">Masukkan Nomor Rekening Anda:</h5>
              <InputText type="text" v-model="norek" class="custom-input" :class="{ 'p-invalid': nomorRekeningError }"
                required />
              <br />&nbsp;
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
              <br />
              <Button label="Cek Saldo" class="custom-button" type="submit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal info nasabah  -->
  <Dialog v-if="showModal" v-model:visible="showModal" modal header="Informasi Saldo" :style="{ width: '50vw' }">
    <div style="text-align: center; line-height: 1;font-size: 20px; margin-top: 10px;">
      <p>Nomor Rekening : {{ nasabah.norek }}</p>
      <p>Nama Nasabah : {{ nasabah.nama }}</p>
      <p>Saldo Nasabah : Rp. {{ numberWithDot(nasabah.saldo) }}</p>
    </div>
  </Dialog>
</template>
  
<script>
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
    numberWithDot(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    async getSaldo() {
      if (!this.norek) {
        this.nomorRekeningError = true;
        return;
      } else {
        this.nomorRekeningError = false;
      }

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
}

.p-error {
  color: red;
}


.p-dialog .p-dialog-header .p-dialog-title {
  font-weight: 500;
  font-size: 25px;
}

.p-dialog .p-dialog-header {
  border-bottom: 0 none;
  background: #b0aec8f7;
  color: #ffffff;
  padding: 1.5rem;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}

.p-icon {
  width: 5rem;
  height: 1rem;
  color: black;
}
</style>
  