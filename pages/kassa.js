function kassa() {
  return {
    activeTab: 'operatsiyalar',
    operations: [],
    balances: {},
    manbalar: [],
    hamyonlar: [],
    xodimlar: [],
    yonalishlar: [],
    showForm: false,
    formType: 'Kirim',
    formData: {},
    dateFrom: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 10);
      return d.toISOString().split('T')[0];
    })(),
    dateTo: new Date().toISOString().split('T')[0],
    filterHamyon: '',
    filterTuri: '',
    loading: false,
    error: '',

    async init() {
      this.loading = true;
      try {
        const [ops, manbalar, hamyonlar, xodimlar, yonalishlar, allOps] = await Promise.all([
          api.read('Kassa', { dateFrom: this.dateFrom, dateTo: this.dateTo }),
          api.read('DB_Manbalar'),
          api.read('DB_Hamyon'),
          api.read('DB_Xodimlar'),
          api.read("DB_Yo'nalish"),
          api.read('Kassa')
        ]);
        this.operations = ops;
        this.manbalar = manbalar;
        this.hamyonlar = hamyonlar.filter(h => h.Status === 'aktiv');
        this.xodimlar = xodimlar.filter(x => x.Status === 'aktiv');
        this.yonalishlar = yonalishlar;
        this.calcBalances(allOps);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    calcBalances(allOps) {
      const bal = {};
      allOps.forEach(op => {
        const hw = op['Hamyon'];
        if (!hw) return;
        if (!bal[hw]) bal[hw] = 0;
        const amt = Number(op['Summa']) || 0;
        bal[hw] += op['Turi'] === 'Kirim' ? amt : -amt;
      });
      this.balances = bal;
    },

    async applyFilter() {
      this.loading = true;
      try {
        const params = { dateFrom: this.dateFrom, dateTo: this.dateTo };
        let ops = await api.read('Kassa', params);
        if (this.filterHamyon) ops = ops.filter(o => o['Hamyon'] === this.filterHamyon);
        if (this.filterTuri)   ops = ops.filter(o => o['Turi'] === this.filterTuri);
        this.operations = ops;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    openForm(turi) {
      this.formType = turi;
      this.formData = {
        Sana: new Date().toISOString().split('T')[0],
        Turi: turi,
        Summa: '',
        Valyuta: "So'm",
        Kurs: '',
        Hamyon: '',
        Manbalar: '',
        Yonalish: '',
        Bolim: '',
        Aktiv: '',
        Passiv: '',
        Izoh: '',
        Xodim: ''
      };
      this.showForm = true;
    },

    async save() {
      if (!this.formData.Summa || !this.formData.Hamyon || !this.formData.Manbalar) {
        this.error = "Summa, Hamyon va Manbalar majburiy";
        return;
      }
      this.loading = true;
      try {
        const data = {
          Sana: this.formData.Sana,
          Turi: this.formType,
          Summa: this.formData.Summa,
          Valyuta: this.formData.Valyuta,
          Kurs: this.formData.Kurs,
          Hamyon: this.formData.Hamyon,
          Manbalar: this.formData.Manbalar,
          "Yo'nalish": this.formData.Yonalish,
          "Bo'lim": this.formData.Bolim,
          Aktiv: this.formData.Aktiv,
          Passiv: this.formData.Passiv,
          Izoh: this.formData.Izoh,
          Xodim: this.formData.Xodim
        };
        const res = await api.write('Kassa', data);
        this.operations.unshift({ ...data, _rowId: res.rowId });
        const allOps = await api.read('Kassa');
        this.calcBalances(allOps);
        this.showForm = false;
        this.error = '';
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async remove(row) {
      if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
      this.loading = true;
      try {
        await api.remove('Kassa', row._rowId);
        this.operations = this.operations.filter(o => o._rowId !== row._rowId);
        const allOps = await api.read('Kassa');
        this.calcBalances(allOps);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    filteredManbalar() {
      return this.manbalar.filter(m =>
        this.formType === 'Kirim' ? m.Turi === 'Kirim' : m.Turi === 'Chiqim'
      );
    },

    fmt(n) {
      if (n === null || n === undefined || n === '') return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    }
  };
}
