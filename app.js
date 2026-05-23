function app() {
  return {
    user: null,
    page: 'dashboard',
    loginForm: { username: '', password: '' },
    loginError: '',
    loading: false,

    init() {
      const saved = sessionStorage.getItem('isomedia_user');
      if (saved) {
        this.user = JSON.parse(saved);
        this.page = 'dashboard';
      }
    },

    login() {
      const match = USERS.find(u =>
        u.username === this.loginForm.username &&
        u.password === this.loginForm.password
      );
      if (match) {
        this.user = { username: match.username, role: match.role };
        sessionStorage.setItem('isomedia_user', JSON.stringify(this.user));
        this.loginError = '';
        this.page = 'dashboard';
      } else {
        this.loginError = "Login yoki parol noto'g'ri";
      }
    },

    logout() {
      sessionStorage.removeItem('isomedia_user');
      this.user = null;
      this.page = 'dashboard';
      this.loginForm = { username: '', password: '' };
    },

    navigate(pg) {
      if (this.canAccess(pg)) this.page = pg;
    },

    canAccess(pg) {
      if (!this.user) return false;
      const perms = {
        dashboard: ['admin', 'operator', 'viewer'],
        kassa:     ['admin', 'operator'],
        zakaz:     ['admin', 'operator'],
        maosh:     ['admin', 'operator'],
        hisobot:   ['admin', 'viewer'],
        db:        ['admin', 'operator']
      };
      return (perms[pg] || []).includes(this.user.role);
    },

    canWrite() {
      return this.user && ['admin', 'operator'].includes(this.user.role);
    },

    isAdmin() {
      return this.user && this.user.role === 'admin';
    },

    navItems() {
      return [
        { id: 'dashboard', label: 'Dashboard',      icon: 'home'    },
        { id: 'kassa',     label: 'Kassa',           icon: 'wallet'  },
        { id: 'zakaz',     label: 'Zakaz',           icon: 'list'    },
        { id: 'maosh',     label: 'Maosh',           icon: 'users'   },
        { id: 'hisobot',   label: 'Hisobot',         icon: 'chart'   },
        { id: 'db',        label: "Ma'lumotnoma",    icon: 'db'      }
      ].filter(item => this.canAccess(item.id));
    }
  };
}
