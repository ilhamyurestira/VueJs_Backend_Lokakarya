<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <h2>Setor</h2>
        <form @submit.prevent="setor">
          <div>
            <div>
              <h5>Nomor Rekening Tujuan:</h5>
              <InputText type="number" v-model="norek" class="custom-input" :class="{ 'p-invalid': nomorRekeningError }"
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
    <p>Nomor Rekening : {{ infoNasabah.norek }}</p>
    <p>Nama Pemilik Rekening : {{ infoNasabah.nama }}</p>
    <p>Saldo : {{ infoNasabah.saldo }}</p>
    <div>
      <h3>Nominal Setor:</h3>
      <InputText type="number" v-model="jumlah" class="custom-input" :class="{ 'p-invalid': jumlahSetorError }"
        required />
    </div>
    <div style="margin: 10px;">
      <Button label="Setor" class="custom-button" @click="handleSetor" type="submit"/>
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
      jumlah: "",
      infoNasabah: {},
      setorSuccess: false,
      setorErrorMessage: "",
      jumlahSetorError: ""
    };
  },
  methods: {
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

      if (!this.jumlah) {
        this.jumlahSetorError = true;
        return;
      } else {
        this.jumlahSetorError = false;
      }
      
      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/nasabah/tambah`,
          {
            norek: Number(this.norek),
            jumlah: Number(this.jumlah)
          }
        );

        this.nasabah = response.data;

        Swal.fire({
          icon: 'success',
          text: 'Berhasil setor.'
        });

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
