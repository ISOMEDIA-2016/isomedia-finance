function hisobot() {
  return {
    activeTab: 'pl',
    plData: [],
    ddsData: [],
    doimiyData: [],
    loading: false,
    error: '',
    charts: {},

    async init() {
      this.loading = true;
      try {
        const [allKassa, manbalar] = await Promise.all([
          api.read('Kassa'),
          api.read('DB_Manbalar')
        ]);
        this.buildPL(allKassa);
        this.buildDDS(allKassa);
        this.buildDoimiy(allKassa, manbalar);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
      this.$nextTick(() => this.renderCharts());
    },

    buildPL(ops) {
      const months = {};
      ops.forEach(op => {
        const d = new Date(op.Sana);
        if (isNaN(d.getTime())) return;
        const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        if (!months[key]) months[key] = { kirim: 0, chiqim: 0 };
        const amt = Number(op.Summa) || 0;
        if (op.Turi === 'Kirim')  months[key].kirim  += amt;
        if (op.Turi === 'Chiqim') months[key].chiqim += amt;
      });
      this.plData = Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([oy, v]) => ({
          oy,
          kirim:  v.kirim,
          chiqim: v.chiqim,
          foyda:  v.kirim - v.chiqim
        }));
    },

    buildDDS(ops) {
      let balance = 0;
      const months = {};
      const sorted = [...ops].sort((a, b) => new Date(a.Sana) - new Date(b.Sana));
      sorted.forEach(op => {
        const d = new Date(op.Sana);
        if (isNaN(d.getTime())) return;
        const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        if (!months[key]) months[key] = { open: balance, kirim: 0, chiqim: 0 };
        const amt = Number(op.Summa) || 0;
        if (op.Turi === 'Kirim')  { months[key].kirim  += amt; balance += amt; }
        if (op.Turi === 'Chiqim') { months[key].chiqim += amt; balance -= amt; }
      });
      this.ddsData = Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([oy, v]) => ({
          oy,
          open:   v.open,
          kirim:  v.kirim,
          chiqim: v.chiqim,
          close:  v.open + v.kirim - v.chiqim
        }));
    },

    buildDoimiy(ops, manbalar) {
      const doimiyNames = new Set(
        manbalar
          .filter(m => m.Doimiy === 'TRUE' || m.Doimiy === true || m.Doimiy === 'true')
          .map(m => m.Nomi)
      );
      const months = {};
      ops
        .filter(op => op.Turi === 'Chiqim' && doimiyNames.has(op.Manbalar))
        .forEach(op => {
          const d = new Date(op.Sana);
          if (isNaN(d.getTime())) return;
          const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
          if (!months[key]) months[key] = {};
          const manba = op.Manbalar;
          months[key][manba] = (months[key][manba] || 0) + (Number(op.Summa) || 0);
        });
      this.doimiyData = Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([oy, cats]) => ({
          oy,
          ...cats,
          total: Object.values(cats).reduce((s, v) => s + v, 0)
        }));
    },

    doimiyCategories() {
      const cats = new Set();
      this.doimiyData.forEach(row => {
        Object.keys(row).filter(k => k !== 'oy' && k !== 'total').forEach(k => cats.add(k));
      });
      return [...cats];
    },

    renderCharts() {
      if (this.activeTab === 'pl' && this.plData.length) {
        const ctx = document.getElementById('plChart');
        if (!ctx) return;
        if (this.charts.pl) this.charts.pl.destroy();
        this.charts.pl = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.plData.map(r => this.fmtMonth(r.oy)),
            datasets: [
              { label: 'Kirim',  data: this.plData.map(r => r.kirim),  backgroundColor: '#34C759' },
              { label: 'Chiqim', data: this.plData.map(r => r.chiqim), backgroundColor: '#FF3B30' },
              { label: 'Foyda',  data: this.plData.map(r => r.foyda),  backgroundColor: '#5856D6', type: 'line', tension: 0.3 }
            ]
          },
          options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
      }
    },

    setTab(tab) {
      this.activeTab = tab;
      this.$nextTick(() => this.renderCharts());
    },

    fmt(n) {
      if (n === null || n === undefined || n === '') return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    },

    fmtMonth(oy) {
      if (!oy) return '';
      const [yr, mo] = oy.split('-').map(Number);
      const months = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];
      return (months[mo - 1] || mo) + ' ' + yr;
    }
  };
}
