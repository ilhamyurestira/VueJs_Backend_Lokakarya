<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <h2 style="margin-bottom: 25px;">Setor</h2>
        <form @submit.prevent="setor">
          <div>
            <div>
              <h5>Masukkan Rekening Tujuan:</h5>
              <InputText type="text" v-model="norek" class="custom-input" :class="{ 'p-invalid': nomorRekeningError }"
                required /> &nbsp;
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
            </div>
          </div>
          <Button label="Cek Rekening" class="custom-button" type="submit" />
        </form>
      </div>
    </div>
  </div>

  <Dialog v-if="showModal" v-model:visible="showModal" modal header="Setor" :style="{ width: '50vw' }">
    <div style="text-align: center; line-height: 1;font-size: 20px; margin-top: 10px;">
      <p>Nomor Rekening : {{ infoNasabah.norek }}</p>
      <p>Nama Pemilik Rekening : {{ infoNasabah.nama }}</p>
      <p>Saldo : {{ numberWithDot(infoNasabah.saldo) }}</p>
      <div>
        <h3>Nominal Setor:</h3>
        <InputText type="text" v-model="formattedJumlah" class="custom-input" :class="{ 'p-invalid': jumlahSetorError }"
          required />
        <!-- <span v-if="jumlahSetorError" class="p-error"> Nilai minimum setoran adalah Rp 10.000</span> -->
      </div>
      <div style="margin: 10px;">
        <Button label="Setor" class="custom-button" @click="handleSetor" type="submit" />
      </div>
    </div>
  </Dialog>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  name: "SetorComponent",
  data() {
    return {
      norek: "",
      nasabah: {},
      nomorRekeningError: false,
      showModal: false,
      nama: "",
      saldo: "",
      formattedJumlah: "",
      infoNasabah: {},
      setorSuccess: false,
      setorErrorMessage: "",
      jumlahSetorError: "",
      showModal: false
    };
  },
  methods: {
    numberWithDot(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    computed: {
    // Buat computed property untuk mengatur format jumlah
    formattedJumlah: {
      get() {
        // Mengambil nilai jumlah dari data dan mengatur formatnya
        return this.jumlah ? `Rp. ${this.numberWithDot(this.jumlah)}` : "";
      },
      set(newValue) {
        // Mengubah format ke angka saat input berubah
        const formattedValue = newValue.replace(/[^\d]/g, "");
        this.jumlah = formattedValue;
      },
    },
  },

  

    async setor() {

      if (!this.norek) {
        this.nomorRekeningError = true;
        return;
      } else {
        this.nomorRekeningError = false;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/nasabah/allData/${this.norek}`,
          {
            norek: Number(this.norek),
          }
        );

        this.infoNasabah = response.data;
        this.showModal = true;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          text: error.response.data
        });
      }
    },

    async handleSetor() {

      if (!this.formattedJumlah || isNaN(this.formattedJumlah)) {
        this.jumlahSetorError = true;
        return;
      } else {
        this.jumlahSetorError = false;
      }

      // Periksa apakah jumlah setoran kurang dari 50,000
      if (this.formattedJumlah < 50000) {
        Swal.fire({
          icon: 'error',
          text: 'Jumlah setoran minimum adalah Rp 50,000.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/nasabah/tambah`,
          {
            norek: Number(this.norek),
            jumlah: Number(this.formattedJumlah)
          }
        );

        this.nasabah = response.data;

        Swal.fire({
          icon: 'success',
          text: 'Setoran anda berhasil dikirim.',
          customClass: {
            container: 'custom-class',
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          appendTo: 'body'
        });

        this.norek = "";
        this.formattedJumlah = "";
        this.showModal = false;

      } catch (error) {
        console.log(error);

        Swal.fire({
          icon: 'error',
          text: error.response.data,
          customClass: {
            container: 'custom-class',
          },
          appendTo: 'body'
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

.custom-class {
  z-index: 10000;
}

.custom-input {
  width: 200px;
  height: 40px;
  font-size: 16px;
}
</style>
