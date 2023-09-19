<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <h2 style="margin-bottom: 25px;">Tarik Dana</h2>
        <form @submit.prevent="tarikDana">
          <div>
            <div>
              <h5>Masukkan Nomor Rekening Anda:</h5>
              <InputText type="text" v-model="norek" class="custom-input" :class="{ 'p-invalid': nomorRekeningError }"
                required />
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
            </div>
          </div>
          <div> &nbsp
            <Button label="Cek Rekening" class="custom-button" type="submit" />
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal info nasabah -->
  <Dialog v-if="showModal" v-model:visible="showModal" modal header="Informasi Rekening" :style="{ width: '50vw' }">
    <div style="text-align: center; line-height: 1; font-size: 20px; margin-top: 10px;">
      <p>Nomor Rekening : {{ nasabah.norek }}</p>
      <p>Nama Nasabah : {{ nasabah.nama }}</p>
      <p>Saldo saat ini: Rp. {{ numberWithDot(nasabah.saldo) }}</p>
      <div>
        <h3> Jumlah Tarik:</h3>
        <InputText type="text" v-model="jumlahTarik" class="custom-input" :class="{ 'p-invalid': jumlahTarikError }"
          required />
      </div>
      <div style="margin: 20px;">
        <Button label="Tarik Dana" class="custom-button" @click="prosesTarikDana" />
      </div>
    </div>
  </Dialog>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  name: "TarikDanaComponent",
  data() {
    return {
      norek: "",
      nomorRekeningError: false,
      jumlahTarik: "",
      showModal: false,
      nasabah: {},
    };
  },
  methods: {
    numberWithDot(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    async tarikDana() {
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
        this.nasabah.saldo = parseFloat(this.nasabah.saldo)
        this.showModal = true;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          text: error.response.data,
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      }
    },

    async prosesTarikDana() {
      if (!this.jumlahTarik) {
        this.jumlahTarikError = true;
        return;
      } else {
        this.jumlahTarikError = false;
      }

      // Periksa apakah jumlah penarikan dana kurang dari 50,000
      if (this.jumlahTarik < 50000) {
        Swal.fire({
          icon: 'error',
          text: 'Jumlah penarikan dana minimum Rp.50,000.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      // memeriksa apakah saldo cukup
      if (this.jumlahTarik > this.nasabah.saldo) {
        Swal.fire({
          icon: 'error',
          text: 'Saldo tidak mencukupi untuk menarik dana.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      //Saldo tidak bisa kurang dari 50000
      if (this.nasabah.saldo - this.jumlahTarik < 50000) {
        Swal.fire({
          icon: 'error',
          text: 'Saldo tidak bisa kurang dari Rp 50.000.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/nasabah/tarik`,
          {
            norek: Number(this.norek),
            jumlah: Number(this.jumlahTarik)
          }
        );

        Swal.fire({
          icon: 'success',
          text: 'Dana anda berhasil ditarik.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });

        this.norek = "";
        this.jumlahTarik = "";
        this.showModal = false;

      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: 'error',
          text: error.response.data,
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      }
    },
  },
  filters: {
    formatCurrency: function (value) {
      if (!isNaN(value)) {
        return `Rp. ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
      }
      return value;
    }
  }
};
</script>

<style>
.custom-class {
  z-index: 10000;
}

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

.custom-input {
  width: 200px;
  height: 40px;
  font-size: 16px;
}
</style>
