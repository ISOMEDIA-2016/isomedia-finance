function zakaz() {
  return {
    orders: [],
    xizmatlar: [],
    xodimlar: [],
    yonalishlar: [],
    filterMonth: new Date().toISOString().slice(0, 7),
    filterStatus: '',
    filterYonalish: '',
    showForm: false,
    formData: {},
    editRowId: null,
    loading: false,
    error: '',

    async init() {
      this.loading = true;
      try {
        const [orders, xizmatlar, xodimlar, yonalishlar] = await Promise.all([
          api.read('Zakaz', { month: this.filterMonth }),
          api.read('DB_Xizmat'),
          api.read('DB_Xodimlar'),
          api.read("DB_Yo'nalish")
        ]);
        this.orders = orders;
        this.xizmatlar = xizmatlar;
        this.xodimlar = xodimlar.filter(x => x.Status === 'aktiv');
        this.yonalishlar = yonalishlar;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async applyFilter() {
      this.loading = true;
      try {
        let orders = await api.read('Zakaz', { month: this.filterMonth });
        if (this.filterStatus)   orders = orders.filter(o => o.Status === this.filterStatus);
        if (this.filterYonalish) orders = orders.filter(o => o["Yo'nalish"] === this.filterYonalish);
        this.orders = orders;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    autoFillPrice() {
      const yn = this.formData.Yonalish;
      const it = this.formData.Ish_turi;
      const xizmat = this.xizmatlar.find(x => x["Yo'nalish"] === yn && x.Ish_turi === it);
      if (xizmat) {
        this.formData.Narxi = xizmat.Narxi_dollar || xizmat.Narxi_sum || '';
        this.calcJami();
      }
    },

    calcJami() {
      const soni = Number(this.formData.Soni) || 0;
      const narxi = Number(this.formData.Narxi) || 0;
      this.formData.Jami = soni * narxi;
      this.calcQoldiq();
    },

    calcQoldiq() {
      const jami = Number(this.formData.Jami) || 0;
      const avans = Number(this.formData.Avans) || 0;
      this.formData.Qoldiq = jami - avans;
    },

    openAdd() {
      this.formData = {
        Sana: new Date().toISOString().split('T')[0],
        Mijoz: '',
        SubMijoz: '',
        Yonalish: '',
        Ish_turi: '',
        Soni: 1,
        Narxi: '',
        Jami: '',
        Avans: 0,
        Qoldiq: '',
        Operator1: '',
        Operator2: '',
        Montajchi: '',
        Status: "To'lanmadi",
        Izoh: ''
      };
      this.editRowId = null;
      this.showForm = true;
    },

    openEdit(row) {
      this.formData = {
        Sana: row.Sana,
        Mijoz: row.Mijoz,
        SubMijoz: row['Sub-mijoz'],
        Yonalish: row["Yo'nalish"],
        Ish_turi: row.Ish_turi,
        Soni: row.Soni,
        Narxi: row.Narxi,
        Jami: row.Jami,
        Avans: row.Avans,
        Qoldiq: row.Qoldiq,
        Operator1: row.Operator1,
        Operator2: row.Operator2,
        Montajchi: row.Montajchi,
        Status: row.Status,
        Izoh: row.Izoh
      };
      this.editRowId = row._rowId;
      this.showForm = true;
    },

    buildData() {
      return {
        Sana: this.formData.Sana,
        Mijoz: this.formData.Mijoz,
        'Sub-mijoz': this.formData.SubMijoz,
        "Yo'nalish": this.formData.Yonalish,
        Ish_turi: this.formData.Ish_turi,
        Soni: this.formData.Soni,
        Narxi: this.formData.Narxi,
        Jami: this.formData.Jami,
        Avans: this.formData.Avans,
        Qoldiq: this.formData.Qoldiq,
        Operator1: this.formData.Operator1,
        Operator2: this.formData.Operator2,
        Montajchi: this.formData.Montajchi,
        Status: this.formData.Status,
        Izoh: this.formData.Izoh
      };
    },

    async save() {
      if (!this.formData.Mijoz || !this.formData.Yonalish) {
        this.error = "Mijoz va Yo'nalish majburiy";
        return;
      }
      this.loading = true;
      try {
        const data = this.buildData();
        if (this.editRowId) {
          await api.update('Zakaz', this.editRowId, data);
          const idx = this.orders.findIndex(o => o._rowId === this.editRowId);
          if (idx !== -1) this.orders[idx] = { ...data, _rowId: this.editRowId };
        } else {
          const res = await api.write('Zakaz', data);
          this.orders.unshift({ ...data, _rowId: res.rowId });
        }
        this.showForm = false;
        this.error = '';
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async remove(row) {
      if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
      this.loading = true;
      try {
        await api.remove('Zakaz', row._rowId);
        let orders = await api.read('Zakaz', { month: this.filterMonth });
        if (this.filterStatus)   orders = orders.filter(o => o.Status === this.filterStatus);
        if (this.filterYonalish) orders = orders.filter(o => o["Yo'nalish"] === this.filterYonalish);
        this.orders = orders;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    totalRevenue() {
      return this.orders.reduce((s, o) => s + (Number(o.Jami) || 0), 0);
    },

    totalDebt() {
      return this.orders.reduce((s, o) => s + (Number(o.Qoldiq) || 0), 0);
    },

    statusBadge(status) {
      if (status === "To'landi") return 'badge-green';
      if (status === 'Qisman')   return 'badge-orange';
      return 'badge-red';
    },

    fmt(n) {
      if (n === null || n === undefined || n === '') return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    }
  };
}
